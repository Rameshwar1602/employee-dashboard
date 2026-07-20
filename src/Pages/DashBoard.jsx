import { useEffect, useState } from "react";
import { employeeService } from "../services/employeeService";
import StatCard from "../components/StatCard";
import { CardSkeleton } from "../components/ui/Skeleton";
import { formatDate } from "../utils/formatDate";
import Badge from "../components/ui/Badge";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    employeeService
      .getAll()
      .then((data) => {
        if (mounted) setEmployees(data);
      })
      .catch(() => {
        if (mounted) setError("Could not load dashboard data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // calculate the summary numbers
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const onLeave = employees.filter((e) => e.status === "On Leave").length;
  const departmentCount = new Set(employees.map((e) => e.department)).size;

  // recently joined - sort by date desc and take top 5
  const recentJoins = [...employees]
    .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate))
    .slice(0, 5);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your organization</p>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Employees"
              value={totalEmployees}
              icon="👥"
              color="primary"
            />
            <StatCard
              label="Active Employees"
              value={activeEmployees}
              icon="✅"
              color="green"
            />
            <StatCard
              label="On Leave"
              value={onLeave}
              icon="🌴"
              color="yellow"
            />
            <StatCard
              label="Departments"
              value={departmentCount}
              icon="🏢"
              color="purple"
            />
          </>
        )}
      </div>

      {/* recently joined */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-800 mb-4">
          Recently Joined
        </h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          <div className="space-y-3">
            {recentJoins.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {emp.name}
                    </p>
                    <p className="text-xs text-slate-400">{emp.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 hidden sm:block">
                    {formatDate(emp.joiningDate)}
                  </span>
                  <Badge status={emp.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
