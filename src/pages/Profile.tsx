import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()

  // 🔒 Mock user
  const user = {
    firstName: "Елена",
    lastName: "Ристеска",
    email: "elena@example.com",
    phone: "+389 70 123 456",
  }

  // 🎟️ Reservations
  const [reservations, setReservations] = useState([
    { id: 1, title: "Партер", date: "20.12.2025", time: "20:00", seats: [12, 13, 14], price: 250 },
    { id: 2, title: "Комедија на забуна", date: "05.01.2026", time: "19:30", seats: [7, 8], price: 250 },
  ])

  // ✏️ Profile
  const [profileData, setProfileData] = useState(user)
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  const handleSaveProfile = () => console.log("Saved profile:", profileData)

  // 🔐 Password
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const handleChangePassword = () => {
    setPasswordError(""); setPasswordMessage("")
    if (!currentPassword || !newPassword || !confirmPassword) { setPasswordError("Пополни ги сите полиња"); return }
    if (newPassword !== confirmPassword) { setPasswordError("Лозинките не се совпаѓаат"); return }
    setPasswordMessage("Лозинката е успешно променета")
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
  }

  // ✏️ Edit / Delete reservation
  const [activeReservation, setActiveReservation] = useState<any | null>(null) // edit modal
  const [editedSeats, setEditedSeats] = useState<number[]>([])
  const [reservationToDelete, setReservationToDelete] = useState<any | null>(null) // delete modal
  const [confirmEditModal, setConfirmEditModal] = useState(false) // confirmation modal

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* PROFILE */}
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Лични податоци</h2>
              <div className="space-y-4">
                <input name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="input" placeholder="Име" />
                <input name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="input" placeholder="Презиме" />
                <input name="email" value={profileData.email} onChange={handleProfileChange} className="input" placeholder="E-пошта" />
                <input name="phone" value={profileData.phone} onChange={handleProfileChange} className="input" placeholder="Телефон" />
              </div>
              <button onClick={handleSaveProfile} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
                Зачувај промени
              </button>
            </div>

            {/* PASSWORD */}
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Промена на лозинка</h2>
              {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
              {passwordMessage && <p className="text-green-500 mb-4">{passwordMessage}</p>}

              <form
                onSubmit={e => { e.preventDefault(); handleChangePassword() }}
                className="space-y-4"
              >
                <input type="password" placeholder="Стара лозинка" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="input" />
                <input type="password" placeholder="Нова лозинка" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" />
                <input type="password" placeholder="Потврди лозинка" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input" />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
                  Зачувај лозинка
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN – RESERVATIONS */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Мои резервации</h2>
              {reservations.length === 0 ? (
                <p className="text-gray-400 text-center">Немаш направено резервации</p>
              ) : (
                <div className="space-y-4">
                  {reservations.map(r => (
                    <div key={r.id} className="bg-neutral-900 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-green-400">{r.title}</h3>
                        <p className="text-sm text-gray-400">{r.date} · {r.time}</p>
                        <p className="text-sm">Места: {r.seats.join(", ")}</p>
                        <p className="font-semibold mt-1">Вкупно: {r.seats.length * r.price} MKD</p>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button onClick={() => { setActiveReservation(r); setEditedSeats(r.seats) }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">
                          Измени
                        </button>
                        <button onClick={() => setReservationToDelete(r)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition">
                          Избриши
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <button onClick={() => navigate("/login")} className="mt-10 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition">
          Одјава
        </button>
      </div>

      {/* EDIT MODAL */}
      {activeReservation && !confirmEditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-2xl p-8 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Измени резервација</h2>
            <div className="grid grid-cols-6 gap-3 mb-6">
              {Array.from({ length: 30 }, (_, i) => {
                const seat = i + 1
                const selected = editedSeats.includes(seat)
                return (
                  <button key={seat} onClick={() =>
                    setEditedSeats(prev =>
                      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
                    )
                  } className={`w-10 h-10 rounded-lg text-sm font-semibold ${selected ? "bg-blue-600" : "bg-green-600"} text-white`}>
                    {seat}
                  </button>
                )
              })}
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveReservation(null)} className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                Откажи
              </button>
              <button onClick={() => setConfirmEditModal(true)} className="px-4 py-2 bg-blue-600 rounded-lg text-white">
                Зачувај
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM EDIT MODAL */}
      {activeReservation && confirmEditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">Дали сте сигурни дека сакате да ја промените резервацијата?</h2>
            <div className="flex justify-end gap-4">
              <button onClick={() => setConfirmEditModal(false)} className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                Откажи
              </button>
              <button onClick={() => {
                setReservations(prev => prev.map(r =>
                  r.id === activeReservation.id ? { ...r, seats: editedSeats } : r
                ))
                setActiveReservation(null)
                setConfirmEditModal(false)
              }} className="px-4 py-2 bg-blue-600 rounded-lg text-white">
                Потврди
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {reservationToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">Дали сте сигурни дека сакате да ја избришете резервацијата?</h2>
            <div className="flex justify-end gap-4">
              <button onClick={() => setReservationToDelete(null)} className="px-4 py-2 bg-gray-700 rounded-lg text-white">
                Откажи
              </button>
              <button onClick={() => {
                setReservations(prev => prev.filter(r => r.id !== reservationToDelete.id))
                setReservationToDelete(null)
              }} className="px-4 py-2 bg-red-600 rounded-lg text-white">
                Избриши
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
