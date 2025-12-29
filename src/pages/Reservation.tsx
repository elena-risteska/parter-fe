import { useParams } from "react-router-dom"
import { shows } from "../data/shows"
import { useState } from "react"

const TOTAL_SEATS = 80

export default function Reservation() {
  const { id } = useParams()
  const show = shows.find(s => s.id === id)

  const [selectedSeats, setSelectedSeats] = useState<number[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
const TICKET_PRICE = 250 // example price per seat
const [snackbarVisible, setSnackbarVisible] = useState(false)



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
      
<div className="flex items-center justify-between mb-8">
  <h1 className="text-3xl font-bold">
    {show.title}
  </h1>

  <p className="text-gray-400">
    {show.date} · {show.time}
  </p>
</div>

      {/* Screen */}
      <div className="text-center mb-4 text-gray-400">СЦЕНА</div>
      <div className="h-2 bg-gray-600 rounded mb-10" />

      {/* Seats */}
      <div className="grid grid-cols-10 gap-x-20 gap-y-3 justify-center mb-10 w-full max-w-[600px] mx-auto">
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
          w-12 h-12 rounded text-sm font-semibold transition
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
        <h2 className="text-xl font-semibold mb-2">
                  Твој избор:{" "}
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "Празно"}
        </h2>
      </div>

      {/* Confirm button (opens modal only) */}
<button
  disabled={selectedSeats.length === 0}
  onClick={() => setIsModalOpen(true)}
  className={`px-8 py-3 rounded-xl font-semibold transition
    ${
      selectedSeats.length > 0
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-gray-600 text-gray-300 cursor-not-allowed"
    }`}
>
  Потврди резервација
</button>

{/* Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Потврда на резервација</h2>

      <p className="mb-2">
        <span className="font-semibold">Избрани места:</span> {selectedSeats.join(", ")}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Цена по билет:</span> {TICKET_PRICE} MKD
      </p>
      <p className="mb-4">
        <span className="font-semibold">Вкупно:</span> {TICKET_PRICE * selectedSeats.length} MKD
      </p>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
        >
          Откажи
        </button>

        <button
          onClick={() => {
            // Close modal
            setIsModalOpen(false)

            // Show snackbar
            setSnackbarVisible(true)
            
            // Optional: reset seats after confirmation
            setSelectedSeats([])

            // Auto-hide snackbar
            setTimeout(() => setSnackbarVisible(false), 3000)
          }}
          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          Потврди
        </button>
      </div>
    </div>
  </div>
)}

{/* Snackbar */}
{snackbarVisible && (
  <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in">
Резервацијата е успешна!
  </div>
)}



    </div>
  )
}
