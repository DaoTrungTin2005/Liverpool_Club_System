import { useEffect, useState } from "react";
import api from "../Api/apitoken";
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
import Footer from "../componentUserView/Footer";

export default function Match() {
  const [matchesByTournament, setMatchesByTournament] = useState({});
  const [nextMatchDate, setNextMatchDate] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("api/matches-and-tickets/home-matches");
        if (res.data?.status === "success") {
          const data = res.data.data;

          // Luôn có 4 giải, dù API có thiếu
          const tournaments = [
            "Carabao Cup",
            "Premier League",
            "Champions League",
            "FA Cup",
          ];
          const formattedData = {};
          tournaments.forEach((t) => {
            formattedData[t] = data.matchesByTournament[t] || [];
          });

          setNextMatchDate(data.nextMatchDate);
          setMatchesByTournament(formattedData);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu trận đấu:", err);
      }
    };
    fetchMatches();
  }, []);

  // Khi click "View more" ở CardTour
  const handleViewMore = (tournamentName) => {
    // Nếu đang chọn cùng giải -> bỏ chọn (hiện lại tất cả)
    if (selectedTournament === tournamentName) {
      setSelectedTournament(null);
    } else {
      setSelectedTournament(tournamentName);
      // Cuộn đến phần giải
      const el = document.getElementById(tournamentName.replace(/\s+/g, "-"));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Lọc các giải cần hiển thị
  const visibleTournaments =
    selectedTournament && matchesByTournament[selectedTournament]
      ? { [selectedTournament]: matchesByTournament[selectedTournament] }
      : matchesByTournament;

  return (
    <div className="flex flex-col">
      <Header />

      {/* Banner đầu trang */}
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
              drop-shadow-2xl leading-none
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

      {/* Nội dung chính */}
      <div className="bg-gradient-to-r from-[#a11a1a] to-[#2a0000] bg-blend-color-burn overflow-x-hidden h-full max-sm:bg-white">
        <div className="bg-white w-[90%] h-full m-auto flex flex-col mt-20 pt-20 pb-100">
          {/* Các giải đấu */}
          <div className="flex gap-10 items-center justify-center h-full w-full max-sm:flex-col max-sm:gap-6 mb-20">
            <CardTour
              image={Carabaocup}
              name="Carabao Cup"
              onViewMore={() => handleViewMore("Carabao Cup")}
            />
            <CardTour
              image={Premiercup}
              name="Premier League"
              onViewMore={() => handleViewMore("Premier League")}
            />
            <CardTour
              image={C1}
              name="Champions League"
              onViewMore={() => handleViewMore("Champions League")}
            />
            <CardTour
              image={CupFA}
              name="FA Cup"
              onViewMore={() => handleViewMore("FA Cup")}
            />
          </div>

          {/* Countdown */}
          {nextMatchDate && <CountDown targetDate={nextMatchDate} />}

          {/* Render các giải */}
          {Object.keys(visibleTournaments).length > 0 ? (
            Object.entries(visibleTournaments).map(([tournament, matches]) => (
              <div id={tournament.replace(/\s+/g, "-")} key={tournament}>
                <MatchBanner league={tournament} matches={matches} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 mt-10">
              Đang tải danh sách trận đấu...
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
