export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-neutral-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-red-500 font-bold text-xl">Партер</h1>

        <div className="flex gap-6 text-gray-300">
          <a href="/" className="hover:text-red-400">Репертоар</a>
                              <a href="/about" className="hover:text-red-400">За театарот</a>
                    <a href="/login" className="hover:text-red-400">Најава</a>

        </div>
      </div>
    </nav>
  )
}
