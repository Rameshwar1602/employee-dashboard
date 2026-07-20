import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { employeeService } from "../services/employeeService";
import { departments, statuses } from "../services/mockData";
import { useEmployeeFilters } from "../hooks/useEmployeeFilters";
import { formatDate } from "../utils/formatDate";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { TableSkeleton } from "../components/ui/Skeleton";

function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    search,
    setSearch,
    department,
    setDepartment,
    status,
    setStatus,
    sortBy,
    sortOrder,
    handleSort,
    page,
    setPage,
    totalPages,
    paginated,
    totalResults,
  } = useEmployeeFilters(employees);

  function loadEmployees() {
    setLoading(true);
    employeeService
      .getAll()
      .then((data) => setEmployees(data))
      .catch(() => setError("Failed to load employees. Please try again."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await employeeService.remove(deleteTarget.id);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setError("Could not delete employee.");
    } finally {
      setDeleting(false);
    }
  }

  // little arrow indicator for the sortable columns
  function sortArrow(column) {
    if (sortBy !== column) return "";
    return sortOrder === "asc" ? " ↑" : " ↓";
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Employees</h1>
          <p className="text-sm text-slate-500">Manage your team members</p>
        </div>
        <Button onClick={() => navigate("/employees/new")}>
          + Add Employee
        </Button>
      </div>

      {/* filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          name="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          name="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={departments}
          placeholder="All Departments"
        />
        <Select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statuses}
          placeholder="All Status"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => {
              setError("");
              loadEmployees();
            }}
            className="underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={6} />
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-500 font-medium">No employees found</p>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your filters or add a new employee.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th
                    className="px-4 py-3 font-medium cursor-pointer select-none"
                    onClick={() => handleSort("name")}
                  >
                    Name{sortArrow("name")}
                  </th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">
                    Department
                  </th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">
                    Role
                  </th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th
                    className="px-4 py-3 font-medium cursor-pointer select-none hidden sm:table-cell"
                    onClick={() => handleSort("joiningDate")}
                  >
                    Joining Date{sortArrow("joiningDate")}
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-medium">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">
                            {emp.name}
                          </p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                      {emp.department}
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                      {emp.role}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={emp.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                      {formatDate(emp.joiningDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/employees/${emp.id}`}
                          className="text-primary-600 hover:underline text-xs"
                        >
                          View
                        </Link>
                        <Link
                          to={`/employees/${emp.id}/edit`}
                          className="text-slate-600 hover:underline text-xs"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* pagination */}
      {!loading && paginated.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-slate-500">
            Showing {paginated.length} of {totalResults} employees
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600 px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Employee"
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-medium">{deleteTarget?.name}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Employees;
