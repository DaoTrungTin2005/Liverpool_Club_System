import "../output.css";
import Button from "../pageAdminUser/componentAdminUser/Button";
export default function MatchBuy(props) {
  return (
    <>
      <div className="h-full relative text-white group">
        <img src={props.img} alt={props.img} className="w-full h-full" />
        <div className="absolute z-50 inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p
            className="text-4xl text-transparent drop-shadow-lg font-light uppercase tracking-widest"
            style={{
              WebkitTextStroke: "0.3px #FFFF",
            }}
          >
            {props.home}
          </p>
          <p className="font-[Russo One] text-3xl">VS</p>
          <p
            className="text-4xl text-transparent drop-shadow-lg font-light uppercase tracking-widest"
            style={{
              WebkitTextStroke: "0.5px #FFFF",
            }}
          >
            {props.away}
          </p>
          <fieldset className="border-2 border-gray-400 p-4 rounded-lg text-center font-bold">
            <legend>{props.tournament}</legend>
            <label className="flex gap-5 items-center justify-center">
              <p>{props.time}</p>
              <div className="h-5 w-[1px] border border-1 border-amber-50"></div>
              <p>{props.date}</p>
            </label>
          </fieldset>
          <Button text="View More" />
        </div>
      </div>
    </>
  );
}
