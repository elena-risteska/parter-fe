import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import ShowDetails from "./pages/ShowDetails"
import Reservation from "./pages/Reservation"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-white">
                <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetails />} />
<Route path="/reserve/:id" element={<Reservation />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="*" element={<NotFound />} />

        </Routes>
      </div>
    </Router>
  )
}
