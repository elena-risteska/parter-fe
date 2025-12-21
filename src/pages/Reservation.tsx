import { useParams } from "react-router-dom"
import { shows } from "../data/shows"
import { useState } from "react"

const TOTAL_SEATS = 100

export default function Reservation() {
  const { id } = useParams()
  const show = shows.find(s => s.id === id)

  const [selectedSeats, setSelectedSeats] = useState<number[]>([])

  if (!show) {
    return <div className="p-10 text-center text-red-500">Изведбата не е пронајдена</div>
  }

  // Simulate already reserved seats
  const reservedSeats = Array.from(
    { length: show.reservedSeats },
    (_, i) => i + 1
  )

  const toggleSeat = (seat: number) => {
    if (reservedSeats.includes(seat)) return

    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-10">
      
      <h1 className="text-3xl font-bold mb-4">{show.title}</h1>
      <p className="text-gray-400 mb-8">
        {show.date} · {show.time}
      </p>

      {/* Screen */}
      <div className="text-center mb-4 text-gray-400">СЦЕНА</div>
      <div className="h-2 bg-gray-600 rounded mb-10" />

      {/* Seats */}
      <div className="grid grid-cols-10 gap-3 justify-center mb-10">
        {Array.from({ length: TOTAL_SEATS }, (_, i) => {
          const seatNumber = i + 1
          const isReserved = reservedSeats.includes(seatNumber)
          const isSelected = selectedSeats.includes(seatNumber)

          return (
            <button
              key={seatNumber}
              onClick={() => toggleSeat(seatNumber)}
              disabled={isReserved}
              className={`
                w-10 h-10 rounded text-sm font-semibold transition
                ${
                  isReserved
                    ? "bg-red-600 cursor-not-allowed text-white"
                    : isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }
              `}
            >
              {seatNumber}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-10 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-600 rounded" /> Слободно
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-600 rounded" /> Резервирано
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-600 rounded" /> Избрано
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 rounded-xl bg-gray-800 text-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-2">Твој избор</h2>
        <p>
          Седишта:{" "}
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "Празно"}
        </p>
      </div>

      {/* Confirm */}
      <button
        disabled={selectedSeats.length === 0}
        className={`
          px-8 py-3 rounded-xl font-semibold transition
          ${
            selectedSeats.length > 0
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }
        `}
      >
        Потврди резервација
      </button>

    </div>
  )
}
