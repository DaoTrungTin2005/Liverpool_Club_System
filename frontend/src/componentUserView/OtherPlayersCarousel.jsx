import { useState } from "react";
import Position from "../componentUserView/Position.jsx";
import PositionImage from "../componentUserView/PositionImage.jsx";
import next from "../assets/img/next.png";
import prev from "../assets/img/prev.png";
import img from "../assets/img/salah.png";
import anfieldnight from "../assets/img/anfieldnight.png";
export default function OtherPlayersCarousel({
  positionName = "TOP GOAL SCORES",
  players = [],
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const ITEMS_PER_SLIDE = 3;

  // Dữ liệu giả mặc định nếu không truyền vào
  const defaultPlayers = [
    {
      id: 1,
      playerName: "Mohamed Salah",
      bioImage: img,
      shirtNumber: 11,
      totalGoals: 25,
      totalMatches: 38,
      totalAssists: 12,
    },
    {
      id: 2,
      playerName: "Darwin Núñez",
      bioImage: img,
      shirtNumber: 9,
      totalGoals: 18,
      totalMatches: 35,
      totalAssists: 8,
    },
    {
      id: 3,
      playerName: "Diogo Jota",
      bioImage: img,
      shirtNumber: 20,
      totalGoals: 12,
      totalMatches: 28,
      totalAssists: 5,
    },
    {
      id: 4,
      playerName: "Luis Díaz",
      bioImage: img,
      shirtNumber: 7,
      totalGoals: 15,
      totalMatches: 32,
      totalAssists: 9,
    },
    {
      id: 5,
      playerName: "Cody Gakpo",
      bioImage: img,
      shirtNumber: 18,
      totalGoals: 10,
      totalMatches: 30,
      totalAssists: 7,
    },
    {
      id: 6,
      playerName: "Harvey Elliott",
      bioImage: img,
      shirtNumber: 19,
      totalGoals: 5,
      totalMatches: 25,
      totalAssists: 6,
    },
  ];

  const displayPlayers = players.length > 0 ? players : defaultPlayers;
  const totalSlides = Math.ceil(displayPlayers.length / ITEMS_PER_SLIDE);

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

  if (displayPlayers.length === 0) {
    return null;
  }

  return (
    <div
      className="bg-gradient-to-b from-black via-gray-900 to-black py-20"
      style={{
        backgroundImage: `url(${anfieldnight})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col gap-10 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2 Kanit">
          <h1 className="font-bold text-white mb-2 text-7xl max-sm:text-3xl">
            {positionName || "TOP GOAL SCORES"}
          </h1>
          <p className="text-xl text-white">FC LIVERPOOL 25/26 SEASON</p>
        </div>
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
                const slidePlayers = displayPlayers.slice(
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
            <img src={next} alt="Next" className="w-16 h-16 md:w-20 md:h-20" />
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
      </div>

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
    </div>
  );
}
