import "../../output.css";
import { SvgAdminUpdate } from "../../assets/svg/SvgAdmin.jsx";
import { SvgAdminDelete } from "../../assets/svg/SvgAdmin.jsx";
import { SvgAdminView } from "../../assets/svg/SvgAdmin.jsx";
import SvgAdminOrder from "../../assets/svg/SvgAdmin.jsx";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../Api/apitoken.js";
export default function PlayerList({
  currentPage,
  players: externalPlayers,
  navigate,
}) {
  const [players, setPlayers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayers = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/players/list", {
        params: { page, size: 10 },
      });

      if (response.data.status === "success") {
        setPlayers(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError("Lấy dữ liệu thất bại");
        setPlayers([]);
      }
    } catch (err) {
      console.error("Axios error:", err);
      if (err.response?.status === 401) {
        setError("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
        localStorage.removeItem("authToken");
        window.location.href = "/";
      } else if (err.response?.status === 404) {
        setError("API không tồn tại (404).");
      } else {
        setError("Lỗi: " + err.message);
      }
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!externalPlayers || externalPlayers.length === 0) {
      fetchPlayers(currentPage);
    } else {
      setPlayers(externalPlayers);
    }
  }, [currentPage, externalPlayers]);
  const handleUpdate = async (playerId) => {
    try {
      if (!playerId) {
        alert("Không có ID người dùng hợp lệ");
        return;
      }

      const res = await api.get(`/api/players/${playerId}`);
      const fullPlayerData = res.data.data;
      console.log("Dữ liệu user:", fullPlayerData);

      navigate("/admin/club/update", {
        state: {
          playerId,
          player: fullPlayerData,
        },
      });
    } catch (err) {
      console.error("Lỗi lấy dữ liệu user:", err);
      alert("Không tải được thông tin user");
    }
  };
  const handleDelete = async (playerId) => {
    try {
      if (!playerId) {
        alert("Không có ID người dùng hợp lệ");
        return;
      }

      const res = await api.get(`/api/players/${playerId}`);
      const fullPlayerData = res.data.data;
      console.log("Dữ liệu user:", fullPlayerData);

      navigate("/admin/club/delete", {
        state: {
          playerId,
          player: fullPlayerData,
        },
      });
    } catch (err) {
      console.error("Lỗi lấy dữ liệu user:", err);
      alert("Không tải được thông tin user");
    }
  };
  const handleView = async (playerId) => {
    try {
      if (!playerId) {
        alert("Không có ID người dùng hợp lệ");
        return;
      }

      const res = await api.get(`/api/players/${playerId}`);
      const fullPlayerData = res.data.data;
      console.log("Dữ liệu user:", fullPlayerData);

      navigate("/admin/club/view", {
        state: {
          playerId,
          player: fullPlayerData,
        },
      });
    } catch (err) {
      console.error("Lỗi lấy dữ liệu user:", err);
      alert("Không tải được thông tin user");
    }
  };
  return (
    <div className="flex flex-col bg-white mx-4 h-full rounded-3xl overflow-hidden">
      <p className="mx-6 text-[#2B3674] font-bold text-2xl my-3">Player List</p>

      {/* Bảng */}
      <div className="mx-2 ml-6 overflow-x-auto">
        <div className="grid grid-cols-[repeat(10,minmax(0,1fr))] min-w-full text-[#2B3674] text-sm">
          {/* ===== Header ===== */}
          <div className="font-semibold text-[#A3AED0] flex items-center">
            PlayerID <SvgAdminOrder />
          </div>
          <div className="font-semibold text-[#A3AED0] flex items-center ">
            PlayerName <SvgAdminOrder />
          </div>
          <div className="font-semibold text-[#A3AED0] ">Bio</div>
          <div className="font-semibold text-[#A3AED0] ">Information</div>
          <div className="font-semibold text-[#A3AED0] ">Stats</div>
          <div className="font-semibold text-[#A3AED0] ">Number</div>
          <div className="font-semibold text-[#A3AED0] ">Position</div>
          <div className="font-semibold text-[#A3AED0] ">Background</div>
          <div className="font-semibold text-[#A3AED0] ">Bio Image</div>
          <div className="font-semibold text-[#A3AED0] flex items-center ">
            Action <SvgAdminOrder />
          </div>
        </div>

        {/* ===== Data Row ===== */}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-64 text-red-500 text-sm">
            <p>Lỗi: {error}</p>
            <p className="mt-1">Xem Console (F12) để chi tiết</p>
          </div>
        ) : players.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Không có dữ liệu</p>
          </div>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className="grid grid-cols-[repeat(10,minmax(0,1fr))] text-[#2B3674] text-sm py-1 grid grid-cols-6 text-sm hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
            >
              <div className="truncate py-2 ">{player.id}</div>
              <div className="truncate py-2 ">{player.playerName}</div>
              <div className="truncate py-2 ">{player.bio}</div>
              <div className="truncate py-2 ">...view more</div>
              <div className="truncate py-2 ">...view more</div>
              <div className="truncate py-2 ">{player.shirtNumber}</div>
              <div className="truncate py-2 ">{player.position}</div>
              <div className="truncate py-2 ">
                {player.backgroundImage.trim()}
              </div>
              <div className="truncate py-2 ">{player.bioImage.trim()}</div>
              <div className="flex items-center justify-center gap-2 mr-10 ">
                <Link onClick={() => handleUpdate(player.id)}>
                  <SvgAdminUpdate />
                </Link>
                <Link onClick={() => handleDelete(player.id)}>
                  <SvgAdminDelete />
                </Link>
                <Link
                  onClick={() => handleView(player.id)}
                  className="mt-2 ml-2"
                >
                  <SvgAdminView />
                </Link>
              </div>
            </div>
          ))
        )}

        <div className="mt-auto mx-6 mb-2 text-sm text-gray-500 text-right">
          Trang {currentPage + 1} / {totalPages}
        </div>
      </div>
    </div>
  );
}
