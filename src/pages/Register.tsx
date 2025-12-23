import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !lastName || !email || !phone || !password) {
      setError("Сите полиња се задолжителни")
      return
    }

    setError("")

    // 🔒 Backend register later
    console.log({
      firstName,
      lastName,
      email,
      phone,
      password,
    })

    // Temporary success flow
    navigate("/login")
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950 pt-2">
      <div className="bg-neutral-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Регистрација
        </h1>

        {error && (
          <p className="mb-4 text-red-500 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First name */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Име
            </label>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Last name */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Презиме
            </label>
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Е-пошта
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Телефон
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+389 7X XXX XXX"
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Лозинка
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg font-semibold"
          >
            Регистрирај се
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Веќе имаш профил?{" "}
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
