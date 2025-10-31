import "../output.css";
import defaultImage from "../assets/img/ViewPlayer.png";
import { Link } from "react-router-dom";

export default function PositionImg({
  image = defaultImage,
  alt = "V4",
  playerName = "Slot",
  match = "4",
  goal = "2",
  assists = "2",
}) {
  return (
    <Link to={"/myclub/player"}>
      <div className="relative flex flex-col items-center group cursor-pointer">
        <img
          src={image}
          alt={alt}
          className="w-[350px] h-[500px] rounded-2xl shadow-xl object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl transition-all duration-300"></div>

        <p
          className={`
              absolute left-1/2 -translate-x-1/2 text-3xl font-extrabold text-white 
              drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] 
              transition-all duration-300 ease-out
              bottom-8
              group-hover:bottom-30
            `}
        >
          {playerName}
        </p>
        <div
          className={`
              absolute left-1/2 -translate-x-1/2 w-0 border-t-2 border-white 
              opacity-0 
              transition-all duration-300 ease-out
              group-hover:w-3/4 group-hover:opacity-100
              bottom-25
            `}
        ></div>
        <div
          className={`
              flex text-white font-bold text-3xl absolute bottom-5 gap-10 
              opacity-0 translate-y-6
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300 ease-out
            `}
        >
          <div className="flex flex-col justify-center items-center">
            <p className="text-sm">Match</p>
            <p>{match}</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-sm">Goal</p>
            <p>{goal}</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-sm">Assists</p>
            <p>{assists}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
