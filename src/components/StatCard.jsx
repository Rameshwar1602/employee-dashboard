// Summary card for the dashboard showing a stat with a label and icon.

function StatCard({ label, value, icon, color = "primary" }) {
  const colorMap = {
    primary: "bg-primary-50 text-primary-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div
        className={`h-11 w-11 rounded-lg flex items-center justify-center text-lg ${colorMap[color]}`}
      >
        {icon}
      </div>
    </div>
  );
}

export default StatCard;
