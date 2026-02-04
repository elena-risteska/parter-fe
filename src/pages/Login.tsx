import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Внеси е-пошта и лозинка");
      return;
    }

    try {
      const data = await loginRequest(email, password);
      // EXPECTED BACKEND RESPONSE:
      // { token, user: { id, firstName, lastName, email, role } }

      login(data.token, data.user);

      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Грешка при најава");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950">
      <div className="bg-neutral-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Најава</h1>

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Е-пошта</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Лозинка</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="••••••••"
            />
          </div>
          <p
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-red-500 hover:underline cursor-pointer text-right"
          >
            Заборавена лозинка?
          </p>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg font-semibold"
          >
            Најави се
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Немаш профил?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Регистрирај се
          </span>
        </p>
      </div>
    </div>
  );
}
