import "../output.css";
import Button from "../pageAdminUser/componentAdminUser/Button";
import { useNavigate } from "react-router-dom";
export default function MatchBuy(props) {
  const navigate = useNavigate();

  const handleViewMore = () => {
    // Truyền matchId sang trang Ticket
    navigate("/ticket", {
      state: { matchId: props.id }, // props.id là match.id từ API
    });
  };
  return (
    <>
      <div className="h-full relative text-white group rounded-3xl RussoOne">
        <img
          src={props.img}
          alt={props.img}
          className="w-full h-full rounded-3xl"
        />
        <div className="absolute inset-0 group-hover:bg-black/26 group-hover:border group-hover:border-5 group-hover:blur-[2px] bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 pointer-events-none rounded-3xl group-hover:border-[#777]" />
        <div className="absolute z-50 inset-0 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-35">
          <p
            className="text-2xl text-transparent drop-shadow-lg font-light uppercase tracking-widest text-center"
            style={{
              WebkitTextStroke: "0.9px #FFFF",
            }}
          >
            {props.home}
          </p>
          <p className="font-[Russo One] text-3xl text-center">VS</p>
          <p
            className="text-2xl text-transparent drop-shadow-lg font-light uppercase tracking-widest text-center"
            style={{
              WebkitTextStroke: "0.5px #FFFF",
            }}
          >
            {props.away}
          </p>
          <fieldset className="border-2 border-gray-400 p-4 rounded-lg text-thin text-center font-normal text-xs RussoOne">
            <legend>{props.tournament}</legend>
            <label className="flex gap-5 items-center justify-center">
              <p>{props.time}</p>
              <div className="h-5 w-[1px] border border-1 border-amber-50"></div>
              <p>{props.date}</p>
            </label>
          </fieldset>
          <Button text="View More" onClick={handleViewMore} />
        </div>
      </div>
    </>
  );
}
