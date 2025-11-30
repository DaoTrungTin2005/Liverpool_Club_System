import "../output.css";
import Header from "../componentUserView/Header.jsx";
import Footer from "../componentUserView/Footer.jsx";
import stadium from "../assets/img/anfield.png";
import fans from "../assets/img/fans.png";
import next from "../assets/img/next.png";
import prev from "../assets/img/prev.png";
import next_ from "../assets/img/next_.png";
import prev_ from "../assets/img/prev_.png";
import MatchBuy from "../componentUserView/MatchBuy.jsx";
import real from "../assets/img/TotvsLiv.png";
import anfielddOn from "../assets/img/anfieldOn.png";
import logo from "../assets/img/liverpoollogo.png";
import liverpool from "../assets/img/liverpool.png";
import homekit from "../assets/img/homekit.png";
import awaykit from "../assets/img/awaykit.png";
import thirdkit from "../assets/img/thirdkit.png";
import gkkit from "../assets/img/gkkit.png";
import blur from "../assets/img/blur.png";
import klopp from "../assets/img/klopp.png";
import slot from "../assets/img/slot.png";
import shoesred from "../assets/img/shoesred.png";
import shoesgreen from "../assets/img/shoesgreen.png";
import shoesring from "../assets/img/shoesring.png";
import anfield1 from "../assets/img/anfield1.png";
import anfield2 from "../assets/img/anfield2.png";
import anfield3 from "../assets/img/anfield3.png";
import anfield4 from "../assets/img/anfield4.png";
import anfield5 from "../assets/img/anfield5.png";
import anfield6 from "../assets/img/anfield6.png";
import anfield7 from "../assets/img/anfield7.png";
import anfield8 from "../assets/img/anfield8.png";
import anfield9 from "../assets/img/anfield9.png";
import stadiumhigh from "../assets/img/stadiumhigh.png";
import cup from "../assets/img/cup.png";
import Jota from "../assets/img/Jota.png";
import OtherPlayersCarousel from "../componentUserView/OtherPlayersCarousel";
import { EPL } from "../assets/svg/SvgCup";
import { C1 } from "../assets/svg/SvgCup.jsx";
import { FA } from "../assets/svg/SvgCup.jsx";
import { C2 } from "../assets/svg/SvgCup.jsx";
import { Carabao } from "../assets/svg/SvgCup.jsx";
import { Super } from "../assets/svg/SvgCup.jsx";
import { ClubWC } from "../assets/svg/SvgCup.jsx";
import { useState } from "react";
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const fullBio = `Yêu, là chết ở trong lòng một ít,
Vì mấy khi yêu mà chắc được yêu?
Cho rất nhiều, song nhận chẳng bao nhiêu;
Người ta phụ, hoặc thờ ơ, chẳng biết.

Phút gần gũi cũng như giờ chia biệt,
Tưởng trăng tàn, hoa tạ với hồn tiêu,
Vì mấy khi yêu mà chắc được yêu!
Yêu, là chết ở trong lòng một ít.

Họ lạc lối giữa u sầu mù mịt,
Những người si theo dõi dấu chân yêu;
Và cảnh đời là sa mạc cô liêu.
Và tình ái là sợi dây vấn vít.
Yêu, là chết ở trong lòng một ít.`;

  // Dữ liệu giả cho các trận đấu
  const [matches] = useState([
    {
      id: 1,
      homeTeam: "Liverpool FC",
      awayTeam: "Manchester United",
      tournamentName: "Premier League",
      time: "15:00",
      date: "2025-12-15",
      matchImage: real,
    },
    {
      id: 2,
      homeTeam: "Liverpool FC",
      awayTeam: "Chelsea FC",
      tournamentName: "FA Cup",
      time: "20:00",
      date: "2025-12-22",
      matchImage: real,
    },
    {
      id: 3,
      homeTeam: "Liverpool FC",
      awayTeam: "Arsenal FC",
      tournamentName: "Premier League",
      time: "17:30",
      date: "2025-12-28",
      matchImage: real,
    },
  ]);

  // State để theo dõi trận đấu hiện tại
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Hàm chuyển sang trận tiếp theo
  const handleNext = () => {
    setCurrentMatchIndex((prevIndex) =>
      prevIndex === matches.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Hàm quay lại trận trước
  const handlePrev = () => {
    setCurrentMatchIndex((prevIndex) =>
      prevIndex === 0 ? matches.length - 1 : prevIndex - 1
    );
  };

  const currentMatch = matches[currentMatchIndex];

  // Kiểm tra nếu không có match nào
  if (!currentMatch) {
    return null;
  }

  const kits = [
    { id: 1, name: "Away Kit", img: awaykit },
    { id: 2, name: "Home Kit", img: homekit },
    { id: 3, name: "Third Kit", img: thirdkit },
    { id: 4, name: "GK Kit", img: gkkit },
  ];

  const handlePrev_ = () => {
    setCurrentIndex((prev) => (prev === 0 ? kits.length - 1 : prev - 1));
  };

  const handleNext_ = () => {
    setCurrentIndex((prev) => (prev === kits.length - 1 ? 0 : prev + 1));
  };

  const getPosition = (index) => {
    const diff = index - currentIndex;
    if (diff === 0) return "center";
    if (diff === 1 || diff === -(kits.length - 1)) return "right";
    if (diff === -1 || diff === kits.length - 1) return "left";
    return "hidden";
  };
  const shortBio = fullBio.split("\n").slice(0, 4).join("\n") + "...";
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pb-30">
        <div className="w-full h-screen">
          {/* Main Container */}
          <div className="relative w-full h-screen">
            {/* Stadium Image Section */}
            <div className="relative h-96 bg-gray-800 rounded-t-xl overflow-hidden w-full h-screen">
              {/* Background Image - User replaces this */}
              <img
                src={stadium}
                alt="Anfield Stadium"
                className="w-full h-full object-cover"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/50"></div>

              {/* YNWA Text - positioned near bottom */}
              <div className="absolute bottom-36 left-0 right-0 px-4">
                <h1
                  className="text-center Prosto text-[#FFF6F5] text-7xl"
                  style={{
                    textShadow: "5px 9px 56px rgba(0, 0, 0, 0.60)",
                    WebkitTextStrokeWidth: "1px",
                    WebkitTextStrokeColor: "#FFF",
                  }}
                >
                  YOU'LL NEVER WALK ALONE
                </h1>
              </div>
            </div>

            {/* Stats Box - Half inside image, half outside */}
            <div className="relative -mt-12 mx-100 z-10">
              <div className="bg-white rounded-xl shadow-2xl px-12 py-6">
                <div className="flex items-center justify-center gap-12">
                  {/* Stat 1 */}
                  <div className="text-center flex flex-col items-center justify-center">
                    <p className="text-4xl font-black text-gray-900">20b+</p>
                    <p className="text-xs text-gray-900">Fans Trust Us</p>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-12 bg-gray-300"></div>

                  {/* Stat 2 */}
                  <div className="text-center">
                    <div className="text-4xl text-gray-900 flex items-center flex-col gap-1">
                      <span className="text-black font-black">4.9★</span>
                      <p className="text-xs text-gray-900">Average Rating</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-12 bg-gray-300"></div>

                  {/* Stat 3 */}
                  <div className="text-center flex flex-col items-center justify-center">
                    <p className="text-4xl font-black text-gray-900">800+</p>
                    <p className="text-xs text-gray-900">Liverpool Players</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-full py-20 mt-20 flex items-center flex-col"
        style={{
          backgroundImage: `url(${fans})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-white text-6xl font-bold mb-2">NEXT MATCHES</h1>
        <p className="text-white text-md mb-10">FC LIVERPOOL 25/26 SEASON</p>

        {/* Match Carousel */}
        <div className="flex items-center justify-center gap-8 w-full max-w-6xl px-4">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="transition-transform hover:scale-110 active:scale-95 cursor-pointer flex-shrink-0"
          >
            <img src={prev} alt="prev" className="w-12 h-12" />
          </button>

          {/* Match Cards Container */}
          <div className="flex gap-6 overflow-hidden flex-1">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentMatchIndex * 100}%)`,
              }}
            >
              {matches.map((match) => (
                <div key={match.id} className="w-auto h-120">
                  <MatchBuy
                    id={match.id}
                    home={match.homeTeam}
                    away={match.awayTeam}
                    tournament={match.tournamentName}
                    time={match.time}
                    date={match.date}
                    img={match.matchImage}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="transition-transform hover:scale-110 active:scale-95 cursor-pointer flex-shrink-0"
          >
            <img src={next} alt="next" className="w-12 h-12" />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="flex gap-2 mt-6">
          {matches.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMatchIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentMatchIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
      <div
        className="py-20 my-30 flex flex-col items-center relative overflow-x-hidden"
        style={{
          backgroundImage: `url(${anfielddOn})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col">
          <div className="flex flex-col justify-center">
            <img src={logo} alt="logo" className="w-21 h-15" />
            <p className="font-bold text-white ml-3">
              {kits[currentIndex].name.toUpperCase()} 25/26
            </p>
          </div>
          <p className="ProtestStrike text-[13rem] text-white leading-50 space-x-[-0.4rem]">
            LIVERPOOL
          </p>
        </div>
        <div className="flex items-center justify-center gap-10 ml-10">
          <div className="flex gap-30 ml-20">
            <div
              className="flex items-center justify-center relative z-10 opacity-90"
              style={{
                backgroundImage: `url(${blur})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <img src={liverpool} alt="liverpool" className="w-40 h-40 p-1" />
              <div className="Kanit flex flex-col items-center justify-center px-6 py-9.5 text-white w-70">
                <h2 className="font-bold">How was it made</h2>
                <p className="text-sm font-light Inter text-[#D1D5DB] ">
                  Premium athletic gear designed for champions. Push your limits
                  with performance-driven equipment.
                </p>
              </div>
            </div>
            <div className="flex flex-col w-70 ml-10 relative z-10">
              <p className="Inter text-[#D1D5DB]">
                Premium athletic gear designed for champions. Push your limits
                with performance-driven equipment.
              </p>
              <button className="w-30 h-10 hover:text-red-600 hover:shadow-2xl hover:scale-105 cursor-pointer bg-white mt-10">
                Shop Now
              </button>
            </div>
          </div>
          <div className="flex gap-10 mt-20 z-30 relative">
            <div
              className="rounded-full border-2 h-13 w-13 border-white flex items-center justify-center cursor-pointer transition-all pointer-events-auto"
              onClick={handlePrev_}
            >
              <img src={prev_} alt="prev" />
            </div>
            <div
              className="rounded-full border-2 h-13 w-13 border-white flex items-center justify-center cursor-pointer transition-all pointer-events-auto"
              onClick={handleNext_}
            >
              <img src={next_} alt="next" />
            </div>
          </div>
        </div>
        <div className="absolute z-0 inset-0 flex items-center justify-center -translate-y-15">
          <div className="relative w-full h-full flex items-center justify-center">
            {kits.map((kit, index) => {
              const position = getPosition(index);

              return (
                <div
                  key={kit.id}
                  className={`absolute transition-all duration-700 ease-in-out ${
                    position === "center"
                      ? "z-30 scale-100 opacity-100 translate-x-0"
                      : position === "left"
                      ? "z-20 scale-75 opacity-50 -translate-x-[770px]"
                      : position === "right"
                      ? "z-20 scale-75 opacity-50 translate-x-[770px]"
                      : "opacity-0 scale-50 pointer-events-none"
                  }`}
                  style={{
                    clipPath:
                      position === "left"
                        ? "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)"
                        : position === "right"
                        ? "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)"
                        : "none",
                    filter:
                      position !== "center"
                        ? "blur(1px) brightness(0.8)"
                        : "none",
                  }}
                >
                  <img
                    src={kit.img}
                    alt={kit.name}
                    className="h-[400px] w-auto object-contain"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 mt-auto pt-12 z-10">
          {kits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-8" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="py-20 my-30 flex flex-col items-center justify-center gap-20">
        <div className="Kanit flex flex-col items-center justify-center">
          <h1 className="text-6xl">OUR NEW PRODUCT </h1>
          <h3 className="text-xl">TRENNDING 25/26 SEASON</h3>
        </div>
        <div className="flex items-center justify-center gap-20 w-full">
          <div
            className="flex items-center justify-center gap-5 flex-col text-white w-1/4 h-200"
            style={{
              backgroundImage: `url(${klopp})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col gap-2 items-center justify-center Kanit">
              <h2 className="text-3xl font-bold">OUR NEW PRODUCT </h2>
              <p className="text-sm">TRENNDING 25/26 SEASON</p>
              <button className="w-30 h-10 hover:text-red-600 hover:shadow-2xl hover:scale-105 cursor-pointer text-black bg-white mt-10">
                Shop Now
              </button>
            </div>
            <img src={slot} alt="" className="p-2 h-100" />
          </div>
          <div className="flex flex-col gap-8">
            <div className="bg-[#F2F2F2] p-5 flex flex-col gap-5">
              <div className="flex items-center justify-center gap-5 ">
                <img src={shoesred} alt="" />
                <div className="flex items-center justify-center font-bold flex-col">
                  <p className="">AGILITY PRO</p>
                  <p className="text-[#EF4444]">149.00 VND</p>
                </div>
              </div>
              <button className="w-full mx-auto h-10 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#EF4444] hover:text-red-500 hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group">
                Buy Now
              </button>
            </div>
            <div className="bg-[#F2F2F2] p-5 flex flex-col gap-5">
              <div className="flex items-center justify-center gap-5 ">
                <img src={shoesgreen} alt="" />
                <div className="flex items-center justify-center font-bold flex-col">
                  <p className="">AGILITY PRO</p>
                  <p className="text-[#EF4444]">149.00 VND</p>
                </div>
              </div>
              <button className="w-full mx-auto h-10 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#EF4444] hover:text-red-500 hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group">
                Buy Now
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-9">
            <div className="flex items-center justify-center p-5 bg-[#F2F2F2] gap-2">
              <img src={shoesring} alt="" />
              <div className="flex items-center justify-center font-bold flex-col">
                <p className="">AGILITY PRO</p>
                <p className="text-[#EF4444]">149.00 VND</p>
                <button className="w-full mx-auto h-8 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#EF4444] hover:text-red-500 hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center p-5 bg-[#F2F2F2] gap-2">
              <img src={shoesring} alt="" />
              <div className="flex items-center justify-center font-bold flex-col">
                <p className="">AGILITY PRO</p>
                <p className="text-[#EF4444]">149.00 VND</p>
                <button className="w-full mx-auto h-8 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#EF4444] hover:text-red-500 hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center p-5 bg-[#F2F2F2] gap-2">
              <img src={shoesring} alt="" />
              <div className="flex items-center justify-center font-bold flex-col">
                <p className="">AGILITY PRO</p>
                <p className="text-[#EF4444]">149.00 VND</p>
                <button className="w-full mx-auto h-8 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#EF4444] hover:text-red-500 hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-20 my-30 flex items-center justify-center gap-5">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="flex items-center justify-center gap-3">
            <img src={anfield1} alt="anfield" className="h-150" />
            <img src={anfield2} alt="anfield" className="h-150" />
          </div>
          <img src={anfield3} alt="anfield" className="h-158" />
        </div>
        <div className="flex flex-col items-center justify-center gap-5.5">
          <img src={anfield4} alt="anfield" className="h-70" />
          <img src={anfield5} alt="anfield" className="h-150" />
          <img src={anfield6} alt="anfield" className="h-82 w-112" />
        </div>
      </div>
      <OtherPlayersCarousel positionName="TOP GOAL SCORES" />
      <div className="py-20 my-30 mb-100 flex items-center justify-center gap-10 mx-10 relative">
        <div className="flex flex-col items-center justify-center gap-10">
          <img src={anfield7} alt="" className="h-120" />
          <img src={anfield8} alt="" className="h-70" />
        </div>
        <img src={anfield9} alt="" />
        <div className="flex flex-col justify-center w-1/3 Roboto">
          <h1 className="text-5xl">About history of Liverpool FC</h1>
          <p className="whitespace-pre-line">
            {isExpanded ? fullBio : shortBio}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 px-5 w-30 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded transition flex items-center gap-2"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        </div>
      </div>
      <div
        className="py-45 my-30 flex flex-col text-white items-center justify-center relative"
        style={{
          backgroundImage: `url(${stadiumhigh})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="">
          <h2 className="font-bold text-4xl Rubik">FOREVER</h2>
          <h1 className="text-9xl RubikGlit flex items-center justify-center gap-75">
            <p>DIEGO</p>
            <p>JOTA</p>
          </h1>
          <p className="Smooch font-light text-xl">1996 - 2025</p>
        </div>
        <img
          src={Jota}
          alt="Jota"
          className="absolute z-0 mx-auto mb-40 h-270 ml-5"
        />
        <h1 className="absolute z-0 mr-200 bottom-[-120px] text-black Smooch text-8xl">
          Thank you
        </h1>
      </div>
      <div
        className="py-20 my-50 mt-100 flex items-center justify-center overflow-x-hidden"
        style={{
          backgroundImage: `url(${cup})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center justify-center gap-5 ml-40">
          <div className="flex flex-col items-center justify-center gap-5">
            <EPL />
            <p className="font-bold Rubik text-xl text-white">20</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <C1 />
            <p className="font-bold Rubik text-xl text-white">6</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <FA />
            <p className="font-bold Rubik text-xl text-white">8</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 mt-10">
            <C2 />
            <p className="font-bold Rubik text-xl text-white">3</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <Carabao />
            <p className="font-bold Rubik text-xl text-white">10</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <Super />
            <p className="font-bold Rubik text-xl text-white">4</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 mt-6">
            <ClubWC />
            <p className="font-bold Rubik text-xl text-white mr-17">1</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
