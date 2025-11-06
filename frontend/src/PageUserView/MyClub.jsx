import { useState, useEffect } from "react";
import "../output.css";
import Header from "../componentUserView/Header";
import Tilte from "../assets/img/Tilte.png";
import Position from "../componentUserView/Position.jsx";
import PositionImg from "../componentUserView/PositionImage.jsx";
import { playerService } from "../Api/playerService.js";

export default function MyClub() {
  const [allPlayers, setAllPlayers] = useState({
    goalkeepers: [],
    defenders: [],
    midfielders: [],
    forwards: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tất cả dữ liệu khi component mount
  useEffect(() => {
    const fetchAllPlayers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Gọi tất cả API cùng lúc
        const [goalkeepersRes, defendersRes, midfieldersRes, attackersRes] =
          await Promise.all([
            playerService.getGoalkeepers(),
            playerService.getDefenders(),
            playerService.getMidfielders(),
            playerService.getAttackers(),
          ]);

        // Cập nhật state với dữ liệu từ API
        setAllPlayers({
          goalkeepers:
            goalkeepersRes.status === "success" ? goalkeepersRes.data : [],
          defenders: defendersRes.status === "success" ? defendersRes.data : [],
          midfielders:
            midfieldersRes.status === "success" ? midfieldersRes.data : [],
          forwards: attackersRes.status === "success" ? attackersRes.data : [],
        });
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to load players"
        );
        console.error("Error fetching players:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPlayers();
  }, []); // Empty dependency array - chỉ chạy 1 lần khi mount

  // Component hiển thị một section vị trí
  const PlayerSection = ({ title, players }) => {
    const sectionId = title.toLowerCase(); // "goalkeepers"

    return (
      <div
        id={sectionId}
        className="flex flex-col gap-10 items-center justify-center pt-30"
      >
        <Position name={title} />
        <div className="grid grid-cols-3 gap-15 max-sm:grid-cols-1">
          {players.length > 0 ? (
            players.map((player) => (
              <PositionImg
                key={player.id}
                image={player.bioImage}
                alt={player.playerName}
                playerName={player.playerName}
                match={player.totalMatches.toString()}
                goal={player.totalGoals.toString()}
                assists={player.totalAssists.toString()}
                playerId={player.id}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-xl font-semibold text-gray-600">
                No players found for this position
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };
  const positionButtons = [
    { key: "GOALKEEPERS", label: "GOALKEEPERS" },
    { key: "DEFENDERS", label: "DEFENDERS" },
    { key: "MIDFIELDERS", label: "MIDFIELDERS" },
    { key: "FORWARDS", label: "FORWARDS" },
  ];

  return (
    <div className="flex flex-col Kanit">
      <Header />
      <div className="relative w-full h-80 overflow-hidden max-sm:h-50">
        <img
          src={Tilte}
          alt="Liverpool fans"
          className="absolute inset-0 w-full h-80 object-cover max-sm:w-dvw max-sm:50"
        />
        <div className="absolute inset-0 flex items-center justify-center pt-15">
          <div className="bg-white/30 backdrop-blur-sm px-8 py-4 rounded-lg w-full flex justify-center max-sm:py-2">
            <div className="text-white font-black text-7xl tracking-wider text-shadow-md max-sm:text-2xl">
              <p>FC LIVERPOOL - FIRST TEAM</p>
            </div>
          </div>
        </div>
      </div>
      {/* Position Buttons */}
      <div className="flex items-center justify-center pt-28 gap-12 max-sm:gap-5 max-sm:pt-15">
        {positionButtons.map((btn) => {
          const sectionId = btn.key.toLowerCase(); // "GOALKEEPERS" → "goalkeepers"

          const handleScroll = () => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          };

          return (
            <button
              key={btn.key}
              onClick={handleScroll}
              className={`
          border-1 w-32 h-10 max-sm:w-20 shadow-2xl text-white text-sm max-sm:text-xs font-bold 
          transition-all duration-300
          bg-black hover:bg-gradient-to-r hover:from-[#A21E1E] hover:to-[#3C0B0B]
          active:scale-95
        `}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-r from-[#a11a1a] to-[#2a0000] bg-blend-color-burn w-full max-sm:bg-white">
        <div className="bg-white w-[90%] h-full m-auto flex flex-col pb-20">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
              <p className="text-2xl font-semibold mt-6 text-gray-700">
                Loading all players...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20 px-4">
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
                <p className="font-bold text-xl mb-2">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* All Players Sections */}
          {!loading && !error && (
            <>
              {/* Goalkeepers */}
              <PlayerSection
                title="GOALKEEPERS"
                players={allPlayers.goalkeepers}
              />

              {/* Defenders */}
              <PlayerSection title="DEFENDERS" players={allPlayers.defenders} />

              {/* Midfielders */}
              <PlayerSection
                title="MIDFIELDERS"
                players={allPlayers.midfielders}
              />

              {/* Forwards */}
              <PlayerSection title="FORWARDS" players={allPlayers.forwards} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
