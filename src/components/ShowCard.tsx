import { Link } from "react-router-dom";
import type { Show } from "../types";

type Props = {
  show: Show;
};

export default function ShowCard({ show }: Props) {
  return (
    <Link to={`/show/${show.id}`} className="group perspective">
      <div className="relative h-80 w-60 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
        {/* Front side */}
        <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-lg">
          <img
            src={show.image || "/poster-placeholder.svg"}
            alt={show.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Back side */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl overflow-hidden">
          <div className="h-full w-full bg-black/60 backdrop-blur-md flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white text-center px-4">
              {show.title}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
}
