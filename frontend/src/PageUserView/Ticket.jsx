import "../output.css";
import Header from "../componentUserView/Header";
import Liverpool_Banner from "../assets/img/Liverpool_Banner.png";
import Carabaocup from "../assets/img/Carabaocup.png";
import Premiercup from "../assets/img/Premiercup.png";
import C1 from "../assets/img/C1.png";
import CupFA from "../assets/img/CupFA.png";
import TotvsLiver from "../assets/img/TotvsLiv.png";
import Stadium from "../assets/img/Stadium.png";
import ViewStadium from "../assets/img/ViewSadium.png";
import Cancel from "../assets/img/Cancel.png";
import { useState } from "react";
import Button from "../pageAdminUser/componentAdminUser/Button";

export default function Ticket() {
  const [showStatsIn, setShowStatsIn] = useState(false);
  const hiddenShowIn = () => {
    setShowStatsIn((prev) => !prev);
  };
  const [showStats, setShowStats] = useState(false);
  const hiddenShow = () => {
    setShowStats((prev) => !prev);
  };
  return (
    <div className="flex flex-col">
      <Header />
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src={Liverpool_Banner}
          alt="Liverpool FC - Anfield"
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
            OUR STADIUM
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-center pt-28 gap-12 max-sm:gap-5 max-sm:pt-15 h-full"></div>
      <div className="bg-white w-full h-full m-auto flex flex-col pt-20 pb-50 items-center">
        <div className="flex flex-col items-center justify-center gap-10">
          <p className="text-black text-4xl text-center">CHAMPION LEAGUE</p>
          <div className="w-200 flex items-center justify-between gap-15 text-4xl bg-[#EEEEEE]">
            <img src={C1} alt="" className="w-15 h-15" />
            <p className="w-70">Liverpool</p>
            <img src={Carabaocup} alt="" className="w-15 h-15" />
            <p className="w-70">Real Madrid</p>
            <img src={CupFA} alt="" className="w-15 h-15" />
          </div>
          <div className="flex text-2xl gap-10 items-center justify-center">
            <p>28TH MAY 2026</p>
            <div className="w-[1px] h-6 border border-1 border-black"></div>
            <p>20:00 PM</p>
            <div className="w-[1px] h-6 border border-1 border-black"></div>
            <p>ANFIELD STADIUM</p>
          </div>
        </div>
        <div className="w-[80%] h-[1px] border border-1 border-black my-30"></div>
        <p className="text-bold font-black text-6xl mb-50">ANFIELD STADIUM</p>
        <div className="w-full bg-white rounded-3xl flex items-center flex-col justify-center gap-3 relative">
          <div className="flex flex-col items-center justify-center -mb-10">
            <p className="flex items-center justify-center">
              SIR KENNY DALGLISH STAND
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="bg-[#24BCC4] w-10 h-10">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-10 h-10">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-10 h-10">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-10 h-10">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-10 h-10">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-10 h-10">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-10 h-10">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-10 h-10">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-10 h-10">
                  <p></p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-[#C4A924] w-10 h-5">
                  <p></p>
                </div>
                <div className="bg-[#C4A924] w-10 h-5">
                  <p></p>
                </div>
                <div className="bg-[#C4A924] w-10 h-5">
                  <p></p>
                </div>
                <div className="bg-[#C4A924] w-10 h-5">
                  <p></p>
                </div>
                <div className="bg-[#C4A924] w-10 h-5">
                  <p></p>
                </div>
                <div className="bg-[#C4A924] w-10 h-5">
                  <p></p>
                </div>
                <div className="bg-[#C4A924] w-10 h-5">
                  <p></p>
                </div>
                <div className="bg-[#C4A924] w-10 h-5">
                  <p></p>
                </div>
                <div className="bg-[#C4A924] w-10 h-5">
                  <p></p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex relative w-22 h-15">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="88"
                    height="55"
                    viewBox="0 0 121 76"
                    fill="none"
                  >
                    <path
                      d="M58.4844 42.0859H58.4824V47.623H120.341V42.7139H120.342V75.3115H0V0H58.4844V42.0859Z"
                      fill="#B722A8"
                    />
                  </svg>
                  <div className="bg-[#C4A924] w-10 h-5 absolute right-0 top-0">
                    <p></p>
                  </div>
                </div>
                <div className="flex flex-col gap-3.75">
                  <div className="flex gap-2">
                    <div className="bg-[#C4A924] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#C4A924] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#C4A924] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#C4A924] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#C4A924] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#C4A924] w-10 h-5">
                      <p></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-[#B722A8] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#B722A8] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#B722A8] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#B722A8] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#B722A8] w-10 h-5">
                      <p></p>
                    </div>
                    <div className="bg-[#B722A8] w-10 h-5">
                      <p></p>
                    </div>
                  </div>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="55"
                    viewBox="0 0 57 76"
                    fill="none"
                    className="pl-0"
                  >
                    <path
                      d="M56.2344 31.792L0 75.5283V0H56.2344V31.792Z"
                      fill="#B722A8"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <p className="flex items-center justify-center">LONGSIDE TIER</p>
          </div>
          <div className="flex gap-5 items-center justify-center">
            <div className="flex items-center justify-center -mr-20 mt-10">
              <div className="flex items-center justify-center rotate-270 -mr-14">
                <p className="">ANFIELD ROAD STAND</p>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="24"
                    viewBox="0 0 57 35"
                  >
                    <path
                      d="M56.2344 34.333H0V17.3994L15.5801 0H56.2344V34.333Z"
                      fill="#4B59AC"
                    />
                  </svg>
                  <div className="bg-[#4B59AC] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#4B59AC] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#4B59AC] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#4B59AC] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#4B59AC] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#4B59AC] w-10 h-6">
                    <p></p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="24"
                    viewBox="0 0 57 35"
                    fill="none"
                  >
                    <path
                      d="M56.2344 34.333H15.7119L0 21.1504V0H56.2344V34.333Z"
                      fill="#4B59AC"
                    />
                  </svg>
                </div>
                <div className="flex gap-2 flex-col">
                  <div className="bg-[#C4A924] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-10 h-6">
                    <p></p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="bg-[#FF53DD] w-4 h-6">
                      <p></p>
                    </div>
                    <div className="bg-[#FF53DD] w-4 h-6">
                      <p></p>
                    </div>
                  </div>
                  <div className="bg-[#FF53DD] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#FF53DD] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#5CBF53] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#5CBF53] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#5CBF53] w-10 h-6">
                    <p></p>
                  </div>
                  <div className="bg-[#5CBF53] w-10 h-6">
                    <p></p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="24"
                    viewBox="0 0 57 35"
                    fill=""
                  >
                    <path
                      d="M56.2344 10.7422L36.7471 34.333H0V0H56.2344V10.7422Z"
                      fill="#5CBF53"
                    />
                  </svg>
                </div>
              </div>
              <p className="rotate-270 h-10 my-0 w-32 flex items-center justify-center -ml-12">
                SHORTSIDE TIER
              </p>
            </div>
            <img
              src={Stadium}
              alt="Stadium"
              className="w-80 h-60 ml-20 -mr-12"
            />
            <div className="flex items-center ml-10">
              <p className="rotate-90 h-12 w-30 my-0 -mr-7">SHORTSIDE TIER</p>
              <div className="flex">
                <div className="flex flex-col gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="49"
                    height="42"
                    viewBox="0 0 56 61"
                    fill="none"
                    className="pr-2"
                  >
                    <path
                      d="M32.5037 -7.9503e-05L3.33547e-06 60.5644L55.96 60.5879L55.9862 0.00976924L32.5037 -7.9503e-05Z"
                      fill="#B00E1E"
                    />
                  </svg>
                  <div className="bg-[#B00E1E] w-11 h-9">
                    <p></p>
                  </div>
                  <div className="bg-[#B00E1E] w-11 h-9">
                    <p></p>
                  </div>
                  <div className="bg-[#B00E1E] w-11 h-9">
                    <p></p>
                  </div>
                  <div className="bg-[#B00E1E] w-11 h-9">
                    <p></p>
                  </div>
                  <div className="bg-[#B00E1E] w-11 h-9">
                    <p></p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="49"
                    height="42"
                    viewBox="0 0 58 48"
                    fill="none"
                    className="pr-2"
                  >
                    <path
                      d="M0.000248667 19.6033L56.8763 47.0787L57.0635 0.220703L0.078553 -2.60676e-05L0.000248667 19.6033Z"
                      fill="#B00E1E"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="69"
                    height="42"
                    viewBox="0 0 99 63"
                    fill="none"
                  >
                    <path
                      d="M98.9727 12.085V62.0215H0V0H79.0225L98.9727 12.085Z"
                      fill="#B00E1E"
                    />
                  </svg>
                  <div className="bg-[#B00E1E] w-20 h-9">
                    <p></p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="bg-[#B00E1E] w-12 h-9">
                        <p></p>
                      </div>
                      <div className="bg-[#B00E1E] w-12 h-9">
                        <p></p>
                      </div>
                      <div className="bg-[#B00E1E] w-12 h-9">
                        <p></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="bg-[#B00E1E] w-12 h-9">
                        <p></p>
                      </div>
                      <div className="bg-[#B00E1E] w-12 h-9">
                        <p></p>
                      </div>
                      <div className="bg-[#B00E1E] w-12 h-9">
                        <p></p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#B00E1E] w-20 h-9">
                    <p></p>
                  </div>
                  <div className="bg-[#B00E1E] w-16 h-9">
                    <p></p>
                  </div>
                </div>
              </div>
              <p className="rotate-90 h-12 w-40 my-0 -ml-15 flex items-center justify-center">
                KOP STAND
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center -mt-10">
            <p>LONGSIDE TIER</p>
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33"
                height="80"
                viewBox="0 0 47 82"
                fill="none"
                className="pt-4"
              >
                <path
                  d="M46.1123 81.9561H0V28.0557L0.275391 28.3828L34.9951 0H46.1123V81.9561Z"
                  fill="#B722A8"
                />
              </svg>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="bg-[#B722A8] w-8 h-15">
                    <p></p>
                  </div>
                  <div className="bg-[#B722A8] w-8 h-15">
                    <p></p>
                  </div>
                  <div className="bg-[#B722A8] w-8 h-15">
                    <p></p>
                  </div>
                  <div className="bg-[#B722A8] w-8 h-15">
                    <p></p>
                  </div>
                  <div className="bg-[#B722A8] w-8 h-15">
                    <p></p>
                  </div>
                  <div className="bg-[#B722A8] w-8 h-15">
                    <p></p>
                  </div>
                  <div className="bg-[#B722A8] w-8 h-15">
                    <p></p>
                  </div>
                  <div className="bg-[#B722A8] w-8 h-15">
                    <p></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-[#C4A924] w-8 h-2">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-8 h-2">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-8 h-2">
                    <p></p>
                  </div>
                  <div className="bg-[#A4A4A4] w-8 h-2">
                    <p></p>
                  </div>
                  <div className="bg-[#A4A4A4] w-8 h-2">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-8 h-2">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-8 h-2">
                    <p></p>
                  </div>
                  <div className="bg-[#C4A924] w-8 h-2">
                    <p></p>
                  </div>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33"
                height="82"
                viewBox="0 0 47 76"
                fill="none"
                className="pt-4"
              >
                <path
                  d="M46.1123 25.1436V75.3115H0V0H16.1162L46.1123 25.1436Z"
                  fill="#B722A8"
                />
              </svg>
            </div>
            <div className="flex gap-2">
              <div className="bg-[#C4A924] h-5 w-12">
                <p></p>
              </div>
              <div className="bg-[#C4A924] h-5 w-6">
                <p></p>
              </div>
              <div className="bg-[#C4A924] h-5 w-12">
                <p></p>
              </div>
              <div className="bg-[#C4A924] h-5 w-6">
                <p></p>
              </div>
              <div className="bg-[#C4A924] h-5 w-12">
                <p></p>
              </div>
              <div className="bg-[#C4A924] h-5 w-6">
                <p></p>
              </div>
              <div className="bg-[#C4A924] h-5 w-12">
                <p></p>
              </div>
              <div className="bg-[#C4A924] h-5 w-6">
                <p></p>
              </div>
              <div className="bg-[#C4A924] h-5 w-12">
                <p></p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="59"
                height="60"
                viewBox="0 0 47 87"
                className="pl-5"
                fill="none"
                onClick={hiddenShow}
              >
                <path
                  d="M46.1123 0V86.3877H29.9639L0.275391 59.4551L0 59.8184V0H46.1123Z"
                  fill="#24BCC4"
                />
              </svg>
              <div className="flex gap-2">
                <div className="bg-[#24BCC4] w-8 h-17">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-8 h-17">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-8 h-17">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-8 h-17">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-8 h-17">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-8 h-17">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-8 h-17">
                  <p></p>
                </div>
                <div className="bg-[#24BCC4] w-8 h-17">
                  <p></p>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="59"
                height="58"
                viewBox="0 0 60 87"
                className="pr-5 cursor-pointer"
                fill="none"
                onClick={hiddenShowIn}
              >
                <path
                  d="M59.6084 59.8184L59.252 59.4551L20.874 86.3877H0V0H59.6084V59.8184Z"
                  fill="#24BCC4"
                />
              </svg>
            </div>
            <p>MAIN STAND</p>
          </div>
          {showStatsIn && (
            <div className="w-200 h-140 bg-[#CECCCC] shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-3 absolute z-10 inset-0 m-auto">
              <img
                src={Cancel}
                className="z-20 inset-0 absolute w-10 h-10"
                onClick={hiddenShowIn}
              />
              <img src={ViewStadium} alt="View" className="w-full h-80 " />
              <div className="flex flex-col items-center justify-center">
                <p>$176.89 </p>
                <p>CE1 - LONGSIDE LOWER TIER</p>
                <p>Available : 340 tickets</p>
              </div>
              <div className="flex gap-20">
                <div className="flex">
                  <div className="bg-black text-white w-6 h-6 flex items-center justify-center">
                    <p>+</p>
                  </div>
                  <div className="bg-white text-black w-12 flex items-center justify-center">
                    12
                  </div>
                  <div className="bg-black text-white w-6 h-6 flex items-center justify-center">
                    -
                  </div>
                </div>
                <p>$937.89 </p>
              </div>
              <Button text="Buy Now"></Button>
            </div>
          )}
          {showStats && (
            <div className="w-70 h-40 bg-[#CECCCC] shadow-2xl rounded-3xl flex items-center flex-col justify-center absolute z-50 inset-0 m-auto">
              <div className="flex items-center justify-center mt-20">
                <img src={Cancel} className=" w-10 h-10" />
                <p>SEAT ISN’T AVAILABLE</p>
              </div>
              <Button text="Back" onClick={hiddenShow} className="mb-20" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-8 gap-10 m-30 text-xs border border-1 p-10">
          <div className="bg-[#B722A8] w-10 h-10"></div>
          <p className="my-auto">Longside Lower Tier</p>
          <div className="bg-[#C4A924] w-10 h-10"></div>
          <p className="my-auto">VIP or Executive Box</p>
          <div className="bg-[#B00E1E] w-10 h-10"></div>
          <p className="my-auto">The KOP</p>
          <div className="bg-[#24BCC4] w-10 h-10"></div>
          <p className="my-auto">Longside Upper Tier</p>
          <div className="bg-[#4B59AC] w-10 h-10"></div>
          <p className="my-auto">Shortside Upper Tier</p>
          <div className="bg-[#5CBF53] w-10 h-10"></div>
          <p className="my-auto">Away</p>
          <div className="bg-[#FF53DD] w-10 h-10"></div>
          <p className="my-auto">Shortside Lower Tier</p>
        </div>
      </div>
    </div>
  );
}
