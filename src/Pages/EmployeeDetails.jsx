import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { employeeService } from "../services/employeeService";
import { formatDate } from "../utils/formatDate";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    employeeService
      .getById(id)
      .then((data) => setEmployee(data))
      .catch(() => setError("Employee not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-slate-400">Loading...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">
          {error}
        </div>
        <Link to="/employees" className="text-primary-600 text-sm hover:underline">
          ← Back to employees
        </Link>
      </div>
    );
  }

  // small helper to render a labeled detail row
  const detail = (label, value) => (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{value}</p>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5">
      <Link
        to="/employees"
        className="text-primary-600 text-sm hover:underline inline-block"
      >
        ← Back to employees
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <div className="h-16 w-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-semibold overflow-hidden">
            {employee.image ? (
              <img
                src={employee.image}
                alt={employee.name}
                className="h-full w-full object-cover"
              />
            ) : (
              employee.name.charAt(0)
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800">
              {employee.name}
            </h1>
            <p className="text-sm text-slate-500">{employee.role}</p>
          </div>
          <Badge status={employee.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5">
          {detail("Email", employee.email)}
          {detail("Department", employee.department)}
          {detail("Role", employee.role)}
          {detail("Joining Date", formatDate(employee.joiningDate))}
        </div>

        <div className="flex gap-2 mt-6 pt-5 border-t border-slate-100">
          <Button onClick={() => navigate(`/employees/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="secondary" onClick={() => navigate("/employees")}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
