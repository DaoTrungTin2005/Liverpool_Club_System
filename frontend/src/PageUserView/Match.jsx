import "../output.css";
import Header from "../componentUserView/Header";
import TheKopMFS from "../assets/img/TheKopMFS.png";
import CardTour from "../componentUserView/CardTour";
import Carabaocup from "../assets/img/Carabaocup.png";
import Premiercup from "../assets/img/Premiercup.png";
import C1 from "../assets/img/C1.png";
import CupFA from "../assets/img/CupFA.png";
import CountDown from "../componentUserView/CoutDown";
import MatchBanner from "../componentUserView/MatchBanner";
import TotvsLiver from "../assets/img/TotvsLiv.png";

export default function Match() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src={TheKopMFS}
          alt="Liverpool FC - Matches and Tickets"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-red-900/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center mt-100 translate-y-[-10vh] md:translate-y-[-12vh] lg:translate-y-[-15vh]">
          <h1
            className="
            text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
            font-black tracking-wider text-white 
            drop-shadow-2xl
            leading-none
          "
            style={{
              textShadow: `
              0 4px 8px rgba(0,0,0,0.8),
              0 0 20px rgba(255,0,0,0.6),
              0 0 40px rgba(255,0,0,0.3)
            `,
              letterSpacing: "0.12em",
            }}
          >
            LIVERPOOL FC
          </h1>
          <p
            className="
            text-base sm:text-lg md:text-xl lg:text-2xl 
            font-bold tracking-widest 
            text-transparent 
            [-webkit-text-stroke:1px_white] 
            mt-3 md:mt-4
            drop-shadow-lg
          "
            style={{
              WebkitTextStroke: "1px white",
              letterSpacing: "0.3em",
              textShadow: "0 2px 6px rgba(0,0,0,0.8)",
            }}
          >
            MATCHES AND TICKETS
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center pt-28 gap-12 max-sm:gap-5 max-sm:pt-15 h-full"></div>
      <div className="bg-gradient-to-r from-[#a11a1a] to-[#2a0000] bg-blend-color-burn overflow-x-hidden h-full max-sm:bg-white">
        <div className="bg-white w-[90%] h-full m-auto flex flex-col mt-20 pt-20 pb-100">
          <div className="flex gap-10 items-center justify-center h-full w-full">
            <CardTour image={Carabaocup} name="Carabao Cup" />
            <CardTour image={Premiercup} name="Premier League" />
            <CardTour image={C1} name="Champions League" />
            <CardTour image={CupFA} name="FA cup" />
          </div>
          <CountDown targetDate="2025-11-08T20:00:00" />
          <MatchBanner
            league="Premier League"
            home="Liverpool"
            away="Totenham"
            tournament="Premier League"
            time="12:30"
            date="14/12/2025"
            img={TotvsLiver}
          />
          <MatchBanner
            league="FA Cup"
            home="Liverpool"
            away="Totenham"
            tournament="Premier League"
            time="12:30"
            date="14/12/2025"
            img={TotvsLiver}
          />
          <MatchBanner
            league="CARABAO Cup"
            home="Liverpool"
            away="Totenham"
            tournament="Premier League"
            time="12:30"
            date="14/12/2025"
            img={TotvsLiver}
          />
          <MatchBanner
            league="Champions League"
            home="Liverpool"
            away="Totenham"
            tournament="Premier League"
            time="12:30"
            date="14/12/2025"
            img={TotvsLiver}
          />
        </div>
      </div>
    </div>
  );
}
