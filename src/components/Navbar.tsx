import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-neutral-800 p-4 flex justify-between">
      <Link to="/" className="text-red-500 font-bold text-xl">
        Партер
      </Link>
      <div>
        <Link to="/" className="mr-4 hover:text-red-400">Репертоар</Link>
      </div>
    </nav>
  )
}
