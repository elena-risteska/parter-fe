import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, Calendar, User } from "lucide-react";

export default function ShowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState<any>(null);
  const [reservedCount, setReservedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch show details
        const showRes = await fetch(`http://localhost:5000/api/plays/${id}`);
        if (!showRes.ok) throw new Error("Show not found");
        const showData = await showRes.json();

        // 2️⃣ Fetch reserved seats (if logged in)
        const token = localStorage.getItem("token");
        let reservedSeats: number[] = [];
        if (token) {
          const res = await fetch(
            `http://localhost:5000/api/reservations/play/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (res.ok) {
            const data = await res.json();
            reservedSeats = data.flatMap((r: any) => r.seats);
          }
        }

        setShow(showData);
        setReservedCount(reservedSeats.length);
      } catch (err) {
        console.error(err);
        setShow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!show) {
    return <div className="p-10 text-center text-red-500">Show not found</div>;
  }

  const freeSeats = show.total_seats - reservedCount;
  const hasFreeSeats = freeSeats > 0;

  return (
    <div className="max-w-5xl mx-auto p-10">
      {/* Hero */}
      <div className="relative h-96 rounded-2xl overflow-hidden mb-10">
        <img
          src={show.image || "/teatar.jpg"}
          alt={show.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-end p-8">
          <h1 className="text-4xl font-bold text-white">{show.title}</h1>
        </div>
      </div>

      {/* Info */}
      <div className="mb-8 space-y-4 text-gray-300">
        <p>{show.description}</p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <span>{show.duration} min</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <span>{new Date(show.date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <span>{show.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <User size={18} className="text-gray-400" />
            <span>Режија: {show.director}</span>
          </div>
        </div>

        {/* Static cast for now */}
        <div className="mt-6">
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

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button
          disabled={!hasFreeSeats}
          onClick={() => {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");
            navigate(`/reserve/${show.id}`);
          }}
          className={`px-6 py-3 rounded-xl font-semibold transition
            ${
              hasFreeSeats
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
        >
          Направи резервација
        </button>

        {hasFreeSeats ? (
          <p className="text-green-500 font-semibold">
            Уште {freeSeats} слободни места
          </p>
        ) : (
          <p className="text-red-500 font-semibold">Распродадена</p>
        )}
      </div>
    </div>
  );
}
