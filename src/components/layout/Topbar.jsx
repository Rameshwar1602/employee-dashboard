import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

// Top navigation bar. Shows page context, hamburger for mobile, and user menu.
function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // grab initials for the avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
      <button
        className="md:hidden text-slate-600 text-xl"
        onClick={onMenuClick}
      >
        ☰
      </button>

      <div className="hidden md:block text-sm text-slate-500">
        Employee Management System
      </div>

      <div className="relative">
        <button
          className="flex items-center gap-2"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className="h-9 w-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-700">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
