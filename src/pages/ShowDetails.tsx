import { useParams, useNavigate } from "react-router-dom"
import { shows } from "../data/shows"
import { Clock, Calendar, User } from "lucide-react"


export default function ShowDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const show = shows.find(s => s.id === id)

  if (!show) {
    return <div className="p-10 text-center text-red-500">Show not found</div>
  }

  const freeSeats = show.totalSeats - show.reservedSeats
  const hasFreeSeats = freeSeats > 0

  return (
    <div className="max-w-5xl mx-auto p-10">
      
      {/* Hero */}
      <div className="relative h-96 rounded-2xl overflow-hidden mb-10">
        <img
          src={show.image}
          alt={show.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-end p-8">
          <h1 className="text-4xl font-bold text-white">
            {show.title}
          </h1>
        </div>
      </div>

      {/* Info */}
      <div className="mb-8 space-y-2 text-gray-300">
        <p>{show.description}</p>
        <div className="space-y-2 text-gray-300">
  <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-gray-300">
  <div className="flex items-center gap-2">
    <Clock size={18} className="text-gray-400" />
    <span>{show.duration} min</span>
  </div>

  <div className="flex items-center gap-2">
    <Calendar size={18} className="text-gray-400" />
    <span>{show.date}</span>
  </div>

  <div className="flex items-center gap-2">
    <Clock size={18} className="text-gray-400" />
    <span>{show.time}</span>
  </div>

  <div className="flex items-center gap-2">
    <User size={18} className="text-gray-400" />
    <span>Режија: Дејан Пројковски</span>
  </div>
</div>
</div>

        <div className="mt-4">
  <h3 className="font-semibold mb-2">Играат:</h3>
  <ul className="space-y-1 text-gray-300">
    <li>НЕДА – Сара Спиркоска</li>
    <li>ИВАН – Бобан Алексоски</li>
    <li>МИЛКА – Катерија Чакмакоска-Клинческа</li>
    <li>ЛУКОВ – Александар Степанулески</li>
    <li>ХРИСТОВ – Александар Тодески</li>
    <li>ФЕЗЛИЕВ – Димитар Ѓорѓиевски</li>
    <li>МЕТОДИ – Михајло Миленкоски</li>
    <li>МЛАДИЧОТ – Илија Волчески</li>
  </ul>
</div>

      </div>

      {/* Availability */}
      <div className="mb-10">
        {hasFreeSeats ? (
          <p className="text-green-500 font-semibold">
            Уште {freeSeats} слободни места
          </p>
        ) : (
          <p className="text-red-500 font-semibold">
            Распродадена
          </p>
        )}
      </div>

      {/* Action */}
      <button
        disabled={!hasFreeSeats}
onClick={() => navigate(`/reserve/${show.id}`)}
        className={`px-6 py-3 rounded-xl font-semibold transition
          ${
            hasFreeSeats
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
      >
        Направи резервација
      </button>

    </div>
  )
}
