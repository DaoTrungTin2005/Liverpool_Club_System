import React, { useState, useRef } from "react";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01.jsx";
import LinkGoPage from "../pageAdminUser//componentAdminUser/LinkGoPage.jsx";
import Button from "../pageAdminUser//componentAdminUser/Button.jsx";
import "../pageRegister/Register.css";
import { SvgBall } from "../assets/svg/SvgAdmin.jsx";
import { SvgGoal } from "../assets/svg/SvgAdmin.jsx";
import { SvgLocation } from "../assets/svg/SvgAdmin.jsx";
import { SvgNationality } from "../assets/svg/SvgAdmin.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../Api/apitoken.js";
import { logout } from "../Api/logout.js";

export default function AdminMyClubAdd() {
  const navigate = useNavigate();

  // === State chính ===
  const [playerName, setPlayerName] = useState("");
  const [bio, setBio] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [joined, setJoined] = useState("");
  const [location, setLocation] = useState("");
  const [nationality, setNationality] = useState("");
  const [position, setPosition] = useState("");

  // === Upload ảnh ===
  const backgroundRef = useRef(null);
  const bioImageRef = useRef(null);
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [backgroundName, setBackgroundName] = useState("");
  const [bioPreview, setBioPreview] = useState(null);
  const [bioName, setBioName] = useState("");
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [bioFile, setBioFile] = useState(null);

  // === Validation errors ===
  const [errors, setErrors] = useState({}, { tournament: false });

  // === Refs để focus lỗi ===
  const playerNameRef = useRef(null);
  const bioRef = useRef(null);
  const numberRef = useRef(null);
  const dobRef = useRef(null);
  const joinedRef = useRef(null);
  const locationRef = useRef(null);
  const nationalityRef = useRef(null);
  const positionRef = useRef(null);

  // === State giải đấu ===
  const [currentInput, setCurrentInput] = useState({
    id: Date.now(),
    leagueName: "",
    matches: "",
    goals: "",
    assists: "",
    isEditing: true,
  });
  const [completedLeagues, setCompletedLeagues] = useState([]);
  const [showStats, setShowStats] = useState(false);

  // === Xử lý ảnh nền ===
  function handleBackgroundClick() {
    backgroundRef.current?.querySelector("input")?.click();
  }

  function handleBackgroundChange(e) {
    const file = e.target.files[0];
    if (file) {
      setBackgroundFile(file);
      setBackgroundName(file.name);
      setBackgroundPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, background: false }));
    }
    e.target.value = "";
  }

  // === Xử lý ảnh tiểu sử ===
  function handleBioClick() {
    bioImageRef.current?.querySelector("input")?.click();
  }

  function handleBioChange(e) {
    const file = e.target.files[0];
    if (file) {
      setBioFile(file);
      setBioName(file.name);
      setBioPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, bioImage: false }));
    }
    e.target.value = "";
  }

  // === Xử lý thay đổi input giải đấu ===
  const handleInputChange = (field, value) => {
    if (["matches", "goals", "assists"].includes(field)) {
      if (value !== "" && (isNaN(value) || Number(value) < 0)) return;
    }
    const updated = { ...currentInput, [field]: value };
    if (field === "matches" && (value === "0" || value === "")) {
      updated.goals = "0";
      updated.assists = "0";
    }
    setCurrentInput(updated);
  };

  // === Hoàn tất nhập một dòng giải đấu ===
  const completeCurrentInput = () => {
    const { leagueName, matches } = currentInput;
    if (!leagueName.trim() || matches === "") {
      alert("Vui lòng chọn giải đấu và nhập số trận!");
      return;
    }
    setCompletedLeagues([
      ...completedLeagues,
      { ...currentInput, isEditing: false },
    ]);
    setCurrentInput({
      id: Date.now(),
      leagueName: "",
      matches: "",
      goals: "",
      assists: "",
      isEditing: true,
    });
  };

  // === Xóa giải đấu đã hoàn thành ===
  const removeCompletedLeague = (id) => {
    setCompletedLeagues(completedLeagues.filter((l) => l.id !== id));
  };

  // === Toggle hiển thị Stats popup ===
  const hiddenShow = () => {
    setShowStats((prev) => !prev);
  };

  // === Validation Form ===
  const validateForm = () => {
    const newErrors = {};

    if (!playerName.trim()) newErrors.playerName = true;
    if (!bio.trim()) newErrors.bio = true;
    if (
      !number ||
      isNaN(number) ||
      Number(number) <= 0 ||
      !Number.isInteger(Number(number))
    )
      newErrors.number = true;
    if (!backgroundFile) newErrors.background = true;
    if (!bioFile) newErrors.bioImage = true;
    if (!dob) newErrors.dob = true;
    if (!location.trim()) newErrors.location = true;
    if (!nationality.trim()) newErrors.nationality = true;
    if (!joined) newErrors.joined = true;
    if (!position) newErrors.position = true;

    setErrors(newErrors);

    // Focus vào ô lỗi đầu tiên
    const firstError = Object.keys(newErrors)[0];
    const focusMap = {
      playerName: playerNameRef,
      bio: bioRef,
      number: numberRef,
      background: backgroundRef,
      bioImage: bioImageRef,
      dob: dobRef,
      location: locationRef,
      nationality: nationalityRef,
      joined: joinedRef,
      position: positionRef,
    };
    const ref = focusMap[firstError];
    if (ref?.current) {
      if (ref.current.click) ref.current.click();
      else ref.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // === Submit Form ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Kiểm tra số áo
    const shirtNum = parseInt(number, 10);
    if (isNaN(shirtNum) || shirtNum < 0 || shirtNum > 999) {
      alert("Số áo không hợp lệ!");
      return;
    }

    // Kiểm tra giải đấu
    const allLeagues = [
      ...completedLeagues,
      ...(currentInput.leagueName.trim() ? [currentInput] : []),
    ];
    if (allLeagues.length === 0) {
      alert("Nhập ít nhất 1 giải đấu!");
      return;
    }

    try {
      // Tạo FormData với đúng key mà backend expect
      const formData = new FormData();

      // Append files với key chính xác
      if (bioFile) {
        formData.append("bioImage", bioFile);
      }
      if (backgroundFile) {
        formData.append("backgroundImage", backgroundFile);
      }

      // Tạo object player
      const player = {
        playerName: playerName.trim(),
        bio: bio.trim(),
        shirtNumber: shirtNum,
        positionId: parseInt(position, 10),
        dateOfBirth: dob,
        location: location.trim(),
        nationality: nationality.trim(),
        joinedClub: joined,
        stats: allLeagues.map((l) => ({
          tournamentId: +l.tournamentId, // ✅ Sử dụng ID đã lưu
          matches: +l.matches || 0,
          goals: +l.goals || 0,
          assists: +l.assists || 0,
        })),
      };

      // Append player object as JSON string với key "player"
      formData.append(
        "player",
        new Blob([JSON.stringify(player)], { type: "application/json" })
      );

      // Log để debug
      console.log("📦 FormData keys:", Array.from(formData.keys()));
      console.log("📦 Player data:", player);

      // Gửi request với FormData
      // QUAN TRỌNG: KHÔNG set Content-Type, để axios tự thêm boundary
      // Gửi request với FormData
      const response = await api.post("api/players/add", formData);
      console.log(response);

      // Thành công
      alert("Thêm cầu thủ thành công!");
      navigate("/admin/club");
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi thêm cầu thủ:", error);

      let errorMessage = "Không kết nối được server!";

      if (error.response) {
        // Server trả về lỗi
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Lỗi ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // Request được gửi nhưng không nhận được response
        errorMessage = "Không nhận được phản hồi từ server!";
      } else {
        // Lỗi khác
        errorMessage = error.message;
      }

      alert(`Lỗi: ${errorMessage}`);
    }
  };

  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await api.get("api/dropdowns/tournaments");
        setTournaments(res.data.data); // mảng [{id, name}, ...]
      } catch (err) {
        console.error("Error fetching tournaments:", err);
      }
    };
    fetchTournaments();
  }, []);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await api.get("api/dropdowns/positions");
        setPositions(res.data.data); // Lưu mảng [{id, name}, ...]
      } catch (err) {
        console.error("Error fetching positions:", err);
      }
    };
    fetchPositions();
  }, []);
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
          <p className="text-2xl text-[#2B3674] font-bold">Add Player</p>

          <div className="flex flex-col items-center justify-center w-[40%]">
            <form
              className="flex flex-col gap-2 text-[#2B3674]"
              onSubmit={handleSubmit}
            >
              {/* ==== Thông tin cơ bản ==== */}
              <label className="flex flex-col w-120 mx-auto">
                PlayerName
                <input
                  type="text"
                  className={`border-1 h-8 rounded-md ${
                    errors.playerName ? "border-red-500" : ""
                  }`}
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setErrors((prev) => ({ ...prev, playerName: false }));
                  }}
                  ref={playerNameRef}
                />
              </label>

              <label className="flex flex-col w-120 mx-auto">
                Bio
                <textarea
                  className={`border-1 h-20 rounded-md ${
                    errors.bio ? "border-red-500" : ""
                  }`}
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    setErrors((prev) => ({ ...prev, bio: false }));
                  }}
                  ref={bioRef}
                ></textarea>
              </label>

              <div className="flex items-center gap-4">
                <label className="flex flex-col w-16">
                  Number
                  <input
                    type="text"
                    className={`border-1 h-8 rounded-md ${
                      errors.number ? "border-red-500" : ""
                    }`}
                    value={number}
                    onChange={(e) => {
                      setNumber(e.target.value);
                      setErrors((prev) => ({ ...prev, number: false }));
                    }}
                    ref={numberRef}
                  />
                </label>

                <label className="flex flex-col w-35 ml-5 h-14">
                  Position
                  <select
                    className={`flex-1 w-full h-12 rounded-md border ${
                      errors.position ? "border-red-500" : "border-gray-300"
                    }`}
                    value={position}
                    onChange={(e) => {
                      setPosition(e.target.value);
                      setErrors((prev) => ({ ...prev, position: false }));
                    }}
                    ref={positionRef}
                  >
                    <option value="">Choose</option>
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* === Background Upload === */}
                <label className="w-26 flex flex-col items-center text-sm text-[#2B3674]">
                  Background
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBackgroundChange}
                  />
                  <div
                    className={`w-24 h-24 border-1 rounded-md cursor-pointer flex items-center justify-center overflow-hidden ${
                      errors.background ? "border-red-500" : ""
                    }`}
                    onClick={handleBackgroundClick}
                    ref={backgroundRef}
                  >
                    {backgroundPreview ? (
                      <img
                        src={backgroundPreview}
                        alt="Background Preview"
                        className="object-cover w-24 h-24 border-1 rounded-md"
                      />
                    ) : (
                      <p className="text-gray-500">Add</p>
                    )}
                  </div>
                  {backgroundName && (
                    <p className="mt-1 text-xs text-gray-600 truncate w-24 text-center">
                      {backgroundName}
                    </p>
                  )}
                </label>

                {/* === Bio Image Upload === */}
                <label className="w-26 flex flex-col items-center text-sm text-[#2B3674]">
                  Bio Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBioChange}
                  />
                  <div
                    className={`w-24 h-24 border-1 rounded-md cursor-pointer flex items-center justify-center overflow-hidden ${
                      errors.bioImage ? "border-red-500" : ""
                    }`}
                    onClick={handleBioClick}
                    ref={bioImageRef}
                  >
                    {bioPreview ? (
                      <img
                        src={bioPreview}
                        alt="Bio Preview"
                        className="object-cover w-24 h-24"
                      />
                    ) : (
                      <p className="text-gray-500">Add</p>
                    )}
                  </div>
                  {bioName && (
                    <p className="mt-1 text-xs text-gray-600 truncate w-24 text-center">
                      {bioName}
                    </p>
                  )}
                </label>
              </div>

              {/* ==== Thông tin khác ==== */}
              <div className="flex flex-col items-center justify-center">
                <label>Information</label>
                <div
                  className={`flex w-120 border-1 h-14 rounded-md ${
                    errors.dob ||
                    errors.location ||
                    errors.nationality ||
                    errors.joined
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                >
                  <label className="w-30 text-sm flex flex-col items-center justify-center">
                    Date of birth
                    <input
                      type="date"
                      className="w-29"
                      value={dob}
                      onChange={(e) => {
                        setDob(e.target.value);
                        setErrors((prev) => ({ ...prev, dob: false }));
                      }}
                      ref={dobRef}
                    />
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
                    <input
                      type="date"
                      value={joined}
                      onChange={(e) => {
                        setJoined(e.target.value);
                        setErrors((prev) => ({ ...prev, joined: false }));
                      }}
                      ref={joinedRef}
                    />
                  </label>
                </div>

                {/* Input Location / Nationality toggle */}
                <input
                  id="toggleLocation"
                  name="infoType"
                  type="radio"
                  className="peer/location hidden border-1 rounded-md"
                />
                <input
                  id="toggleNationality"
                  name="infoType"
                  type="radio"
                  className="peer/nationality hidden border-1 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Enter location..."
                  className="border-2 hidden peer-checked/location:block mt-2 w-full text-sm italic"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors((prev) => ({ ...prev, location: false }));
                  }}
                  ref={locationRef}
                />
                <input
                  type="text"
                  placeholder="Enter nationality..."
                  className="border-2 hidden peer-checked/nationality:block mt-2 w-full text-sm italic"
                  value={nationality}
                  onChange={(e) => {
                    setNationality(e.target.value);
                    setErrors((prev) => ({ ...prev, nationality: false }));
                  }}
                  ref={nationalityRef}
                />
              </div>

              {/* ==== Stats popup ==== */}
              <div
                className="border-1 flex items-center justify-center cursor-pointer rounded-md w-120 m-auto"
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

                  {/* Danh sách giải đấu đã hoàn thành */}
                  {completedLeagues.map((league) => (
                    <div
                      key={league.id}
                      value={league.leagueName}
                      className="flex items-center gap-2 border-1 p-2 rounded-md bg-gray-50 text-sm w-120 mt-2"
                    >
                      <span className="font-medium">{league.leagueName}</span>
                      <span className="text-gray-600">
                        {league.matches || 0} Match • {league.goals || 0} Goal •{" "}
                        {league.assists || 0} Assists
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCompletedLeague(league.id)}
                        className="ml-auto text-red-500 hover:text-red-700 font-bold"
                      >
                        x
                      </button>
                    </div>
                  ))}

                  {/* Dòng nhập giải đấu mới */}
                  <div className="flex gap-2 items-center p-2">
                    <label className="flex flex-col w-32 ml-5 h-9">
                      <select
                        className={`flex-1 w-full h-12 rounded-md border ${
                          errors.tournament
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        value={currentInput.tournamentId || ""}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedName =
                            tournaments.find(
                              (t) => t.id.toString() === selectedId
                            )?.name || "";

                          // ✅ Gán cả id và name vào currentInput
                          setCurrentInput((prev) => ({
                            ...prev,
                            leagueName: selectedName,
                            tournamentId: selectedId,
                          }));
                          setErrors((prev) => ({ ...prev, tournament: false }));
                        }}
                      >
                        <option value="">Choose</option>
                        {tournaments.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Match"
                      className="border-2 w-20 text-center"
                      value={currentInput.matches}
                      onChange={(e) =>
                        handleInputChange("matches", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Goal"
                      className="border-2 w-20 text-center"
                      value={currentInput.goals}
                      onChange={(e) =>
                        handleInputChange("goals", e.target.value)
                      }
                      disabled={
                        currentInput.matches === "0" ||
                        currentInput.matches === ""
                      }
                      style={{
                        opacity:
                          currentInput.matches === "0" ||
                          currentInput.matches === ""
                            ? 0.5
                            : 1,
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Assists"
                      className="border-2 w-20 text-center"
                      value={currentInput.assists}
                      onChange={(e) =>
                        handleInputChange("assists", e.target.value)
                      }
                      disabled={
                        currentInput.matches === "0" ||
                        currentInput.matches === ""
                      }
                      style={{
                        opacity:
                          currentInput.matches === "0" ||
                          currentInput.matches === ""
                            ? 0.5
                            : 1,
                      }}
                    />
                    <button
                      type="button"
                      onClick={completeCurrentInput}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm w-22"
                      disabled={
                        !currentInput.leagueName.trim() ||
                        currentInput.matches === ""
                      }
                    >
                      Completed
                    </button>
                  </div>

                  {/* Nút đóng popup */}
                  <div
                    className="border-2 cursor-pointer my-10 mx-auto w-25 h-8 flex items-center justify-center bg-green-500 text-white border-1 rounded-md"
                    onClick={hiddenShow}
                  >
                    <p className="m-auto">Enter</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                text={"Add Player"}
                className="m-auto"
              ></Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
