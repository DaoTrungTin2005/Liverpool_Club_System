import { useState } from "react";
import "../pageRegister/Register.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Stadium from "../assets/img/Stadium.png";

export default function AdminMatchView() {
  const [showStats, setShowStats] = useState(false);
  const hiddenShow = () => {
    setShowStats((prev) => !prev);
  };

  const [showStatsIn, setShowStatsIn] = useState(false);
  const hiddenShowIn = () => {
    setShowStatsIn((prev) => !prev);
  };

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} />
        </div>

        <div className="w-[80%] bg-white mr-10 ml-10 mt-5 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-3 ">
          <p className="text-2xl text-[#2B3674] font-bold">Update Match</p>

          <div className="flex flex-col items-center gap-3 text-[#2B3674] text-sm w-[30%]">
            {/* Tournament - Select Dropdown */}
            <label className="flex flex-col w-full items-center">
              Tournament:<p> EPL</p>
            </label>

            {/* Home */}
            <label className="flex flex-col w-full relative items-center">
              Home : <p>Liver</p>
            </label>

            {/* Away */}
            <label className="flex flex-col w-full relative items-center">
              Away: <p>ManCi</p>
            </label>

            {/* Logo */}
            <div className="w-full flex flex-col">
              <p className="mb-2">Logo</p>
              <div className="flex gap-5 items-center justify-between flex-col">
                {/* Home Logo */}
                <div className="flex gap-2">
                  <div className="flex flex-col w-50">
                    <img src={Stadium} className="flex flex-col w-full"></img>
                    <p>Home</p>
                  </div>
                  {/* Away Logo */}
                  <div className="flex flex-col w-50">
                    <img src={Stadium} className="flex flex-col w-full"></img>
                    <p>Away</p>
                  </div>
                </div>
                {/* Date and Location */}
                <div className="flex gap-5 w-full justify-between">
                  <label className="flex flex-col w-[48%] relative">Date</label>

                  <label className="flex flex-col w-[48%] relative">
                    Location
                  </label>
                </div>

                {/* Ticket Settings */}
                <button
                  type="button"
                  className="w-full border rounded-[10px] h-12 text-[#2B3674] hover:bg-gray-50 mt-5"
                  onClick={hiddenShow}
                >
                  Ticket Settings
                </button>
                {showStats && (
                  <div className="w-[70%] bg-white mr-10 ml-95 mt-5 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-3 absolute z-100 inset-0">
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
                      <p className="flex items-center justify-center">
                        LONGSIDE TIER
                      </p>
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
                        <p className="rotate-90 h-12 w-30 my-0 -mr-7">
                          SHORTSIDE TIER
                        </p>
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
                          className="pr-5"
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
                    <Button
                      text="Back"
                      className="absolute top-0 left-0"
                      onClick={hiddenShow}
                    ></Button>
                    {showStatsIn && (
                      <div className="w-100 h-50 bg-amber-50 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-3 absolute z-100 inset-0 m-auto">
                        <div className="flex gap-20">
                          <label className="flex flex-col justify-center w-30 gap-5 relative">
                            Quantity:
                          </label>
                          <label className="flex flex-col justify-center w-30 gap-5 relative">
                            Price(VND):
                          </label>
                        </div>
                        <Button text="Ok" onClick={hiddenShowIn}></Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
