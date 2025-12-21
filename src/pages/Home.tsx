import ShowCard from "../components/ShowCard"
import { shows } from "../data/shows"

export default function Home() {
  return (
    <div className="p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Претстави на репертоар
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center">
        {shows.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  )
}
