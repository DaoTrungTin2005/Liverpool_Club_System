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
        <div className="flex flex-col">
          <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Matches */}
            <div className="text-center mb-12">
              <h2 className="text-6xl font-bold mb-8">MATCHES</h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-30">
                <StatBox label="TOTAL" value={stats.matches.total} big />
                <div className=" flex gap-10">
                  <StatBox label="CHAMPION LEAGUE" value={stats.matches.ucl} />
                  <StatBox label="PREMIER LEAGUE" value={stats.matches.epl} />
                  <StatBox label="CARABAO CUP" value={stats.matches.carabao} />
                  <StatBox label="FA CUP" value={stats.matches.fa} />
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="text-center mb-12">
              <h2 className="text-6xl font-bold mb-8">GOALS</h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-30">
                <StatBox label="TOTAL" value={stats.goals.total} big />
                <div className=" flex gap-10">
                  <StatBox label="CHAMPION LEAGUE" value={stats.goals.ucl} />
                  <StatBox label="PREMIER LEAGUE" value={stats.goals.epl} />
                  <StatBox label="CARABAO CUP" value={stats.goals.carabao} />
                  <StatBox label="FA CUP" value={stats.goals.fa} />
                </div>
              </div>
            </div>

            {/* Assists */}
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-8">ASSISTS</h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-30">
                <StatBox label="TOTAL" value={stats.assists.total} big />
                <div className=" flex gap-10">
                  <StatBox label="CHAMPION LEAGUE" value={stats.assists.ucl} />
                  <StatBox label="PREMIER LEAGUE" value={stats.assists.epl} />
                  <StatBox label="CARABAO CUP" value={stats.assists.carabao} />
                  <StatBox label="FA CUP" value={stats.assists.fa} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 bg-gradient-to-t from-red-950 via-red-900 to-transparent py-10">
            <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <img src={C1} className="h-20 w-20"></img>
              <img src={EPL} className="h-24 w-24"></img>
              <img src={CARABAO} className="h-15 w-15 "></img>
              <img src={FA} className="h-20 w-15"></img>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
