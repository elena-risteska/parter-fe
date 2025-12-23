import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ResetPassword() {
  const navigate = useNavigate()

  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!code || !password || !confirmPassword) {
      setError("Сите полиња се задолжителни")
      return
    }

    if (password !== confirmPassword) {
      setError("Лозинките не се совпаѓаат")
      return
    }

    setError("")
    setLoading(true)

    // 🔒 Backend reset later
    setTimeout(() => {
      setLoading(false)
      navigate("/login")
    }, 1200)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950 pt-2">
      <div className="bg-neutral-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Ресетирање лозинка
        </h1>

        <p className="text-sm text-gray-400 mb-6 text-center">
          Внеси го кодот и новата лозинка
        </p>

        {error && (
          <p className="mb-4 text-red-500 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Код
            </label>
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="123456"
            />
          </div>

          {/* New password */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Нова лозинка
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Confirm password */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Потврди лозинка
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? "Се зачувува..." : "Промени лозинка"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Не доби код?{" "}
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Испрати повторно
          </span>
        </p>
      </div>
    </div>
  )
}
