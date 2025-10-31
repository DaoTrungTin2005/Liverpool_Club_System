import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01.jsx";
import LinkGoPage from "../pageAdminUser//componentAdminUser/LinkGoPage.jsx";
import Button from "../pageAdminUser//componentAdminUser/Button.jsx";
import "../pageRegister/Register.css";
import { SvgBall } from "../assets/svg/SvgAdmin.jsx";
import { SvgGoal } from "../assets/svg/SvgAdmin.jsx";
import { SvgLocation } from "../assets/svg/SvgAdmin.jsx";
import { SvgNationality } from "../assets/svg/SvgAdmin.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function AdminMyClubView() {
  const [showStats, setShowStats] = useState(false);
  const hiddenShow = () => {
    setShowStats((prev) => !prev);
  };

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        {/* ==== SIDEBAR ==== */}
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} />
        </div>

        {/* ==== MAIN CONTENT ==== */}
        <div className="w-[80%] bg-white mr-10 ml-10 mt-15 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-5">
          <p className="text-2xl text-[#2B3674] font-bold">View Player</p>

          <div className="flex flex-col items-center justify-center w-[40%]">
            <div className="flex flex-col gap-2 text-[#2B3674]">
              {/* ==== Thông tin cơ bản ==== */}
              <label className="flex flex-col w-120 mx-auto">
                PlayerName: <p className="m-auto truncate">Tin Dao</p>
              </label>

              <div className="w-120 mx-auto">
                <span className="text-sm font-medium text-[#2B3674]">Bio</span>

                <div className="group mt-1 relative cursor-pointer">
                  {/* Phần hiển thị rút gọn */}
                  <div className="line-clamp-2 text-sm text-[#2B3674] whitespace-pre-wrap">
                    Bio: Lorem ipsum dolor, sit amet consectetur adipisicing
                    elit. Quis, culpa eaque? Exercitationem, iusto numquam vel
                    perferendis in eveniet sed at vero neque ullam saepe nisi
                    itaque harum qui laboriosam laborum. Lorem ipsum dolor sit
                    amet, consectetur adipisicing elit. Velit quod accusamus
                    nemo animi facere ad...
                  </div>

                  {/* Phần full + cuộn khi hover */}
                  <div className="absolute hidden group-hover:block bg-white border border-gray-300 rounded-md shadow-lg p-3 max-h-48 overflow-y-auto z-10 w-full text-sm text-[#2B3674] whitespace-pre-wrap">
                    Bio: Lorem ipsum dolor, sit amet consectetur adipisicing
                    elit. Quis, culpa eaque? Exercitationem, iusto numquam vel
                    perferendis in eveniet sed at vero neque ullam saepe nisi
                    itaque harum qui laboriosam laborum. Lorem ipsum dolor sit
                    amet, consectetur adipisicing elit. Velit quod accusamus
                    nemo animi facere ad labore totam quis, ipsum eius commodi
                    impedit cum neque, dignissimos iste laboriosam iusto
                    dolorem. Fugit.
                  </div>
                </div>
              </div>

              <div className="flex gap-5 items-center">
                <label className="flex w-26">
                  Number:<p className="m-auto">11</p>
                </label>

                <label className="flex w-26">
                  Position:<p className="m-auto">Attack</p>
                </label>

                {/* === Background Upload === */}
                <label className="w-26  flex flex-col items-center text-sm text-[#2B3674]">
                  Background
                  <img
                    src=""
                    className="w-24 h-24 border-1 rounded-md cursor-pointer flex items-center justify-center overflow-hidden "
                  ></img>
                </label>

                {/* === Bio Image Upload === */}
                <label className="w-26  flex flex-col items-center text-sm text-[#2B3674]">
                  Bio Image
                  <img
                    src=""
                    className="w-24 h-24 border-1 rounded-md cursor-pointer flex items-center justify-center overflow-hidden "
                  ></img>
                </label>
              </div>

              {/* ==== Thông tin khác ==== */}
              <div className="flex flex-col">
                <label>Information</label>
                <div className="flex w-120 border-1 h-14 rounded-md">
                  <label className="w-30 text-sm flex flex-col items-center justify-center">
                    Date of birth
                  </label>
                  <div className="w-[1px] h-13.75 border-1"></div>
                  <label
                    className="w-30 text-sm cursor-pointer peer flex items-center justify-center gap-2"
                    htmlFor="toggleLocation"
                  >
                    Location
                    <SvgLocation />
                  </label>
                  <div className="w-[1px] h-13.75 border-1"></div>
                  <label
                    className="w-30 text-sm cursor-pointer flex items-center justify-center gap-2"
                    htmlFor="toggleNationality"
                  >
                    Nationality
                    <SvgNationality />
                  </label>
                  <div className="w-[1px] h-13.75 border-1"></div>
                  <label className="w-30 text-sm flex flex-col items-center justify-center">
                    Joined club
                  </label>
                </div>
              </div>

              {/* ==== Stats popup ==== */}
              <div
                className="border-1 flex items-center justify-center cursor-pointer rounded-md"
                onClick={hiddenShow}
              >
                Stats
              </div>

              {showStats && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white shadow-2xl w-200 h-100 m-auto mr-50 ">
                  <div className="flex flex-col w-120 ">
                    <p>Stats</p>
                    <div className="flex rounded-md border-1 h-10">
                      <span
                        type="button"
                        className="w-1/3 flex items-center justify-center gap-1.5"
                      >
                        <SvgBall />
                        Match
                      </span>
                      <div className="w-[1px] h-10 border-1"></div>
                      <span
                        type="button"
                        className="w-1/3 flex items-center justify-center gap-1.5"
                      >
                        <SvgGoal />
                        Goal
                      </span>
                      <div className="w-[1px] h-10 border-1"></div>
                      <span
                        type="button"
                        className="w-1/3 flex items-center justify-center gap-1.5"
                      >
                        <SvgBall />
                        Assists
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-1 p-2 rounded-md bg-gray-50 text-sm w-120 mt-2">
                    <span className="font-medium"></span>
                    <span className="text-gray-600">
                      Match • Goal • Assists
                    </span>
                  </div>

                  {/* Dòng nhập */}
                  <div
                    className="border-2 cursor-pointer my-10 mx-auto w-25 h-8 flex items-center justify-center bg-green-500 text-white border-1 rounded-md"
                    onClick={hiddenShow}
                  >
                    <p className="m-auto">Enter</p>
                  </div>
                </div>
              )}
            </div>
            <Link to={"/admin/club"}>
              {" "}
              <Button text={"Back"} className="" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
