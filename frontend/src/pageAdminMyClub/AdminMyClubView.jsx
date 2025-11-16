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
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import api from "../Api/apitoken.js";
import "../output.css";
import { logout } from "../Api/logout.js";
export default function AdminMyClubView() {
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playerData, setPlayerData] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  const playerId = state?.playerId;
  const player = state?.player;

  // 🟩 Toggle popup stats
  const hiddenShow = () => {
    setShowStats((prev) => !prev);
  };

  // 🟦 Gọi API lấy dữ liệu cầu thủ
  useEffect(() => {
    if (!playerId) {
      alert("❌ Không tìm thấy ID cầu thủ.");
      navigate("/admin/club");
      return;
    }

    const fetchPlayer = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/players/${playerId}`);

        if (res.data?.status === "success") {
          setPlayerData(res.data.data);
        } else {
          alert("⚠️ Không thể tải dữ liệu cầu thủ!");
          navigate("/admin/club");
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin cầu thủ:", err);
        alert("⚠️ Lỗi khi tải thông tin cầu thủ!");
        navigate("/admin/club");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId, navigate]);
  const [bioPreview, setBioPreview] = useState(null);
  const [bioName, setBioName] = useState("");
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [backgroundName, setBackgroundName] = useState("");
  const [completedLeagues, setCompletedLeagues] = useState([]);
  const [currentInput, setCurrentInput] = useState({
    id: Date.now(),
    tournament: "",
    matches: "",
    goals: "",
    assists: "",
  });

  // 2. Khi load player → đổ stats cũ vào completedLeagues
  useEffect(() => {
    if (playerData?.stats) {
      const formatted = playerData.stats.map((s, index) => ({
        id: Date.now() + index,
        tournament: s.tournament || "",
        matches: s.matches?.toString() || "0",
        goals: s.goals?.toString() || "0",
        assists: s.assists?.toString() || "0",
      }));
      setCompletedLeagues(formatted);
    }
  }, [playerData]);

  useEffect(() => {
    if (playerData) {
      if (playerData.bioImage) {
        setBioPreview(playerData.bioImage);

        const parts = playerData.bioImage.split("/");
        setBioName(parts[parts.length - 1]);

        // ✅ Xóa cảnh báo lỗi nếu trước đó báo đỏ
      }
    }
  }, [playerData]);
  useEffect(() => {
    if (playerData) {
      if (playerData.backgroundImage) {
        setBackgroundPreview(playerData.backgroundImage);
        const parts = playerData.backgroundImage.split("/");
        setBackgroundName(parts[parts.length - 1]); // ✅ Gán tên file
      }
    }
  }, [playerData]);

  // 🟨 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-[#2B3674]">
        Đang tải dữ liệu cầu thủ...
      </div>
    );
  }

  // 🟥 Nếu không có dữ liệu
  if (!playerData) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-red-500">
        Không tìm thấy dữ liệu cầu thủ.
      </div>
    );
  }

  // ✅ Render thông tin cầu thủ
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        {/* ==== SIDEBAR ==== */}
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} onClick={logout} />
        </div>

        {/* ==== MAIN CONTENT ==== */}
        <div className="w-[80%] bg-white mr-10 ml-10 mt-15 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-5">
          <p className="text-2xl text-[#2B3674] font-bold">View Player</p>

          <div className="flex flex-col items-center justify-center w-[40%]">
            <div className="flex flex-col gap-2 text-[#2B3674]">
              {/* ==== Thông tin cơ bản ==== */}
              <label className="flex flex-col w-120 mx-auto">
                PlayerName:{" "}
                <p className="m-auto truncate">{player.playerName}</p>
              </label>

              <div className="w-120 mx-auto">
                <span className="text-sm font-medium text-[#2B3674]">Bio</span>

                <div className="group mt-1 relative cursor-pointer">
                  {/* Phần hiển thị rút gọn */}
                  <div className="line-clamp-2 text-sm text-[#2B3674] whitespace-pre-wrap">
                    {player.bio}
                  </div>

                  {/* Phần full + cuộn khi hover */}
                  <div className="absolute hidden group-hover:block bg-white border border-gray-300 rounded-md shadow-lg p-3 max-h-48 overflow-y-auto z-10 w-full text-sm text-[#2B3674] whitespace-pre-wrap">
                    Bio: {player.bio}
                  </div>
                </div>
              </div>

              <div className="flex gap-5 items-center">
                <label className="flex w-26 flex-col items-center">
                  Number:<p className="m-auto">{player.shirtNumber}</p>
                </label>

                <label className="flex flex-col items-center w-26">
                  Position:
                  <p className="m-auto ">{player.position}</p>
                </label>

                {/* === Background Upload === */}
                <img
                  src={playerData.backgroundImage}
                  alt="Background"
                  className="w-24 h-24 border rounded-md cursor-pointer flex items-center justify-center overflow-hidden"
                />

                {/* === Bio Image Upload === */}
                <img
                  src={playerData.bioImage}
                  alt="Bio"
                  className="w-24 h-24 border rounded-md cursor-pointer flex items-center justify-center overflow-hidden"
                />
              </div>

              {/* ==== Thông tin khác ==== */}
              <div className="flex flex-col">
                <label>Information</label>
                <div className="flex w-120 border-1 h-14 rounded-md">
                  <label className="w-30 text-sm flex flex-col items-center justify-center">
                    Birth: {player.dateOfBirth}
                  </label>
                  <div className="w-[1px] h-13.75 border-1"></div>
                  <label
                    className="w-30 text-sm cursor-pointer peer flex items-center justify-center gap-2"
                    htmlFor="toggleLocation"
                  >
                    {player.location}
                    <SvgLocation />
                  </label>
                  <div className="w-[1px] h-13.75 border-1"></div>
                  <label
                    className="w-30 text-sm cursor-pointer flex items-center justify-center gap-2"
                    htmlFor="toggleNationality"
                  >
                    {player.nationality}
                    <SvgNationality />
                  </label>
                  <div className="w-[1px] h-13.75 border-1"></div>
                  <label className="w-30 text-sm flex flex-col items-center justify-center">
                    Join: {player.joinedClub}
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

                  {completedLeagues.map((stat) => (
                    <div
                      key={stat.id}
                      className="flex items-center gap-2 border-1 p-2 rounded-md bg-gray-50 text-sm w-120 mt-2"
                    >
                      {/* Tên giải đấu */}
                      <span className="font-medium">{stat.tournament}</span>

                      {/* Số liệu */}
                      <span className="text-gray-600">
                        {stat.matches || 0} Match • {stat.goals || 0} Goal •{" "}
                        {stat.assists || 0} Assists
                      </span>
                    </div>
                  ))}

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
