import { useState } from "react";
import "../pageRegister/Register.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Stadium from "../assets/img/Stadium.png";
import api from "../Api/apitoken";
import "../output.css";
import { logout } from "../Api/logout.js";
import { useEffect } from "react";

export default function AdminMatchAdd() {
  const [tournaments, setTournaments] = useState([]);
  const [, setLoadingTournaments] = useState(false);
  const [ticketSettings, setTicketSettings] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [tempQuantity, setTempQuantity] = useState(500);
  const [tempPrice, setTempPrice] = useState(200000);

  const [formData, setFormData] = useState({
    tournament: "",
    home: "",
    away: "",
    homeLogo: null,
    banner: null,
    awayLogo: null,
    date: "",
    location: "",
  });

  const [previewUrls, setPreviewUrls] = useState({
    homeLogo: null,
    banner: null,
    awayLogo: null,
  });

  const [errors, setErrors] = useState({
    tournament: "",
    home: "",
    away: "",
    homeLogo: "",
    banner: "",
    awayLogo: "",
    date: "",
    location: "",
  });
  const [showStats, setShowStats] = useState(false);
  const hiddenShow = () => {
    setShowStats((prev) => !prev);
  };

  const [showStatsIn, setShowStatsIn] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (field, file) => {
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    }
  };
  // Handle click vào section
  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);

    // Load existing values if any
    if (ticketSettings[sectionId]) {
      setTempQuantity(ticketSettings[sectionId].totalQuantity);
      setTempPrice(ticketSettings[sectionId].price);
    } else {
      // Reset về giá trị mặc định
      setTempQuantity(500);
      setTempPrice(120.0);
    }

    setShowStatsIn(true);
  };

  // Handle save ticket setting cho section
  const handleSaveTicketSetting = () => {
    if (!tempQuantity || !tempPrice) {
      alert("Vui lòng nhập đầy đủ số lượng và giá");
      return;
    }

    setTicketSettings((prev) => ({
      ...prev,
      [selectedSection]: {
        sectionId: selectedSection,
        totalQuantity: parseInt(tempQuantity),
        price: parseFloat(tempPrice),
      },
    }));

    setShowStatsIn(false);
    setSelectedSection(null);
    setTempQuantity("");
    setTempPrice("");
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await api.get("api/dropdowns/tournaments");
        if (response.data?.status === "success") {
          setTournaments(response.data.data);
        } else {
          console.error("API trả về lỗi:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoadingTournaments(false);
      }
    };

    fetchTournaments();
  }, []);

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.tournament) {
      newErrors.tournament = "Vui lòng chọn giải đấu";
      isValid = false;
    }

    if (!formData.home.trim()) {
      newErrors.home = "Vui lòng nhập đội nhà";
      isValid = false;
    }

    if (!formData.away.trim()) {
      newErrors.away = "Vui lòng nhập đội khách";
      isValid = false;
    }

    if (!formData.homeLogo) {
      newErrors.homeLogo = "Vui lòng chọn logo đội nhà";
      isValid = false;
    }

    if (!formData.banner) {
      newErrors.banner = "Vui lòng chọn banner";
      isValid = false;
    }

    if (!formData.awayLogo) {
      newErrors.awayLogo = "Vui lòng chọn logo đội khách";
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Vui lòng nhập địa điểm";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      alert(
        "Vui lòng điền đầy đủ thông tin bắt buộc! " +
          newErrors.homeLogo +
          " " +
          newErrors.banner +
          " " +
          newErrors.awayLogo
      );
    }

    return isValid;
  };

  // Thêm state loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true); // Bắt đầu loading

    try {
      const formDataToSend = new FormData();

      const selectedTournament = tournaments.find(
        (t) => t.name === formData.tournament
      );

      // ✅ THÊM LOGIC MẶC ĐỊNH
      const finalTicketSettings = sections.map((section) => {
        const userSetting = ticketSettings[section.id];
        return {
          sectionId: section.id,
          totalQuantity: userSetting ? userSetting.totalQuantity : 500,
          price: userSetting ? userSetting.price : 120,
        };
      });

      console.log("Final Ticket Settings (gửi đi):", finalTicketSettings);

      const dataPayload = {
        tournamentId: selectedTournament?.id,
        homeTeam: formData.home,
        awayTeam: formData.away,
        matchDate: formData.date,
        location: formData.location,
        ticketSettings: finalTicketSettings,
      };

      console.log("Data Payload:", dataPayload);
      console.log("Ticket Settings Count:", finalTicketSettings.length);

      const dataBlob = new Blob([JSON.stringify(dataPayload)], {
        type: "application/json",
      });

      formDataToSend.append("data", dataBlob);

      if (formData.homeLogo) {
        formDataToSend.append("homeLogo", formData.homeLogo);
      }
      if (formData.awayLogo) {
        formDataToSend.append("awayLogo", formData.awayLogo);
      }
      if (formData.banner) {
        formDataToSend.append("matchImage", formData.banner);
      }

      const response = await api.post(
        "api/matches-and-tickets/add",
        formDataToSend
      );

      if (response.data.status === "success") {
        alert("Thêm trận đấu thành công!");
        setFormData({
          tournament: "",
          home: "",
          away: "",
          homeLogo: null,
          banner: null,
          awayLogo: null,
          date: "",
          location: "",
        });
        setTicketSettings({});
        setPreviewUrls({
          homeLogo: null,
          banner: null,
          awayLogo: null,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Có lỗi xảy ra: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false); // Kết thúc loading
    }
  };

  if (loading) return <p>Đang tải danh sách khu vực...</p>;

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} onClick={logout} />
        </div>

        <div className="w-[80%] bg-white mr-10 ml-10 mt-5 mb-5 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-3 ">
          <p className="text-2xl text-[#2B3674] font-bold">Add Match</p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-3 text-[#2B3674] text-sm w-[30%]"
          >
            <label className="flex flex-col w-full relative">
              Tournament
              <select
                value={formData.tournament}
                onChange={(e) =>
                  handleInputChange("tournament", e.target.value)
                }
                className={`border rounded-[10px] h-10 px-3 mt-2 bg-white ${
                  errors.tournament ? "border-red-500" : ""
                }`}
              >
                <option value="">-- Choose --</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.name}>
                    {tournament.name}
                  </option>
                ))}
              </select>
              {errors.tournament && (
                <span className="text-red-500 text-xs absolute top-full left-0 mt-1">
                  {errors.tournament}
                </span>
              )}
            </label>

            <label className="flex flex-col w-full relative">
              Home
              <input
                type="text"
                value={formData.home}
                onChange={(e) => handleInputChange("home", e.target.value)}
                className={`border rounded-[10px] h-10 px-3 mt-2 ${
                  errors.home ? "border-red-500" : ""
                }`}
              />
              {errors.home && (
                <span className="text-red-500 text-xs absolute top-full left-0 mt-1">
                  {errors.home}
                </span>
              )}
            </label>

            <label className="flex flex-col w-full relative">
              Away
              <input
                type="text"
                value={formData.away}
                onChange={(e) => handleInputChange("away", e.target.value)}
                className={`border rounded-[10px] h-10 px-3 mt-2 ${
                  errors.away ? "border-red-500" : ""
                }`}
              />
              {errors.away && (
                <span className="text-red-500 text-xs absolute top-full left-0 mt-1">
                  {errors.away}
                </span>
              )}
            </label>

            <div className="w-full">
              <p className="mb-2">Logo</p>
              <div className="flex gap-5 justify-between">
                <div className="flex flex-col w-[28%]">
                  <label className="flex flex-col items-center justify-center h-20 border rounded-[10px] cursor-pointer hover:bg-gray-50 relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange("homeLogo", e.target.files[0])
                      }
                      className="hidden"
                    />
                    {previewUrls.homeLogo ? (
                      <img
                        src={previewUrls.homeLogo}
                        alt="Home Logo Preview"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-gray-500">Home Logo</span>
                    )}
                    {errors.homeLogo && (
                      <span className="text-red-500 text-xs absolute top-full left-0 mt-1">
                        {errors.homeLogo}
                      </span>
                    )}
                  </label>
                  {formData.homeLogo && (
                    <p className="text-xs text-gray-600 mt-2 text-center truncate">
                      {formData.homeLogo.name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-[28%]">
                  <label className="flex flex-col items-center justify-center h-20 border rounded-[10px] cursor-pointer hover:bg-gray-50 relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange("banner", e.target.files[0])
                      }
                      className="hidden"
                    />
                    {previewUrls.banner ? (
                      <img
                        src={previewUrls.banner}
                        alt="Banner Preview"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-gray-500">Banner</span>
                    )}
                    {errors.banner && (
                      <span className="text-red-500 text-xs absolute top-full left-0 mt-1">
                        {errors.banner}
                      </span>
                    )}
                  </label>
                  {formData.banner && (
                    <p className="text-xs text-gray-600 mt-2 text-center truncate">
                      {formData.banner.name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-[28%]">
                  <label className="flex flex-col items-center justify-center h-20 border rounded-[10px] cursor-pointer hover:bg-gray-50 relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange("awayLogo", e.target.files[0])
                      }
                      className="hidden"
                    />
                    {previewUrls.awayLogo ? (
                      <img
                        src={previewUrls.awayLogo}
                        alt="Away Logo Preview"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-gray-500">Away Logo</span>
                    )}
                    {errors.awayLogo && (
                      <span className="text-red-500 text-xs absolute top-full left-0 mt-1">
                        {errors.awayLogo}
                      </span>
                    )}
                  </label>
                  {formData.awayLogo && (
                    <p className="text-xs text-gray-600 mt-2 text-center truncate">
                      {formData.awayLogo.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-5 w-full justify-between">
              <label className="flex flex-col w-[48%] relative">
                Date
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={`border rounded-[10px] h-10 px-3 mt-2 ${
                    errors.date ? "border-red-500" : ""
                  }`}
                />
                {errors.date && (
                  <span className="text-red-500 text-xs absolute top-full left-0 mt-1">
                    {errors.date}
                  </span>
                )}
              </label>

              <label className="flex flex-col w-[48%] relative">
                Location
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`border rounded-[10px] h-10 px-3 mt-2 ${
                    errors.location ? "border-red-500" : ""
                  }`}
                />
                {errors.location && (
                  <span className="text-red-500 text-xs absolute top-full left-0 mt-1">
                    {errors.location}
                  </span>
                )}
              </label>
            </div>

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
                  onClick={hiddenShow}
                />
                {showStatsIn && selectedSection && (
                  <div className="w-120 h-70 bg-amber-50 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-3 absolute z-100 inset-0 m-auto">
                    <h3 className="font-bold text-lg">
                      Section{" "}
                      {sections.find((s) => s.id === selectedSection)?.name}
                    </h3>

                    <div className="flex gap-20">
                      <label className="flex flex-col justify-center w-30 gap-5 relative">
                        Quantity:
                        <input
                          type="number"
                          value={tempQuantity}
                          onChange={(e) => setTempQuantity(e.target.value)}
                          className="border rounded-[10px] h-10 px-2"
                        />
                      </label>

                      <label className="flex flex-col justify-center w-30 gap-5 relative">
                        Price(VND):
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          className="border rounded-[10px] h-10 px-2"
                        />
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <Button text="Save" onClick={handleSaveTicketSetting} />
                      <Button
                        text="Cancel"
                        onClick={() => setShowStatsIn(false)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>

          <Button
            text="Add"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`rounded-lg font-semibold ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </>
  );
}
