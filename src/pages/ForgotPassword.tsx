import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Внеси е-пошта")
      return
    }

    setError("")
    setLoading(true)

    // 🔒 Backend later: send reset code to email
    setTimeout(() => {
  setLoading(false)
  navigate("/reset-password")
}, 1200)

  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950 pt-6">
      <div className="bg-neutral-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Заборавена лозинка
        </h1>

        <p className="text-sm text-gray-400 mb-6 text-center">
          Внеси ја твојата е-пошта и ќе ти испратиме код
        </p>

        {error && (
          <p className="mb-4 text-red-500 text-center">
            {error}
          </p>
        )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-300">
                Е-пошта
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
                placeholder="email@example.com"
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
              {loading ? "Се испраќа..." : "Испрати код"}
            </button>
          </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Се сети на лозинката?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Најави се
          </span>
        </p>
      </div>
    </div>
  )
}
