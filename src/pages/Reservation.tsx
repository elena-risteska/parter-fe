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
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showRes = await fetch(`http://localhost:5000/api/plays/${id}`);
        if (!showRes.ok) throw new Error("Play not found");
        const showData = await showRes.json();
        setShow(showData);

        const token = localStorage.getItem("token");
        if (!token) return;

        const seatsRes = await fetch(
          `http://localhost:5000/api/reservations/play/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
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

  const handleConfirmReservation = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (selectedSeats.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          play_id: show.id,
          seats: selectedSeats,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to make reservation");
      }

      setSnackbar({ message: "Резервацијата е успешна!", type: "success" });
      setReservedSeats((prev) => [...prev, ...selectedSeats]);
      setSelectedSeats([]);
      setIsModalOpen(false);

      setTimeout(() => {
        setSnackbar(null);
        navigate("/profile");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setSnackbar({ message: err.message, type: "error" });
      setTimeout(() => setSnackbar(null), 3000);
    } finally {
      setLoading(false);
    }
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
        disabled={selectedSeats.length === 0 || loading}
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
      {snackbar && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white shadow-lg z-50 transition-all duration-300 ${
            snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
