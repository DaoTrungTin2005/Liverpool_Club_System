import "../output.css";
import MatchBuy from "./MatchBuy";
import TotvsLiv from "../assets/img/TotvsLiv.png";
export default function MatchBanner(props) {
  const { league, matches = [] } = props;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10 w-full h-full py-100 px-30 ">
        <h1 className="text-6xl my-10 font-extrabold bg-gradient-to-r from-[#653C39] via-[#BE0C43] to-[#653C39] bg-clip-text text-transparent">
          {league}
        </h1>
        <div className="w-full h-[1px] border border-1 border-gray-500 shadow-gray-500 my-10 "></div>

        {/* ✅ render tất cả trận trong giải */}
        <div className="grid grid-cols-3 h-100 w-full gap-10 max-sm:grid-cols-1">
          {matches.map((match) => {
            const dateObj = new Date(match.matchDate);
            const date = dateObj.toLocaleDateString("vi-VN");
            const time = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <MatchBuy
                key={match.id}
                id={match.id}
                home={match.homeTeam}
                away={match.awayTeam}
                tournament={match.tournamentName}
                time={time}
                date={date}
                img={match.matchImage}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
