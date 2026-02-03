import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

type Play = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration?: number;
  director: string;
  price: number;
  total_seats: number;
};

type Reservation = {
  id: number;
  title: string;
  date: string;
  time: string;
  seats: string[];
  total_price: number;
  status: string;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export default function Admin() {
  const { token } = useAuth();

  const [tab, setTab] = useState<"Претстави" | "Резервации">("Претстави");
  const [plays, setPlays] = useState<Play[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [editingPlay, setEditingPlay] = useState<Play | null>(null);
  const [newPlay, setNewPlay] = useState<Partial<Play>>({});

  // Fetch data
  const fetchPlays = async () => {
    try {
      const res = await fetch(`${API_URL}/plays`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch plays");
      setPlays(data);
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to fetch reservations");
      setReservations(data);
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchPlays();
    fetchReservations();
  }, [token]);

  // Play handlers
  const handleDeletePlay = async (id: number) => {
    if (
      !window.confirm(
        "Дали сте сигурни дека сакате да ја избришете претставата?",
      )
    )
      return;
    try {
      const res = await fetch(`${API_URL}/plays/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete play");
      setPlays((prev) => prev.filter((p) => p.id !== id));
      setSnackbar({ message: "Претставата е избришана", type: "success" });
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  const handleSavePlay = async () => {
    try {
      const isEditing = !!editingPlay;
      const url = isEditing
        ? `${API_URL}/plays/${editingPlay!.id}`
        : `${API_URL}/plays`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(isEditing ? editingPlay : newPlay),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save play");

      setSnackbar({
        message: isEditing
          ? "Претставата е изменета"
          : "Претставата е додадена",
        type: "success",
      });
      setEditingPlay(null);
      setNewPlay({});
      fetchPlays();
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  // Reservation handlers
  const handleCancelReservation = async (id: number) => {
    if (
      !window.confirm(
        "Дали сте сигурни дека сакате да ја откажете резервацијата?",
      )
    )
      return;
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel reservation");
      setReservations((prev) => prev.filter((r) => r.id !== id));
      setSnackbar({ message: "Резервацијата е откажана", type: "success" });
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 pt-16 px-6 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["Претстави", "Резервации"].map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
            }`}
            onClick={() => setTab(t as any)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Plays Tab */}
      {tab === "Претстави" && (
        <div className="bg-neutral-800 rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Претстави</h2>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
              onClick={() => setNewPlay({})}
            >
              Додади претстава
            </button>
          </div>

          {plays.length === 0 ? (
            <p className="text-gray-400 text-center">Нема претстави</p>
          ) : (
            <div className="space-y-2">
              {plays.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between bg-neutral-900 p-4 rounded-xl items-center"
                >
                  <div>
                    <h3 className="font-semibold text-green-400">{p.title}</h3>
                    <p className="text-gray-400">
                      {p.date} · {p.time}
                    </p>
                    <p className="text-sm">Цена: {p.price} MKD</p>
                    <p className="text-sm">Режисер: {p.director}</p>
                    <p className="text-sm">Вкупно седишта: {p.total_seats}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition"
                      onClick={() => setEditingPlay(p)}
                    >
                      Измени
                    </button>
                    <button
                      onClick={() => handleDeletePlay(p.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
                    >
                      Избриши
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit Play Modal */}
          {(editingPlay || Object.keys(newPlay).length > 0) && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
              <div className="bg-neutral-800 p-6 rounded-2xl w-full max-w-lg space-y-4 relative">
                <h3 className="text-xl font-semibold">
                  {editingPlay ? "Измени претстава" : "Додади претстава"}
                </h3>
                {[
                  "title",
                  "description",
                  "date",
                  "time",
                  "duration",
                  "director",
                  "price",
                  "total_seats",
                ].map((field) => (
                  <input
                    key={field}
                    type={
                      field === "price" ||
                      field === "duration" ||
                      field === "total_seats"
                        ? "number"
                        : "text"
                    }
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={
                      editingPlay
                        ? (editingPlay as any)[field] || ""
                        : (newPlay as any)[field] || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingPlay)
                        setEditingPlay({ ...editingPlay, [field]: val });
                      else setNewPlay({ ...newPlay, [field]: val });
                    }}
                    className="input w-full"
                  />
                ))}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition"
                    onClick={() => {
                      setEditingPlay(null);
                      setNewPlay({});
                    }}
                  >
                    Откажи
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                    onClick={handleSavePlay}
                  >
                    Зачувај
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reservations Tab */}
      {tab === "Резервации" && (
        <div className="bg-neutral-800 rounded-2xl shadow-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Резервации</h2>
          {reservations.length === 0 ? (
            <p className="text-gray-400 text-center">Нема резервации</p>
          ) : (
            <div className="space-y-2">
              {reservations.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between bg-neutral-900 p-4 rounded-xl items-center"
                >
                  <div>
                    <h3 className="font-semibold text-green-400">{r.title}</h3>
                    <p className="text-gray-400">
                      {r.date} · {r.time}
                    </p>
                    <p className="text-sm">
                      Корисник: {r.first_name} {r.last_name}
                    </p>
                    <p className="text-sm">Места: {r.seats.join(", ")}</p>
                    <p className="font-semibold">Вкупно: {r.total_price} MKD</p>
                    <p className="text-sm">Статус: {r.status}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleCancelReservation(r.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
                    >
                      Откажи
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Snackbar */}
      {snackbar && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl text-white shadow-lg z-50 transition-all duration-300 ${
            snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
