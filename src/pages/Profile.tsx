import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()

  const user = {
    firstName: "Елена",
    lastName: "Ристеска",
    email: "elena@example.com",
    phone: "+389 70 123 456",
  }

  const [reservations, setReservations] = useState([
    { id: 1, title: "Партер", date: "20.12.2025", time: "20:00", seats: [12, 13, 14], price: 250 },
    { id: 2, title: "Комедија на забуна", date: "05.01.2026", time: "19:30", seats: [7, 8], price: 250 },
  ])

  const [profileData, setProfileData] = useState(user)
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
const handleSaveProfile = () => {
  console.log("Saved profile:", profileData)
  setSnackbar({ message: "Податоците се успешно зачувани!", type: "success" })

  // auto-hide after 3 seconds
  setTimeout(() => setSnackbar(null), 3000)
}

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const handleChangePassword = () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    setSnackbar({ message: "Пополни ги сите полиња", type: "error" })
    return
  }

  if (newPassword !== confirmPassword) {
    setSnackbar({ message: "Лозинките не се совпаѓаат", type: "error" })
    return
  }

  setSnackbar({ message: "Лозинката е успешно променета", type: "success" })
  setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")

  setTimeout(() => setSnackbar(null), 3000)
}


  const [reservationToDelete, setReservationToDelete] = useState<any | null>(null) // delete modal

  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
  <h2 className="text-2xl font-semibold mb-6">Лични податоци</h2>

  <form
    onSubmit={e => {
      e.preventDefault()
      handleSaveProfile()
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
      placeholder="E-пошта"
    />

    <input
      name="phone"
      value={profileData.phone}
      onChange={handleProfileChange}
      className="input"
      placeholder="Телефон"
    />

    <button
      type="submit"
      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
    >
      Промени податоци
    </button>
  </form>
</div>


            {/* PASSWORD */}
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Промена на лозинка</h2>
              <form
                onSubmit={e => { e.preventDefault(); handleChangePassword() }}
                className="space-y-4"
              >
                <input type="password" placeholder="Стара лозинка" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="input" />
                <input type="password" placeholder="Нова лозинка" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" />
                <input type="password" placeholder="Потврди лозинка" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input" />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
                  Промени лозинка
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
                  <button onClick={() => navigate("/login")} className="mt-10 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition">
          Одјава
        </button>
        </div>
      </div>

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
      )}{snackbar && (
  <div
    className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl text-white shadow-lg z-50 transition-all duration-300 ${
      snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
    }`}
  >
    {snackbar.message}
  </div>
)}

    </div>
    
  )
}
