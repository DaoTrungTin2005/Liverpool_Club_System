import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../output.css";
import Header from "./Header";
import BackgroundPlayer from "./BackgroundPlayer";
import BodyPlayer from "./BodyPlayer";
import Position from "../componentUserView/Position.jsx";
import PositionImage from "../componentUserView/PositionImage.jsx";
import next from "../assets/img/next.png";
import prev from "../assets/img/prev.png";
import { playerService } from "../Api/playerService.js";
import Footer from "./Footer.jsx";

export default function ProfilePlayer() {
  const location = useLocation();
  const playerId = location.state?.playerId;
  const [playerData, setPlayerData] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const ITEMS_PER_SLIDE = 3;

  useEffect(() => {
    const fetchPlayerData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Gọi CẢ 2 API song song
        const [profileResponse, statsResponse] = await Promise.all([
          playerService.getPlayerProfile(playerId),
          playerService.getPlayerStats(playerId),
        ]);

        if (profileResponse.status === "success") {
          setPlayerData(profileResponse.data);
          console.log("Profile Data:", profileResponse.data);
        }

        if (statsResponse.status === "success") {
          setPlayerStats(statsResponse.data);
          console.log("Stats Data:", statsResponse.data);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load player data"
        );
        console.error("Error fetching player data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchPlayerData();
    }
  }, [playerId]);

  // Transform stats data từ stats API endpoint
  const transformStats = (statsData) => {
    if (!statsData) {
      console.warn("No stats data available");
      return {
        matches: { total: 0, ucl: 0, epl: 0, carabao: 0, fa: 0 },
        goals: { total: 0, ucl: 0, epl: 0, carabao: 0, fa: 0 },
        assists: { total: 0, ucl: 0, epl: 0, carabao: 0, fa: 0 },
      };
    }

    // Stats API trả về: tournamentStats array và totals
    const tournamentStats = statsData.tournamentStats || [];

    console.log("Tournament Stats from API:", tournamentStats);

    // Khởi tạo với totals từ API
    const stats = {
      matches: {
        total: statsData.totalMatches || 0,
        ucl: 0,
        epl: 0,
        carabao: 0,
        fa: 0,
      },
      goals: {
        total: statsData.totalGoals || 0,
        ucl: 0,
        epl: 0,
        carabao: 0,
        fa: 0,
      },
      assists: {
        total: statsData.totalAssists || 0,
        ucl: 0,
        epl: 0,
        carabao: 0,
        fa: 0,
      },
    };

    // Map tournament names to keys
    const tournamentMap = {
      "Champions League": "ucl",
      "Champion League": "ucl",
      "CHAMPION LEAGUE": "ucl",
      "UEFA Champions League": "ucl",
      "Premier League": "epl",
      "PREMIER LEAGUE": "epl",
      "Carabao Cup": "carabao",
      "CARABAO CUP": "carabao",
      "FA Cup": "fa",
      "FA CUP": "fa",
    };

    // Process từng tournament
    tournamentStats.forEach((stat) => {
      const tournamentName = stat.tournamentName || stat.tournament;
      const key = tournamentMap[tournamentName];

      if (key) {
        stats.matches[key] = stat.matches || 0;
        stats.goals[key] = stat.goals || 0;
        stats.assists[key] = stat.assists || 0;
      } else {
        console.warn(`Tournament not mapped: "${tournamentName}"`);
      }
    });

    console.log("Transformed stats:", stats);
    return stats;
  };

  const totalSlides = playerData?.otherPlayers
    ? Math.ceil(playerData.otherPlayers.length / ITEMS_PER_SLIDE)
    : 0;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Loading State
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
            <p className="text-2xl font-semibold mt-6 text-white">
              Loading player profile...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="bg-red-900/50 border-2 border-red-600 text-white px-8 py-6 rounded-lg max-w-md backdrop-blur-sm">
            <p className="font-bold text-2xl mb-3">⚠️ Error</p>
            <p className="text-lg">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  // No Data State
  if (!playerData) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-black">
          <p className="text-2xl text-gray-400">No player data found</p>
        </div>
      </>
    );
  }

  // Debug: Log dữ liệu để kiểm tra
  console.log("Player Data:", playerData);
  console.log("Player Stats:", playerStats);

  const transformedStats = transformStats(playerStats);

  return (
    <>
      <Header />

      {/* Background Section */}
      <BackgroundPlayer
        img={playerData.backgroundImage}
        alt={playerData.playerName}
        namePlayer={playerData.playerName}
        numberPlayer={`#${playerData.shirtNumber}`}
      />

      {/* Body Section with Stats */}
      <BodyPlayer
        fullBio={playerData.bio}
        dateOfBirth={playerData.dateOfBirth}
        location={playerData.location}
        nationality={playerData.nationality}
        joinedClub={playerData.joinedClub}
        stats={transformedStats}
      />

      {/* Other Players Carousel Section */}
      {playerData.otherPlayers && playerData.otherPlayers.length > 0 && (
        <div className="bg-gradient-to-b from-black via-gray-900 to-black py-20">
          <div className="flex flex-col gap-10 items-center justify-center">
            <Position name={`OTHER ${playerData.positionName}S`} />

            <div className="flex items-center justify-center w-full px-4 md:px-10">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className={`transition-all duration-300 flex-shrink-0 ${
                  currentSlide === 0
                    ? "opacity-20 cursor-not-allowed scale-90"
                    : "opacity-100 hover:scale-110 cursor-pointer active:scale-95"
                }`}
                aria-label="Previous slide"
              >
                <img
                  src={prev}
                  alt="Previous"
                  className="w-16 h-16 md:w-20 md:h-20"
                />
              </button>

              {/* Carousel Container */}
              <div className="overflow-hidden mx-4 md:mx-8 max-w-6xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {/* Render all slides */}
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                    const slideStartIndex = slideIndex * ITEMS_PER_SLIDE;
                    const slidePlayers = playerData.otherPlayers.slice(
                      slideStartIndex,
                      slideStartIndex + ITEMS_PER_SLIDE
                    );

                    return (
                      <div
                        key={slideIndex}
                        className="flex gap-6 md:gap-15 min-w-full justify-center"
                      >
                        {slidePlayers.map((player, idx) => (
                          <div
                            key={player.id}
                            className="animate-slideIn"
                            style={{
                              animationDelay: `${idx * 150}ms`,
                              animationFillMode: "both",
                            }}
                          >
                            <PositionImage
                              image={player.bioImage}
                              alt={player.playerName}
                              playerName={player.playerName}
                              goal={player.totalGoals?.toString() || "0"}
                              match={player.totalMatches?.toString() || "0"}
                              assists={player.totalAssists?.toString() || "0"}
                              playerId={player.id}
                              number={player.shirtNumber.toString()}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={currentSlide === totalSlides - 1}
                className={`transition-all duration-300 flex-shrink-0 ${
                  currentSlide === totalSlides - 1
                    ? "opacity-20 cursor-not-allowed scale-90"
                    : "opacity-100 hover:scale-110 cursor-pointer active:scale-95"
                }`}
                aria-label="Next slide"
              >
                <img
                  src={next}
                  alt="Next"
                  className="w-16 h-16 md:w-20 md:h-20"
                />
              </button>
            </div>

            {/* Slide Indicators */}
            {totalSlides > 1 && (
              <div className="flex gap-3 mt-8">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-3 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? "w-12 bg-red-600 shadow-lg shadow-red-600/50"
                        : "w-3 bg-gray-600 hover:bg-gray-500"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Navigation Hint */}
            {totalSlides > 1 && (
              <div className="text-gray-500 text-sm mt-4 flex items-center gap-2">
                <span className="animate-pulse">←</span>
                <span>Swipe or click arrows to see more players</span>
                <span className="animate-pulse">→</span>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
}
