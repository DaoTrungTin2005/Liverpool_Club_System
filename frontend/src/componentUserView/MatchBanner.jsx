import "../output.css";
import MatchBuy from "./MatchBuy";
export default function MatchBanner(props) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10 w-full h-full py-100 px-30">
        <h1 className="text-6xl my-10 font-extrabold bg-gradient-to-r from-[#653C39] via-[#BE0C43] to-[#653C39] bg-clip-text text-transparent">
          {props.league}
        </h1>
        <div className="w-full h-[1px] border border-1 border-gray-500 shadow-gray-500 my-10 "></div>
        <div className="grid grid-cols-3 h-100 w-full gap-10">
          <MatchBuy
            home={props.home}
            away={props.away}
            tournament={props.tournament}
            time={props.time}
            date={props.date}
            img={props.img}
          />
          <MatchBuy
            home={props.home}
            away={props.away}
            tournament={props.tournament}
            time={props.time}
            date={props.date}
            img={props.img}
          />
          <MatchBuy
            home={props.home}
            away={props.away}
            tournament={props.tournament}
            time={props.time}
            date={props.date}
            img={props.img}
          />
          <MatchBuy
            home={props.home}
            away={props.away}
            tournament={props.tournament}
            time={props.time}
            date={props.date}
            img={props.img}
          />
          <MatchBuy
            home={props.home}
            away={props.away}
            tournament={props.tournament}
            time={props.time}
            date={props.date}
            img={props.img}
          />
          <MatchBuy
            home={props.home}
            away={props.away}
            tournament={props.tournament}
            time={props.time}
            date={props.date}
            img={props.img}
          />
        </div>
      </div>
    </>
  );
}
