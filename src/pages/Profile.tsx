import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

type Reservation = {
  id: number;
  title: string;
  date: string;
  time: string;
  seats: number[];
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "expired";
};

export default function Profile() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // 🔹 Load profile + my reservations
  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchProfile = async () => {
      const res = await fetch(`${API_URL}/profile`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProfileData({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
      });
    };

    const fetchReservations = async () => {
      const res = await fetch(`${API_URL}/reservations`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // show only active reservations
      setReservations(
        data.filter(
          (r: Reservation) =>
            r.status === "pending" || r.status === "confirmed",
        ),
      );
    };

    Promise.all([fetchProfile(), fetchReservations()]).catch((err) =>
      setSnackbar({ message: err.message, type: "error" }),
    );
  }, [token]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

  // 🔹 Update profile
  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProfileData({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
      });

      setSnackbar({
        message: "Податоците се успешно зачувани!",
        type: "success",
      });
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  // 🔹 Change password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbar({ message: "Пополни ги сите полиња", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbar({ message: "Лозинките не се совпаѓаат", type: "error" });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSnackbar({
        message: "Лозинката е успешно променета",
        type: "success",
      });
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  // 🔹 Cancel reservation
  const handleDeleteReservation = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Неуспешно бришење");

      setReservations((prev) => prev.filter((r) => r.id !== id));
      setSnackbar({ message: "Резервацијата е откажана", type: "success" });
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  // 🔹 Delete profile
  const handleDeleteProfile = async () => {
    if (!window.confirm("Дали сте сигурни?")) return;

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      logout();
      navigate("/login");
    } catch (err: any) {
      setSnackbar({ message: err.message, type: "error" });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Profile Form */}
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Лични податоци</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProfile();
                }}
                className="space-y-4"
              >
                <input
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className="input"
                  placeholder="Име"
                />
                <input
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className="input"
                  placeholder="Презиме"
                />
                <input
                  name="email"
                  value={profileData.email}
                  disabled
                  className="input opacity-60 cursor-not-allowed"
                />
                <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold">
                  Промени податоци
                </button>
              </form>
            </div>

            {/* Password */}
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Промена на лозинка
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePassword();
                }}
                className="space-y-4"
              >
                <input
                  type="password"
                  placeholder="Стара лозинка"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input"
                />
                <input
                  type="password"
                  placeholder="Нова лозинка"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                />
                <input
                  type="password"
                  placeholder="Потврди лозинка"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold">
                  Промени лозинка
                </button>
              </form>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold"
            >
              Одјава
            </button>
            <button
              onClick={handleDeleteProfile}
              className=" w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold"
            >
              Избриши профил
            </button>
          </div>

          {/* RIGHT COLUMN – Reservations */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Мои резервации</h2>

              {reservations.length === 0 ? (
                <p className="text-gray-400 text-center">
                  Немаш направено резервации
                </p>
              ) : (
                <div className="space-y-4">
                  {reservations.map((r) => (
                    <div
                      key={r.id}
                      className="bg-neutral-900 rounded-xl p-5 flex justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-green-400">
                          {r.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(r.date).toLocaleDateString()} · {r.time}
                        </p>
                        <p className="text-sm">Места: {r.seats.join(", ")}</p>
                        <p className="font-semibold mt-1">
                          Вкупно: {r.total_price} MKD
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteReservation(r.id)}
                        className="px-4 py-2 bg-red-600 rounded-xl font-semibold"
                      >
                        Избриши
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {snackbar && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white ${
            snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
