import "../output.css";
import Header from "../componentUserView/Header";
import Liverpool_Banner from "../assets/img/Liverpool_Banner.png";
import Stadium from "../assets/img/Stadium.png";
import ViewStadium from "../assets/img/ViewSadium.png";
import Cancel from "../assets/img/Cancel.png";
import api from "../Api/apitoken.js";
import { useState } from "react";
import Button from "../pageAdminUser/componentAdminUser/Button";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../componentUserView/Footer.jsx";
export default function Ticket() {
  const [popupData, setPopupData] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  // Lấy matchId từ state
  const matchId = location.state?.matchId;

  const [showStatsIn, setShowStatsIn] = useState(false);
  const handleSectionClick = async (sectionId) => {
    if (!matchId) return;

    try {
      const res = await api.get(
        `api/matches-and-tickets/match/${matchId}/section/${sectionId}/popup`
      );

      if (res.data?.status === "success") {
        const data = res.data.data;

        // FIX QUAN TRỌNG ở đây
        setPopupData({
          ...data,
          matchId: matchId,
          sectionId: sectionId,
        });

        setSelectedQty(1);

        if (data.availableTickets > 0) {
          setShowStatsIn(true);
          setShowStats(false);
          setShowStatsCancel(false);
        } else {
          setShowStats(true);
          setShowStatsIn(false);
          setShowStatsCancel(false);
        }
      }
    } catch (err) {
      console.error("Lỗi popup API:", err);
      alert("Không thể tải thông tin khu vực.");
    }
  };

  const changeQty = (delta) => {
    const newQty = selectedQty + delta;
    if (newQty < 1) return;

    if (newQty > (popupData?.availableTickets || 0)) {
      setShowStatsCancel(true);
      setShowStatsIn(false);
      return;
    }

    setSelectedQty(newQty);
  };
  const closeAllPopups = () => {
    setShowStatsIn(false);
    setShowStats(false);
    setShowStatsCancel(false);
    setPopupData(null);
    setSelectedQty(1);
  };
  const [showStats, setShowStats] = useState(false);

  const [showStatsCancel, setShowStatsCancel] = useState(false);
  // 2. Hàm xử lý Buy Now (chỉ thêm cái này)
  const handleBuyNow = async () => {
    if (isChecking) return;
    setIsChecking(true);

    try {
      const response = await api.post("/api/payment/tickets/buy-now", {
        matchId: popupData.matchId,
        sectionId: popupData.sectionId,
        quantity: selectedQty,
      });

      const data = response.data;
      const msg = (data.message || "").toUpperCase();
      if (data.status === "success") {
        navigate("/payment", {
          state: {
            matchId: popupData.matchId,
            sectionId: popupData.sectionId,
            quantity: selectedQty,
          },
        });
        return;
      }
      if (data.status === "error" && msg.includes("ONLY")) {
        const remaining = parseInt(msg.match(/\d+/)?.[0]);
        if (remaining) {
          setPopupData((prev) => ({
            ...prev,
            availableTickets: remaining,
          }));
        }
        setShowStatsCancel(true);
        return;
      }
      if (
        msg.includes("NO SEATS") ||
        msg.includes("HẾT") ||
        msg.includes("NOT AVAILABLE")
      ) {
        setShowStats(true); // hết vé
        return;
      }
      setShowStatsCancel(true);
    } catch (err) {
      console.error("Buy now error:", err);
      setShowStatsCancel(true);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (!matchId) {
      // Nếu không có matchId → quay về trang chủ hoặc thông báo
      alert("Vui lòng chọn trận đấu!");
      navigate("/");
      return;
    }

    const fetchMatchHeader = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `api/matches-and-tickets/match/${matchId}/header`
        );
        if (res.data?.status === "success") {
          setMatchData(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin trận:", err);
        alert("Không thể tải thông tin trận đấu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchHeader();
  }, [matchId, navigate]);
  const [sections, setSections] = useState([]);
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get("api/matches-and-tickets/stadium/sections");
        if (res.data.status === "success") {
          setSections(res.data.data);
        } else {
          console.error("API trả lỗi:", res.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // Format ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      .toUpperCase();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="text-center mt-20">Đang tải thông tin trận đấu...</div>
    );
  }

  if (!matchData) {
    return <div className="text-center mt-20">Không tìm thấy trận đấu.</div>;
  }
  return (
    <div className="flex flex-col Prosto">
      <Header />
      <div className="relative w-full h-screen overflow-hidden max-sm:h-dvh max-sm:w-dvh">
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
      <div className="flex items-center justify-center pt-28 gap-12 max-sm:gap-5 max-sm:pt-5 h-full"></div>
      <div className="bg-white w-full h-full m-auto flex flex-col pt-20 pb-50 items-center max-sm:w-dvh">
        <div className="flex flex-col items-center justify-center gap-10 p-6">
          <p className="text-black text-4xl font-semibold tracking-wide text-center">
            {matchData.tournamentName}
          </p>
          <div
            className="w-[700px] flex items-center justify-between gap-10 
                  px-8 py-6 rounded-2xl bg-gradient-to-r from-white to-[#F2F2F2]
                  shadow-lg border border-gray-200"
          >
            <div className="flex flex-col items-center gap-2">
              <img
                src={matchData.homeLogo}
                alt={matchData.homeTeam}
                className="w-20 h-20 object-contain"
              />
              <p className="text-xl font-medium text-center">
                {matchData.homeTeam}
              </p>
            </div>
            <p className="text-4xl font-bold text-gray-700">VS</p>
            <div className="flex flex-col items-center gap-2">
              <img
                src={matchData.awayLogo}
                alt={matchData.awayTeam}
                className="w-20 h-20 object-contain"
              />
              <p className="text-xl font-medium text-center">
                {matchData.awayTeam}
              </p>
            </div>
          </div>
          <div
            className="flex text-xl gap-6 items-center justify-center bg-white 
                  px-8 py-4 rounded-xl shadow border border-gray-200"
          >
            <p className="font-medium">{formatDate(matchData.matchDate)}</p>

            <div className="w-[1px] h-6 bg-gray-400"></div>

            <p className="font-medium">{formatTime(matchData.matchDate)}</p>

            <div className="w-[1px] h-6 bg-gray-400"></div>

            <p className="font-medium">{matchData.location}</p>
          </div>
        </div>
        <div className="w-[80%] h-[1px] border border-1 border-black my-30"></div>
        <p className="text-bold font-black text-6xl mb-50">ANFIELD STADIUM</p>
        <div className="w-full bg-white rounded-3xl flex items-center flex-col justify-center gap-3 relative">
          <div className="flex flex-col items-center justify-center -mb-10 text-xs">
            <p className="flex items-center justify-center">
              SIR KENNY DALGLISH STAND
            </p>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex gap-2">
                <div
                  className="bg-[#24BCC4] w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(1)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 1)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(2)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 2)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(3)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 3)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(4)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 4)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(5)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 5)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(6)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 6)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(7)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 7)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(8)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 8)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(9)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 9)?.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div
                  className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(10)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 10)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(11)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 11)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(12)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 12)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(13)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 13)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(14)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 14)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(15)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 15)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(16)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 16)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(17)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 17)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(18)}
                >
                  <p className="font-bold text-white">
                    {sections.find((s) => s.id === 18)?.name}
                  </p>
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
                    className="cursor-pointer"
                    onClick={() => handleSectionClick(19)}
                  >
                    <path
                      d="M58.4844 42.0859H58.4824V47.623H120.341V42.7139H120.342V75.3115H0V0H58.4844V42.0859Z"
                      fill="#B722A8"
                    />
                    <text
                      x="33"
                      y="38"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sections.find((s) => s.id === 19)?.name}
                    </text>
                  </svg>
                  <div
                    className="bg-[#C4A924] w-10 h-5 absolute right-0 top-0 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(20)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 20)?.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3.75">
                  <div className="flex gap-2">
                    <div
                      className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(21)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 21)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(22)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 22)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(23)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 23)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(24)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 24)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(25)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 25)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#C4A924] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(26)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 26)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="bg-[#B722A8] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(28)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 28)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#B722A8] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(29)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 29)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#B722A8] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(30)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 30)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#B722A8] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(31)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 31)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#B722A8] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(32)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 32)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#B722A8] w-10 h-5 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(33)}
                    >
                      <p className="font-bold text-white">
                        {sections.find((s) => s.id === 33)?.name}
                      </p>
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
                    className="pl-0 cursor-pointer"
                    onClick={() => handleSectionClick(27)}
                  >
                    <path
                      d="M56.2344 31.792L0 75.5283V0H56.2344V31.792Z"
                      fill="#B722A8"
                    />
                    <text
                      x="30"
                      y="25"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sections.find((s) => s.id === 27)?.name}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
            <p className="flex items-center justify-center">LONGSIDE TIER</p>
          </div>
          <div className="flex gap-5 items-center justify-center text-xs">
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
                    className="cursor-pointer"
                    onClick={() => handleSectionClick(34)}
                  >
                    <path
                      d="M56.2344 34.333H0V17.3994L15.5801 0H56.2344V34.333Z"
                      fill="#4B59AC"
                    />
                    <text
                      x="30"
                      y="20"
                      fill="white"
                      fontSize="20"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sections.find((s) => s.id === 34)?.name}
                    </text>
                  </svg>
                  <div
                    className="bg-[#4B59AC] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(35)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 35)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#4B59AC] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(36)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 36)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#4B59AC] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(37)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 37)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#4B59AC] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(38)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 38)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#4B59AC] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(39)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 39)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#4B59AC] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(40)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 40)?.name}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="24"
                    viewBox="0 0 57 35"
                    fill="none"
                    className="cursor-pointer"
                    onClick={() => handleSectionClick(41)}
                  >
                    <path
                      d="M56.2344 34.333H15.7119L0 21.1504V0H56.2344V34.333Z"
                      fill="#4B59AC"
                    />
                    <text
                      x="30"
                      y="20"
                      fill="white"
                      fontSize="20"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sections.find((s) => s.id === 41)?.name}
                    </text>
                  </svg>
                </div>
                <div className="flex gap-2 flex-col">
                  <div
                    className="bg-[#C4A924] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(42)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 42)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(43)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 43)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(44)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 44)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(45)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 45)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(46)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 46)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(47)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 47)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(48)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 48)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(49)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 49)?.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div
                      className="bg-[#FF53DD] w-4 h-6 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(51)}
                    >
                      <p className="font-bold text-white text-[8px]">
                        {sections.find((s) => s.id === 51)?.name}
                      </p>
                    </div>
                    <div
                      className="bg-[#FF53DD] w-4 h-6 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSectionClick(50)}
                    >
                      <p className="font-bold text-white text-[8px]">
                        {sections.find((s) => s.id === 50)?.name}
                      </p>
                    </div>
                  </div>
                  <div
                    className="bg-[#FF53DD] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(52)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 52)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#FF53DD] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(53)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 53)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#5CBF53] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(54)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 54)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#5CBF53] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(55)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 55)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#5CBF53] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(56)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 56)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#5CBF53] w-10 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(57)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 57)?.name}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="24"
                    viewBox="0 0 57 35"
                    fill=""
                    className="cursor-pointer"
                    onClick={() => handleSectionClick(58)}
                  >
                    <path
                      d="M56.2344 10.7422L36.7471 34.333H0V0H56.2344V10.7422Z"
                      fill="#5CBF53"
                    />
                    <text
                      x="25"
                      y="20"
                      fill="white"
                      fontSize="20"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sections.find((s) => s.id === 58)?.name}
                    </text>
                  </svg>
                </div>
              </div>
              <p className="rotate-270 h-10 my-0 w-40 flex items-center justify-center -ml-12">
                SHORTSIDE TIER
              </p>
            </div>
            <img
              src={Stadium}
              alt="Stadium"
              className="w-80 h-60 ml-20 -mr-12 max-sm:w-40 max-sm:h-30"
            />
            <div className="flex items-center ml-10 text-xs">
              <p className="rotate-90 h-12 w-40 my-0 -mr-7">SHORTSIDE TIER</p>
              <div className="flex">
                <div className="flex flex-col gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="49"
                    height="42"
                    viewBox="0 0 56 61"
                    fill="none"
                    className="pr-2 cursor-pointer"
                    onClick={() => handleSectionClick(65)}
                  >
                    <path
                      d="M32.5037 -7.9503e-05L3.33547e-06 60.5644L55.96 60.5879L55.9862 0.00976924L32.5037 -7.9503e-05Z"
                      fill="#B00E1E"
                    />
                    <text
                      x="34"
                      y="39"
                      fill="white"
                      fontSize="20"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sections.find((s) => s.id === 65)?.name}
                    </text>
                  </svg>
                  <div
                    className="bg-[#B00E1E] w-11 h-9  flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(64)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 64)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B00E1E] w-11 h-9  flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(63)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 63)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B00E1E] w-11 h-9  flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(62)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 62)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B00E1E] w-11 h-9  flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(61)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 61)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B00E1E] w-11 h-9 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(60)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 60)?.name}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="49"
                    height="42"
                    viewBox="0 0 58 48"
                    fill="none"
                    className="pr-2 cursor-pointer"
                    onClick={() => handleSectionClick(59)}
                  >
                    <path
                      d="M0.000248667 19.6033L56.8763 47.0787L57.0635 0.220703L0.078553 -2.60676e-05L0.000248667 19.6033Z"
                      fill="#B00E1E"
                    />
                    <text
                      x="30"
                      y="20"
                      fill="white"
                      fontSize="20"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sections.find((s) => s.id === 59)?.name}
                    </text>
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="69"
                    height="42"
                    viewBox="0 0 99 63"
                    fill="none"
                    className="cursor-pointer"
                    onClick={() => handleSectionClick(72)}
                  >
                    <path
                      d="M98.9727 12.085V62.0215H0V0H79.0225L98.9727 12.085Z"
                      fill="#B00E1E"
                    />
                    <text
                      x="49"
                      y="35"
                      fill="white"
                      fontSize="20"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sections.find((s) => s.id === 72)?.name}
                    </text>
                  </svg>
                  <div
                    className="bg-[#B00E1E] w-20 h-9 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(71)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 71)?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-2">
                      <div
                        className="bg-[#B00E1E] w-12 h-9 flex items-center justify-center cursor-pointer"
                        onClick={() => handleSectionClick(70)}
                      >
                        <p className="font-bold text-white">
                          {sections.find((s) => s.id === 70)?.name}
                        </p>
                      </div>
                      <div
                        className="bg-[#B00E1E] w-12 h-9 flex items-center justify-center cursor-pointer"
                        onClick={() => handleSectionClick(69)}
                      >
                        <p className="font-bold text-white">
                          {sections.find((s) => s.id === 69)?.name}
                        </p>
                      </div>
                      <div
                        className="bg-[#B00E1E] w-12 h-9 flex items-center justify-center cursor-pointer"
                        onClick={() => handleSectionClick(68)}
                      >
                        <p className="font-bold text-white">
                          {sections.find((s) => s.id === 68)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className="bg-[#B00E1E] w-12 h-9 flex items-center justify-center cursor-pointer"
                        onClick={() => handleSectionClick(75)}
                      >
                        <p className="font-bold text-white">
                          {sections.find((s) => s.id === 75)?.name}
                        </p>
                      </div>
                      <div
                        className="bg-[#B00E1E] w-12 h-9 flex items-center justify-center cursor-pointer"
                        onClick={() => handleSectionClick(74)}
                      >
                        <p className="font-bold text-white">
                          {sections.find((s) => s.id === 74)?.name}
                        </p>
                      </div>
                      <div
                        className="bg-[#B00E1E] w-12 h-9 flex items-center justify-center cursor-pointer"
                        onClick={() => handleSectionClick(73)}
                      >
                        <p className="font-bold text-white">
                          {sections.find((s) => s.id === 73)?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-[#B00E1E] w-20 h-9 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(67)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 67)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B00E1E] w-16 h-9 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(66)}
                  >
                    <p className="font-bold text-white">
                      {sections.find((s) => s.id === 66)?.name}
                    </p>
                  </div>
                </div>
              </div>
              <p className="rotate-90 h-12 w-40 my-0 -ml-15 flex items-center justify-center">
                KOP STAND
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center -mt-10 text-xs">
            <p>LONGSIDE TIER</p>
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33"
                height="80"
                viewBox="0 0 47 82"
                fill="none"
                className="pt-4 cursor-pointer"
                onClick={() => handleSectionClick(76)}
              >
                <path
                  d="M46.1123 81.9561H0V28.0557L0.275391 28.3828L34.9951 0H46.1123V81.9561Z"
                  fill="#B722A8"
                />
                <text
                  x="24"
                  y="49"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {sections.find((s) => s.id === 76)?.name}
                </text>
              </svg>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div
                    className="bg-[#B722A8] w-8 h-15 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(77)}
                  >
                    <p className="text-white font-bold">
                      {sections.find((s) => s.id === 77)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B722A8] w-8 h-15 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(78)}
                  >
                    <p className="text-white font-bold">
                      {sections.find((s) => s.id === 78)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B722A8] w-8 h-15 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(79)}
                  >
                    <p className="text-white font-bold">
                      {sections.find((s) => s.id === 79)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B722A8] w-8 h-15 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(80)}
                  >
                    <p className="text-white font-bold">
                      {sections.find((s) => s.id === 80)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B722A8] w-8 h-15 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(81)}
                  >
                    <p className="text-white font-bold">
                      {sections.find((s) => s.id === 81)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B722A8] w-8 h-15 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(82)}
                  >
                    <p className="text-white font-bold">
                      {sections.find((s) => s.id === 82)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B722A8] w-8 h-15 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(83)}
                  >
                    <p className="text-white font-bold">
                      {sections.find((s) => s.id === 83)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#B722A8] w-8 h-15 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(84)}
                  >
                    <p className="text-white font-bold">
                      {sections.find((s) => s.id === 84)?.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div
                    className="bg-[#C4A924] w-8 h-2 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(86)}
                  >
                    <p className="text-white font-bold text-[9px]">
                      {sections.find((s) => s.id === 86)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-8 h-2 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(87)}
                  >
                    <p className="text-white font-bold text-[9px]">
                      {sections.find((s) => s.id === 87)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-8 h-2 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(88)}
                  >
                    <p className="text-white font-bold text-[9px]">
                      {sections.find((s) => s.id === 88)?.name}
                    </p>
                  </div>
                  <div className="bg-[#A4A4A4] w-8 h-2 flex items-center justify-center">
                    <p></p>
                  </div>
                  <div className="bg-[#A4A4A4] w-8 h-2 flex items-center justify-center">
                    <p></p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-8 h-2 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(89)}
                  >
                    <p className="text-white font-bold text-[9px]">
                      {sections.find((s) => s.id === 89)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-8 h-2 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(90)}
                  >
                    <p className="text-white font-bold text-[9px]">
                      {sections.find((s) => s.id === 90)?.name}
                    </p>
                  </div>
                  <div
                    className="bg-[#C4A924] w-8 h-2 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSectionClick(91)}
                  >
                    <p className="text-white font-bold text-[9px]">
                      {sections.find((s) => s.id === 91)?.name}
                    </p>
                  </div>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33"
                height="82"
                viewBox="0 0 47 76"
                fill="none"
                className="pt-4 cursor-pointer"
                onClick={() => handleSectionClick(85)}
              >
                <path
                  d="M46.1123 25.1436V75.3115H0V0H16.1162L46.1123 25.1436Z"
                  fill="#B722A8"
                />
                <text
                  x="24"
                  y="49"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {sections.find((s) => s.id === 85)?.name}
                </text>
              </svg>
            </div>
            <div className="flex gap-2">
              <div
                className="bg-[#C4A924] h-5 w-12 flex items-center justify-center cursor-pointer"
                onClick={() => handleSectionClick(92)}
              >
                <p className="text-white font-bold">
                  {sections.find((s) => s.id === 92)?.name}
                </p>
              </div>
              <div
                className="bg-[#C4A924] h-5 w-6 flex items-center justify-center cursor-pointer"
                onClick={() => handleSectionClick(93)}
              >
                <p className="text-white font-bold">
                  {sections.find((s) => s.id === 93)?.name}
                </p>
              </div>
              <div
                className="bg-[#C4A924] h-5 w-12 flex items-center justify-center cursor-pointer"
                onClick={() => handleSectionClick(94)}
              >
                <p className="text-white font-bold">
                  {sections.find((s) => s.id === 94)?.name}
                </p>
              </div>
              <div
                className="bg-[#C4A924] h-5 w-6 flex items-center justify-center cursor-pointer"
                onClick={() => handleSectionClick(95)}
              >
                <p className="text-white font-bold">
                  {sections.find((s) => s.id === 95)?.name}
                </p>
              </div>
              <div
                className="bg-[#C4A924] h-5 w-12 flex items-center justify-center cursor-pointer"
                onClick={() => handleSectionClick(96)}
              >
                <p className="text-white font-bold">
                  {sections.find((s) => s.id === 96)?.name}
                </p>
              </div>
              <div
                className="bg-[#C4A924] h-5 w-6 flex items-center justify-center cursor-pointer"
                onClick={() => handleSectionClick(97)}
              >
                <p className="text-white font-bold">
                  {sections.find((s) => s.id === 97)?.name}
                </p>
              </div>
              <div
                className="bg-[#C4A924] h-5 w-12 flex items-center justify-center cursor-pointer"
                onClick={() => handleSectionClick(98)}
              >
                <p className="text-white font-bold">
                  {sections.find((s) => s.id === 98)?.name}
                </p>
              </div>
              <div
                className="bg-[#C4A924] h-5 w-6 flex items-center justify-center cursor-pointer"
                onClick={() => handleSectionClick(99)}
              >
                <p className="text-white font-bold">
                  {sections.find((s) => s.id === 99)?.name}
                </p>
              </div>
              <div
                className="bg-[#C4A924] h-5 w-12 flex items-center justify-center cursor-pointer"
                onClick={() => handleSectionClick(100)}
              >
                <p className="text-white font-bold">
                  {sections.find((s) => s.id === 100)?.name}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="59"
                height="60"
                viewBox="0 0 47 87"
                className="pl-5 cursor-pointer"
                fill="none"
                onClick={() => handleSectionClick(101)}
              >
                <path
                  d="M46.1123 0V86.3877H29.9639L0.275391 59.4551L0 59.8184V0H46.1123Z"
                  fill="#24BCC4"
                />
                <text
                  x="24"
                  y="40"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {sections.find((s) => s.id === 101)?.name}
                </text>
              </svg>
              <div className="flex gap-2">
                <div
                  className="bg-[#24BCC4] w-8 h-17 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(102)}
                >
                  <p className="text-white font-bold">
                    {sections.find((s) => s.id === 102)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-8 h-17 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(103)}
                >
                  <p className="text-white font-bold">
                    {sections.find((s) => s.id === 103)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-8 h-17 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(104)}
                >
                  <p className="text-white font-bold">
                    {sections.find((s) => s.id === 104)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-8 h-17 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(105)}
                >
                  <p className="text-white font-bold">
                    {sections.find((s) => s.id === 105)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-8 h-17 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(106)}
                >
                  <p className="text-white font-bold">
                    {sections.find((s) => s.id === 106)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-8 h-17 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(107)}
                >
                  <p className="text-white font-bold">
                    {sections.find((s) => s.id === 107)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-8 h-17 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(108)}
                >
                  <p className="text-white font-bold">
                    {sections.find((s) => s.id === 108)?.name}
                  </p>
                </div>
                <div
                  className="bg-[#24BCC4] w-8 h-17 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSectionClick(109)}
                >
                  <p className="text-white font-bold">
                    {sections.find((s) => s.id === 109)?.name}
                  </p>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="59"
                height="58"
                viewBox="0 0 60 87"
                className="pr-5 cursor-pointer"
                fill="none"
                onClick={() => handleSectionClick(110)}
              >
                <path
                  d="M59.6084 59.8184L59.252 59.4551L20.874 86.3877H0V0H59.6084V59.8184Z"
                  fill="#24BCC4"
                />
                <text
                  x="30"
                  y="39"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {sections.find((s) => s.id === 110)?.name}
                </text>
              </svg>
            </div>
            <p>MAIN STAND</p>
          </div>
          {showStatsIn && popupData && (
            <div
              className="w-[550px] h-[620px] bg-white shadow-2xl rounded-3xl 
                  flex flex-col items-center justify-start gap-6 
                  absolute z-10 inset-0 m-auto p-6 border border-gray-200"
            >
              <img
                src={Cancel}
                className="absolute top-5 right-5 w-10 h-10 cursor-pointer opacity-80 hover:opacity-100 transition"
                onClick={closeAllPopups}
              />
              <img
                src={popupData.viewImageUrl || ViewStadium}
                alt="View"
                className="w-full h-[300px] object-cover rounded-2xl shadow-md"
              />
              <div className="flex flex-col items-center justify-center gap-1 text-lg font-medium">
                <p className="text-2xl font-semibold text-green-700">
                  ${popupData.price?.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  {popupData.sectionName} - {popupData.tierName}
                </p>
                <p className="text-gray-500">
                  Available: {popupData.availableTickets} tickets
                </p>
              </div>
              <div className="flex gap-12 items-center mt-2">
                <div className="flex items-center bg-gray-100 rounded-xl shadow-inner px-4 py-2">
                  <div
                    className="bg-black text-white w-7 h-7 flex items-center justify-center 
                     cursor-pointer rounded-md hover:bg-gray-800 transition"
                    onClick={() => changeQty(1)}
                  >
                    +
                  </div>

                  <input
                    type="text"
                    value={selectedQty}
                    onChange={(e) =>
                      changeQty(Number(e.target.value) - selectedQty)
                    }
                    className="bg-white text-black w-16 h-7 mx-3 flex items-center justify-center
             rounded-md border border-gray-300 font-semibold text-center 
             focus:outline-none focus:ring-2 focus:ring-black"
                    min="1"
                  />

                  <div
                    className="bg-black text-white w-7 h-7 flex items-center justify-center 
                     cursor-pointer rounded-md hover:bg-gray-800 transition"
                    onClick={() => changeQty(-1)}
                  >
                    -
                  </div>
                </div>
                <p className="text-2xl font-semibold text-red-600">
                  ${(popupData.price * selectedQty).toFixed(2)}
                </p>
              </div>
              <Button
                text="Buy Now"
                onClick={handleBuyNow}
                disabled={isChecking}
              />
            </div>
          )}

          {showStats && (
            <div className="w-70 h-40 bg-[#CECCCC] shadow-2xl rounded-3xl flex items-center flex-col justify-center absolute z-50 inset-0 m-auto">
              <div className="flex items-center justify-center mt-20">
                <img src={Cancel} className=" w-10 h-10" />
                <p>SEAT ISN’T AVAILABLE</p>
              </div>
              <Button text="Back" onClick={closeAllPopups} className="mb-20" />
            </div>
          )}
          {showStatsCancel && (
            <div className="w-70 h-40 bg-[#CECCCC] shadow-2xl rounded-3xl flex items-center flex-col justify-center absolute z-50 inset-0 m-auto">
              <div className="flex items-center justify-center mt-20">
                <img src={Cancel} className=" w-10 h-10" />
                <p>
                  THERE ARE ONLY {popupData?.availableTickets} SEATS IN THIS
                  SECTION
                </p>
              </div>
              <Button text="Back" onClick={closeAllPopups} className="mb-20" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-8 gap-10 m-30 text-xs border border-1 p-10 Kanit">
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
      <Footer />
    </div>
  );
}
