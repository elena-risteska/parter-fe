import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import ShowDetails from "./pages/ShowDetails"
import Reservation from "./pages/Reservation"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-white">
                <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetails />} />
<Route path="/reserve/:id" element={<Reservation />} />

        </Routes>
      </div>
    </Router>
  )
}
