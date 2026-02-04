import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

type Play = {
  id: number;
  title: string;
  description?: string;
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
  seats: number[];
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
  const [editingPlay, setEditingPlay] = useState<Play | null>(null);
  const [newPlay, setNewPlay] = useState<Partial<Play> | null>(null);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchPlays = async () => {
    try {
      const res = await fetch(`${API_URL}/plays`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
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
      if (!res.ok) throw new Error(data.error);
      setReservations(data);
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchPlays();
    fetchReservations();
  }, [token]);

  const handleSavePlay = async () => {
    try {
      const isEdit = !!editingPlay;
      const payload = isEdit ? editingPlay : newPlay;

      const res = await fetch(
        isEdit ? `${API_URL}/plays/${editingPlay!.id}` : `${API_URL}/plays`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...payload,
            price: Number(payload?.price),
            duration: payload?.duration ? Number(payload.duration) : null,
            total_seats: Number(payload?.total_seats),
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSnackbar({
        message: isEdit ? "Претставата е изменета" : "Претставата е додадена",
        type: "success",
      });

      setEditingPlay(null);
      setNewPlay(null);
      fetchPlays();
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  const handleDeletePlay = async (id: number) => {
    if (!window.confirm("Дали сте сигурни?")) return;
    try {
      const res = await fetch(`${API_URL}/plays/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setPlays((p) => p.filter((x) => x.id !== id));
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  const handleDeleteReservation = async (id: number) => {
    if (
      !window.confirm(
        "Дали сте сигурни дека сакате да ја избришете резервацијата?",
      )
    )
      return;
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete reservation");
      setReservations((r) => r.filter((x) => x.id !== id));
      setSnackbar({ message: "Резервацијата е избришана", type: "success" });
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  const playForm = editingPlay ?? newPlay;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 pt-16 px-6 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["Претстави", "Резервации"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-xl font-semibold ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* PLAYS */}
      {tab === "Претстави" && (
        <div className="bg-neutral-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Претстави</h2>
            <button
              onClick={() => setNewPlay({})}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
            >
              Додади претстава
            </button>
          </div>

          {plays.map((p) => (
            <div
              key={p.id}
              className="bg-neutral-900 p-4 rounded-xl flex justify-between"
            >
              <div>
                <h3 className="text-green-400 font-semibold">{p.title}</h3>
                <p>
                  {p.date} · {p.time}
                </p>
                <p>Цена: {p.price} MKD</p>
                <p>Режисер: {p.director}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPlay(p)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-xl"
                >
                  Измени
                </button>
                <button
                  onClick={() => handleDeletePlay(p.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-xl"
                >
                  Избриши
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESERVATIONS */}
      {tab === "Резервации" && (
        <div className="bg-neutral-800 p-6 rounded-2xl space-y-4">
          {reservations.map((r) => (
            <div
              key={r.id}
              className="bg-neutral-900 p-4 rounded-xl flex justify-between"
            >
              <div>
                <h3 className="text-green-400 font-semibold">{r.title}</h3>
                <p>
                  {r.date} · {r.time}
                </p>
                <p>
                  Корисник: {r.first_name} {r.last_name}
                </p>
                <p>Места: {r.seats.join(", ")}</p>
                <p>Вкупно: {r.total_price} MKD</p>
                {/* <p>Статус: {r.status}</p> */}
              </div>
              <button
                onClick={() => handleDeleteReservation(r.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-xl"
              >
                Избриши
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {playForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-neutral-800 p-6 rounded-2xl space-y-3 w-full max-w-lg">
            {[
              "title",
              "description",
              "date",
              "time",
              "duration",
              "director",
              "price",
              "total_seats",
            ].map((f) => (
              <input
                key={f}
                className="input w-full"
                placeholder={f}
                value={(playForm as any)[f] || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  editingPlay
                    ? setEditingPlay({ ...editingPlay, [f]: v })
                    : setNewPlay({ ...(newPlay || {}), [f]: v });
                }}
              />
            ))}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingPlay(null);
                  setNewPlay(null);
                }}
                className="bg-gray-600 px-4 py-2 rounded-xl"
              >
                Откажи
              </button>
              <button
                onClick={handleSavePlay}
                className="bg-blue-600 px-4 py-2 rounded-xl"
              >
                Зачувај
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl ${
            snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
