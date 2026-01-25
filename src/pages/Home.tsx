import { useEffect, useState } from "react";
import ShowCard from "../components/ShowCard";
import type { Show } from "../types";

export default function Home() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/plays");

        if (!res.ok) {
          throw new Error("Failed to fetch plays");
        }

        const data = await res.json();
        setShows(data);
      } catch (err) {
        setError("Неуспешно вчитување на претставите");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Се вчитува...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Претстави на репертоар
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}
