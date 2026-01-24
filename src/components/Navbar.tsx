import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { loggedIn } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition font-medium ${isActive ? "text-red-500" : "text-gray-300 hover:text-red-400"}`;

  return (
    <nav className="sticky top-0 z-50 bg-neutral-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-red-500 font-bold text-xl">Партер</h1>

        <div className="flex gap-6">
          <NavLink to="/" className={linkClass}>
            Репертоар
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            За театарот
          </NavLink>

          {loggedIn ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                Профил
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Најава
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
