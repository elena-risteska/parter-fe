import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-red-600 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-2">
          Страницата не постои
        </h2>

        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Страницата што ја бараш не е пронајдена.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 transition text-white rounded-xl font-semibold"
        >
          Назад на почетна
        </button>
      </div>
    </div>
  )
}
