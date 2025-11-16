import { useState, useEffect } from "react";
import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Stadium from "../assets/img/Stadium.png";
import api from "../Api/apitoken";
import { useLocation } from "react-router-dom";
import { logout } from "../Api/logout.js";

export default function AdminMatchView() {
  const location = useLocation();
  const matchId = location.state?.matchId; // LẤY TỪ Link trong AdminMatch

  const [match, setMatch] = useState(null);
  const [sections, setSections] = useState([]);
  const [ticketSettings, setTicketSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);

  // === 1. LẤY DỮ LIỆU TRẬN ĐẤU ===
  useEffect(() => {
    if (!matchId) {
      alert("Không tìm thấy ID trận đấu");
      return;
    }

    const fetchMatch = async () => {
      try {
        const response = await api.get(
          `api/matches-and-tickets/view/${matchId}`
        );
        if (response.data?.status === "success") {
          const data = response.data.data;
          setMatch(data);

          // Tạo map ticketSettings
          const settingsMap = {};
          data.ticketSettings?.forEach((s) => {
            settingsMap[s.sectionId] = {
              quantity: s.totalQuantity,
              price: s.price,
              sectionName: s.sectionName,
              stand: s.stand,
              tierName: s.tierName,
            };
          });
          setTicketSettings(settingsMap);
        } else {
          throw new Error("API trả về lỗi");
        }
      } catch (error) {
        console.error("Lỗi lấy trận đấu:", error);
        alert("Không thể tải dữ liệu trận đấu");
      }
    };

    fetchMatch();
  }, [matchId]);

  // === 2. LẤY DANH SÁCH 110 SECTIONS ===
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get(
          "api/matches-and-tickets/stadium/sections"
        );
        if (response.data?.status === "success") {
          setSections(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // === HIỂN THỊ TÊN SECTION ===
  const getSectionName = (id) => {
    const section = sections.find((s) => s.id === id);
    return section?.name || `S${id}`;
  };

  // === HIỂN THỊ THÔNG TIN TICKET ===
  // const getTicketInfo = (id) => {
  //   const setting = ticketSettings[id];
  //   if (!setting) return null;
  //   return `${setting.quantity} vé - ${setting.price.toLocaleString()} VND`;
  // };

  const [viewDetail, setViewDetail] = useState(null);

  const handleSectionClick = (sectionId) => {
    const setting = ticketSettings[sectionId];
    setViewDetail({
      sectionId,
      name: getSectionName(sectionId),
      quantity: setting?.quantity ?? "Chưa cấu hình",
      price: setting?.price
        ? `${setting.price.toLocaleString()} VND`
        : "Chưa cấu hình",
    });
  };
  // === RENDER ===
  if (loading || !match) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} onClick={logout} />
        </div>

        <div className="w-[80%] bg-white mr-10 ml-10 mt-5 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-3">
          <p className="text-2xl text-[#2B3674] font-bold">View Match</p>

          <div className="flex flex-col items-center gap-3 text-[#2B3674] text-sm w-[30%]">
            {/* Tournament */}
            <label className="flex flex-col w-full items-center">
              Tournament:{" "}
              <p className="font-semibold">{match.tournamentName}</p>
            </label>

            {/* Home Team */}
            <label className="flex flex-col w-full items-center">
              Home: <p className="font-semibold">{match.homeTeam}</p>
            </label>

            {/* Away Team */}
            <label className="flex flex-col w-full items-center">
              Away: <p className="font-semibold">{match.awayTeam}</p>
            </label>

            {/* Logo */}
            <div className="w-full flex flex-col">
              <p className="mb-2">Logo</p>
              <div className="flex gap-5 items-center justify-between">
                <div className="flex flex-col w-[28%] items-center">
                  <img
                    src={match.homeLogoUrl}
                    alt="Home Logo"
                    className="w-20 h-20 object-contain rounded-lg border"
                  />
                  <p className="text-xs mt-1">Home</p>
                </div>
                <div className="flex flex-col w-[28%] items-center">
                  <img
                    src={match.matchImageUrl}
                    alt="Banner"
                    className="w-20 h-20 object-contain rounded-lg border"
                  />
                  <p className="text-xs mt-1">Banner</p>
                </div>
                <div className="flex flex-col w-[28%] items-center">
                  <img
                    src={match.awayLogoUrl}
                    alt="Away Logo"
                    className="w-20 h-20 object-contain rounded-lg border"
                  />
                  <p className="text-xs mt-1">Away</p>
                </div>
              </div>
            </div>

            {/* Date & Location */}
            <div className="flex gap-5 w-full justify-between">
              <label className="flex flex-col w-[48%] items-center">
                Date:{" "}
                <p className="font-semibold">
                  {new Date(match.matchDate).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </label>
              <label className="flex flex-col w-[48%] items-center">
                Location: <p className="font-semibold">{match.location}</p>
              </label>
            </div>

            {/* View Ticket Settings */}
            <button
              type="button"
              className="w-full border rounded-[10px] h-12 text-[#2B3674] hover:bg-gray-50 mt-5"
              onClick={() => setShowStats(true)}
            >
              View Ticket Settings
            </button>
          </div>
        </div>
      </div>
      {showStats && (
        <div className="w-[70%] bg-white mr-10 ml-95 mt-5 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-3 absolute z-100 inset-0">
          <div className="flex flex-col items-center justify-center -mb-10">
            <p className="flex items-center justify-center">
              SIR KENNY DALGLISH STAND
            </p>
            <div className="flex flex-col gap-2">
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
          <div className="flex flex-col items-center justify-center -mt-10">
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
          <Button
            text="Back"
            className="absolute top-0 left-0"
            onClick={() => setShowStats(false)}
          />
          {viewDetail && (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 pl-70 pb-20">
              <div className="bg-white p-6 rounded-xl shadow-xl w-100">
                <h3 className="font-bold text-lg mb-4 text-center">
                  {viewDetail.name}
                </h3>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Quantity: </strong> {viewDetail.quantity}
                  </p>
                  <p>
                    <strong>Price: </strong> {viewDetail.price}
                  </p>
                </div>
                <Button
                  text="Back"
                  className="mt-5 w-full"
                  onClick={() => setViewDetail(null)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
