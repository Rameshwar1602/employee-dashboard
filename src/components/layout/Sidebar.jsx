import { NavLink } from "react-router-dom";

// Sidebar nav. On mobile it slides in/out based on the `open` prop.
function Sidebar({ open, onClose }) {
  const links = [
    { to: "/", label: "Dashboard", icon: "▦" },
    { to: "/employees", label: "Employees", icon: "☰" },
  ];

  return (
    <>
      {/* backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 transform transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
          <div className="h-8 w-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">        
          </div>
          <span className="font-semibold text-slate-800">EmployeeAdmin</span>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
