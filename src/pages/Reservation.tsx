import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Show = {
  id: number;
  title: string;
  date: string;
  time: string;
  total_seats: number;
  price: number;
};

export default function Reservation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [reservedSeats, setReservedSeats] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // ✅ Protect route: redirect to login if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch show & reserved seats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const showRes = await fetch(`http://localhost:5000/api/plays/${id}`);
        const showData = await showRes.json();
        setShow(showData);

        const token = localStorage.getItem("token");
        if (!token) return; // don't fetch reserved seats if not logged in

        const seatsRes = await fetch(
          `http://localhost:5000/api/reservations/play/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const seatsData = await seatsRes.json();
        const allReservedSeats = seatsData.flatMap((r: any) => r.seats);
        setReservedSeats(allReservedSeats);
      } catch (err) {
        console.error("Failed to load reservation data", err);
      }
    };

    fetchData();
  }, [id]);

  if (!show) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading reservation...
      </div>
    );
  }

  const toggleSeat = (seat: number) => {
    if (reservedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const TICKET_PRICE = show.price;

  const handleConfirmReservation = () => {
    if (selectedSeats.length === 0) return;

    // 🔹 Here you'd call your API to save the reservation

    setIsModalOpen(false);
    setSnackbarVisible(true);
    setSelectedSeats([]);

    // ✅ Redirect to profile after reservation
    setTimeout(() => {
      setSnackbarVisible(false);
      navigate("/profile");
    }, 1500); // short delay to show snackbar
  };

  return (
    <div className="max-w-6xl mx-auto p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{show.title}</h1>
        <p className="text-gray-400">
          {new Date(show.date).toLocaleDateString()} · {show.time}
        </p>
      </div>

      {/* Screen */}
      <div className="text-center mb-4 text-gray-400">СЦЕНА</div>
      <div className="h-2 bg-gray-600 rounded mb-10" />

      {/* Seats */}
      <div className="grid grid-cols-10 gap-x-20 gap-y-3 justify-center mb-10 w-full max-w-[600px] mx-auto">
        {Array.from({ length: show.total_seats }, (_, i) => {
          const seatNumber = i + 1;
          const isReserved = reservedSeats.includes(seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);

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
          );
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
        <h2 className="text-xl font-semibold">
          Твој избор:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Празно"}
        </h2>
        <p>
          <b>Цена по билет:</b> {TICKET_PRICE} MKD
        </p>
        <p>
          <b>Вкупно:</b> {TICKET_PRICE * selectedSeats.length} MKD
        </p>
      </div>

      {/* Confirm button */}
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
              <b>Избрани места:</b> {selectedSeats.join(", ")}
            </p>
            <p className="mb-2">
              <b>Цена по билет:</b> {TICKET_PRICE} MKD
            </p>
            <p className="mb-4">
              <b>Вкупно:</b> {TICKET_PRICE * selectedSeats.length} MKD
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded"
              >
                Откажи
              </button>

              <button
                onClick={handleConfirmReservation}
                className="px-4 py-2 bg-green-600 rounded text-white"
              >
                Потврди
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbarVisible && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg z-50">
          Резервацијата е успешна!
        </div>
      )}
    </div>
  );
}
