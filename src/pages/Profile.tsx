import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()

  // 🔒 Mock user (backend later)
  const user = {
    firstName: "Елена",
    lastName: "Ристеска",
    email: "elena@example.com",
    phone: "+389 70 123 456",
  }

  // 🎟️ Mock reservations (backend later)
  const [reservations, setReservations] = useState([
    {
      id: 1,
      title: "Партер",
      date: "20.12.2025",
      time: "20:00",
      seats: [12, 13, 14],
      price: 250,
    },
    {
      id: 2,
      title: "Комедија на забуна",
      date: "05.01.2026",
      time: "19:30",
      seats: [7, 8],
      price: 250,
    },
  ])

  // ✏️ Profile editing
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(user)

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSaveProfile = () => {
    // 🔒 Backend later
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setProfileData(user)
    setIsEditing(false)
  }

  // 🔐 Change password
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleChangePassword = () => {
    setPasswordError("")
    setPasswordMessage("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Пополни ги сите полиња")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Новите лозинки не се совпаѓаат")
      return
    }

    // 🔒 Backend later
    setPasswordMessage("Лозинката е успешно променета")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* PROFILE INFO */}
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Лични податоци</h2>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    Измени
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveProfile}
                      className="text-green-500 hover:underline font-semibold"
                    >
                      Зачувај
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-500 hover:underline font-semibold"
                    >
                      Откажи
                    </button>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Име</label>
                  <input
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`input ${!isEditing && "opacity-60 cursor-not-allowed"}`}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">Презиме</label>
                  <input
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`input ${!isEditing && "opacity-60 cursor-not-allowed"}`}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">Е-пошта</label>
                  <input
                    value={profileData.email}
                    disabled
                    className="input opacity-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">Телефон</label>
                  <input
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`input ${!isEditing && "opacity-60 cursor-not-allowed"}`}
                  />
                </div>
              </div>
            </div>

            {/* CHANGE PASSWORD */}
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Промена на лозинка</h2>

              {passwordError && (
                <p className="mb-4 text-red-500">{passwordError}</p>
              )}

              {passwordMessage && (
                <p className="mb-4 text-green-500">{passwordMessage}</p>
              )}

              <div className="space-y-4 max-w-md">
                <input
                  type="password"
                  placeholder="Стара лозинка"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="input"
                />

                <input
                  type="password"
                  placeholder="Нова лозинка"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="input"
                />

                <input
                  type="password"
                  placeholder="Потврди лозинка"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input"
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="mt-6 bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg font-semibold"
              >
                Зачувај лозинка
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN – RESERVATIONS */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Мои резервации</h2>

              {reservations.length === 0 ? (
                <p className="text-gray-400 text-center">
                  Немаш направено резервации
                </p>
              ) : (
                <div className="space-y-4">
                  {reservations.map(r => (
                    <div
                      key={r.id}
                      className="bg-neutral-900 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-green-400">
                          {r.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {r.date} · {r.time}
                        </p>
                        <p className="text-sm">
                          Места: {r.seats.join(", ")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          {r.seats.length * r.price} MKD
                        </p>
                        <p className="text-xs text-gray-400">
                          {r.seats.length} × {r.price} MKD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={() => navigate("/login")}
          className="mt-10 w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-xl font-semibold"
        >
          Одјава
        </button>

      </div>
    </div>
  )
}
