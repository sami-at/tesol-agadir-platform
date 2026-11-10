import { NavLink, Outlet, Link } from "react-router-dom";
import { getAdminGroups } from "../adminSchema";
import { useAuth } from "../../context/AuthContext";
import AdminSearch from "./AdminSearch";

/** Shell for the whole /admin dashboard: sidebar navigation + top bar. */
export default function AdminLayout() {
  const { logout } = useAuth();
  const groups = getAdminGroups();

  return (
    <div className="flex min-h-screen bg-sand">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate/10 bg-white lg:flex">
        <div className="border-b border-slate/10 px-5 py-5">
          <Link to="/admin" className="font-heading text-lg font-semibold text-oceanic">
            TESOL Admin
          </Link>
          <p className="mt-0.5 text-xs text-slate/50">Content Management</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin sections">
          {groups.map((group) => (
            <div key={group.name} className="mb-5">
              <p className="mb-1.5 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate/40">
                {group.name}
              </p>
              <ul className="space-y-0.5">
                {group.name === "Apply" && (
                  <li>
                    <NavLink
                      to="/admin/applications"
                      className={({ isActive }) =>
                        `block rounded px-2.5 py-1.5 text-sm ${
                          isActive
                            ? "bg-oceanic/10 font-medium text-oceanic"
                            : "text-slate/70 hover:bg-sand/60 hover:text-oceanic"
                        }`
                      }
                    >
                      Applications
                    </NavLink>
                  </li>
                )}
                {group.sections.map((section) => (
                  <li key={section.key}>
                    <NavLink
                      to={`/admin/${section.key}`}
                      className={({ isActive }) =>
                        `block rounded px-2.5 py-1.5 text-sm ${
                          isActive
                            ? "bg-oceanic/10 font-medium text-oceanic"
                            : "text-slate/70 hover:bg-sand/60 hover:text-oceanic"
                        }`
                      }
                    >
                      {section.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate/10 bg-white px-5 py-3.5">
          <div>
            <p className="font-heading text-base font-semibold text-slate lg:hidden">TESOL Admin</p>
            <Link to="/" className="text-xs text-slate/50 hover:text-oceanic">
              ← Back to public site
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <AdminSearch />
            <button
              type="button"
              onClick={logout}
              className="rounded border border-slate/20 px-3 py-1.5 text-sm font-medium text-slate/70 hover:border-terracotta hover:text-terracotta"
            >
              Log Out
            </button>
          </div>
        </header>
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
