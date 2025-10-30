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

export default function AdminMyClubAdd() {
  // === State chính ===
  const [playerName, setPlayerName] = useState("");
  const [bio, setBio] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [joined, setJoined] = useState("");
  const [location, setLocation] = useState("");
  const [nationality, setNationality] = useState("");

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
  const [errors, setErrors] = useState({});

  // === Refs để focus lỗi ===
  const playerNameRef = useRef(null);
  const bioRef = useRef(null);
  const numberRef = useRef(null);
  const dobRef = useRef(null);
  const joinedRef = useRef(null);
  const locationRef = useRef(null);
  const nationalityRef = useRef(null);

  // Hàm xử lý ảnh nền
  function handleBackgroundClick() {
    backgroundRef.current?.querySelector("input")?.click();
  }
  function handleBackgroundChange(e) {
    const file = e.target.files[0];
    if (file) {
      setBackgroundFile(file);
      setBackgroundName(file.name);
      setBackgroundPreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  }

  // Hàm xử lý ảnh tiểu sử
  function handleBioClick() {
    bioImageRef.current?.querySelector("input")?.click();
  }
  function handleBioChange(e) {
    const file = e.target.files[0];
    if (file) {
      setBioFile(file);
      setBioName(file.name);
      setBioPreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  }

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

  // === Xử lý thay đổi input ===
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

  // === Hoàn tất nhập một dòng ===
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

  // === Xóa giải đấu ===
  const removeCompletedLeague = (id) => {
    setCompletedLeagues(completedLeagues.filter((l) => l.id !== id));
  };

  // === Validation ===
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
    };
    const ref = focusMap[firstError];
    if (ref?.current) {
      if (ref.current.click) ref.current.click();
      else ref.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // === Submit ===
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const pending =
      currentInput.leagueName.trim() && currentInput.matches !== ""
        ? [currentInput]
        : [];
    const allLeagues = [...completedLeagues, ...pending];

    if (allLeagues.length === 0) {
      alert("Vui lòng nhập ít nhất 1 giải đấu hợp lệ!");
      return;
    }

    const playerData = {
      playerName: playerName.trim(),
      bio: bio.trim(),
      number: number.trim(),
      backgroundFile: backgroundFile,
      backgroundName: backgroundName.trim(),
      bioFile: bioFile,
      bioName: bioName.trim(),
      information: {
        dob,
        location: location.trim(),
        nationality: nationality.trim(),
        joined,
      },
      leagues: allLeagues.map((l) => ({
        leagueName: l.leagueName,
        matches: parseInt(l.matches) || 0,
        goals: parseInt(l.goals) || 0,
        assists: parseInt(l.assists) || 0,
      })),
    };

    console.log("DỮ LIỆU GỬI ĐI:", playerData);
    alert("Thêm cầu thủ thành công!");

    // CHUYỂN TRANG KHI THÀNH CÔNG
    navigate("/admin/club/add/question");
  };

  const [showStats, setShowStats] = useState(false);
  const hiddenShow = () => {
    setShowStats((prev) => !prev);
  };

  const navigate = useNavigate();
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

              <div className="flex gap-15 items-center">
                <label className="flex flex-col w-30">
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

                {/* === Background Upload === */}
                <label className="w-30 pl-10 flex flex-col items-center text-sm text-[#2B3674]">
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
                <label className="w-30 pl-6 flex flex-col items-center text-sm text-[#2B3674]">
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
              <div className="flex flex-col">
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

                  {completedLeagues.map((league) => (
                    <div
                      key={league.id}
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

                  {/* Dòng nhập */}
                  <div className="flex gap-2 items-center p-2">
                    <select
                      value={currentInput.leagueName}
                      onChange={(e) =>
                        handleInputChange("leagueName", e.target.value)
                      }
                      className="border-2 flex-1 w-30"
                    >
                      <option value="">Choose a tournament</option>
                      <option value="Premier League">Premier League</option>
                      <option value="Champions League">Champions League</option>
                      <option value="FA Cup">FA Cup</option>
                      <option value="Carabao Cup">Carabao Cup</option>
                    </select>
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
