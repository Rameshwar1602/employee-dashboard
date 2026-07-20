// Small status badge with color based on status value.

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  "On Leave": "bg-yellow-100 text-yellow-700",
  Inactive: "bg-slate-200 text-slate-600",
};


function Badge({ status }) {
  const style = statusStyles[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}

export default Badge;