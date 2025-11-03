import "../output.css";
import { useState } from "react";
import C1 from "../assets/img/CHAMPION LEAGUE.png";
import EPL from "../assets/img/EPL.png";
import FA from "../assets/img/FA.png";
import CARABAO from "../assets/img/CARABAO.png";
import StatBox from "./StatBox";

export default function BodyPlayer({
  fullBio,
  dateOfBirth,
  location,
  nationality,
  joinedClub,
  stats = {
    matches: { total: 45, ucl: 5, epl: 35, carabao: 9, fa: 4 },
    goals: { total: 10, ucl: 2, epl: 31, carabao: 1, fa: 4 },
    assists: { total: 10, ucl: 2, epl: 3, carabao: 1, fa: 4 },
  },
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isExpanded, setIsExpanded] = useState(false);

  const shortBio = fullBio.split("\n").slice(0, 3).join("\n").trim() + "...";

  return (
    <div className=" bg-black text-white font-sans">
      {/* Tabs */}
      <div className="flex justify-center gap-8 pt-8 pb-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-2 text-sm font-bold tracking-wider rounded-full transition ${
            activeTab === "profile"
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          PROFILE
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-6 py-2 text-sm font-bold tracking-wider rounded-full transition ${
            activeTab === "stats"
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          STATS
        </button>
      </div>

      {/* === PROFILE TAB === */}
      {activeTab === "profile" && (
        <>
          {/* Main Content - Bio & Info */}
          <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-30">
            {/* Bio Column - Có Read More */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Bio</h2>
              <div className="text-gray-300 leading-relaxed text-sm space-y-3">
                <p className="whitespace-pre-line">
                  {isExpanded ? fullBio : shortBio}
                </p>
              </div>

              {/* Nút Read more / Read less */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-6 px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded transition flex items-center gap-2"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            </div>

            {/* Info Column */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Info</h2>
              <div className="space-y-5 text-sm">
                <div>
                  <span className="text-gray-500 block">Date of birth</span>
                  <p className="font-semibold text-red-500">{dateOfBirth}</p>
                </div>
                <div>
                  <span className="text-gray-500 block">Location</span>
                  <p className="font-semibold text-red-500">{location}</p>
                </div>
                <div>
                  <span className="text-gray-500 block">Nationality</span>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-red-500">{nationality}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 block">Joined club</span>
                  <p className="font-semibold text-red-500">{joinedClub}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Logos */}
          <div className="mt-16 bg-gradient-to-t from-red-950 via-red-900 to-transparent py-10">
            <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <img src={C1} className="h-20 w-20"></img>
              <img src={EPL} className="h-24 w-24"></img>
              <img src={CARABAO} className="h-15 w-15 "></img>
              <img src={FA} className="h-20 w-15"></img>
            </div>
          </div>
        </>
      )}

      {/* === STATS TAB === */}
      {activeTab === "stats" && (
        <div className="flex flex-col justify-center items-center bg-black text-white py-20">
          {/* ========== MATCHES ========== */}
          <div className="text-center mb-16 w-full">
            <h2 className="text-6xl font-bold mb-8 tracking-wide text-white">
              MATCHES
            </h2>
            <div className="w-full max-w-5xl mx-auto border-t border-b border-gray-500">
              <div className="grid grid-cols-5 text-center divide-x divide-gray-600">
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    TOTAL
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.matches.total}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    CHAMPION LEAGUE
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.matches.ucl}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    PREMIER LEAGUE
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.matches.epl}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    CARABAO CUP
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.matches.carabao}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    FA CUP
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.matches.fa}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== GOALS ========== */}
          <div className="text-center mb-16 w-full">
            <h2 className="text-6xl font-bold mb-8 tracking-wide text-white">
              GOALS
            </h2>
            <div className="w-full max-w-5xl mx-auto border-t border-b border-gray-500">
              <div className="grid grid-cols-5 text-center divide-x divide-gray-600">
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    TOTAL
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.goals.total}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    CHAMPION LEAGUE
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.goals.ucl}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    PREMIER LEAGUE
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.goals.epl}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    CARABAO CUP
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.goals.carabao}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    FA CUP
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.goals.fa}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== ASSISTS ========== */}
          <div className="text-center mb-16 w-full">
            <h2 className="text-6xl font-bold mb-8 tracking-wide text-white">
              ASSISTS
            </h2>
            <div className="w-full max-w-5xl mx-auto border-t border-b border-gray-500">
              <div className="grid grid-cols-5 text-center divide-x divide-gray-600">
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    TOTAL
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.assists.total}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    CHAMPION LEAGUE
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.assists.ucl}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    PREMIER LEAGUE
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.assists.epl}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    CARABAO CUP
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.assists.carabao}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    FA CUP
                  </p>
                  <p className="text-5xl font-bold text-red-600 drop-shadow-[0_0_8px_#ff0000] mt-2">
                    {stats.assists.fa}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-t from-red-950 via-red-900 to-transparent py-10">
            <div className="max-w-6xl mx-auto px-2 flex flex-wrap justify-center items-center gap-8 max-sm:gap-0">
              <img src={C1} className="h-20 w-20"></img>
              <img src={EPL} className="h-20 w-20"></img>
              <img src={CARABAO} className="h-20 w-10 "></img>
              <img src={FA} className="h-20 w-15"></img>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
