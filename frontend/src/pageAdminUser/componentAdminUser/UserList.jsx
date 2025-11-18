import "../../output.css";
import { SvgAdminUpdate, SvgAdminDelete } from "../../assets/svg/SvgAdmin.jsx";
import SvgAdminOrder from "../../assets/svg/SvgAdmin.jsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../Api/apitoken.js";

export default function UserList({
  currentPage,
  users: externalUsers,
  navigate,
}) {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/admin/users/list", {
        params: { page, size: 9 },
      });

      if (response.data.status === "success") {
        setUsers(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
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
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi đổi trang hoặc chưa có users search → gọi API
  useEffect(() => {
    if (!externalUsers || externalUsers.length === 0) {
      fetchUsers(currentPage);
    } else {
      setUsers(externalUsers);
    }
  }, [currentPage, externalUsers]);
  const handleUpdate = async (userId) => {
    try {
      if (!userId) {
        alert("Không có ID người dùng hợp lệ");
        return;
      }

      const res = await api.get(`/api/admin/users/${userId}`);
      const fullUserData = res.data.data;
      console.log("Dữ liệu user:", fullUserData);

      navigate("/admin/user/update", {
        state: {
          userId,
          user: fullUserData,
        },
      });
    } catch (err) {
      console.error("Lỗi lấy dữ liệu user:", err);
      alert("Không tải được thông tin user");
    }
  };
  const handleDelete = async (userId) => {
    try {
      if (!userId) {
        alert("Không có ID người dùng hợp lệ");
        return;
      }

      const res = await api.get(`/api/admin/users/${userId}`);
      const fullUserData = res.data.data;
      console.log("Dữ liệu user:", fullUserData);

      navigate("/admin/user/delete", {
        state: {
          userId,
          user: fullUserData,
        },
      });
    } catch (err) {
      console.error("Lỗi lấy dữ liệu user:", err);
      alert("Không tải được thông tin user");
    }
  };
  return (
    <>
      <div className="flex flex-col bg-white mx-4 h-full rounded-3xl ">
        <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
          User Details
        </p>

        {/* Header */}
        <div className="grid auto-cols-auto grid-flow-col  text-[#A3AED0] grid-cols-[1fr_2fr_3fr_1fr_1fr_0.75fr] mx-6 py-3 text-sm  transition ">
          <div className="... flex items-center">
            UID
            <SvgAdminOrder className="ml-1" />
          </div>
          <div className="... flex items-center">
            Full Name <SvgAdminOrder className="ml-1" />
          </div>
          <div className="...">Address Email</div>
          <div className="... flex items-center">
            Role <SvgAdminOrder className="ml-1" />
          </div>
          <div className="... flex items-center">
            Status <SvgAdminOrder className="ml-1" />
          </div>
          <div className="...">Action</div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-64 text-red-500 text-sm">
            <p>Lỗi: {error}</p>
            <p className="mt-1">Xem Console (F12) để chi tiết</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Không có dữ liệu</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_2fr_3fr_1fr_1fr_0.75fr] grid-flow-col grid grid-cols-6 mx-6 py-3 text-sm hover:bg-gray-50 transition border border-transparent hover:border-gray-200 "
            >
              <div>{user.uid || "-"}</div>
              <div>{user.fullName}</div>
              <div>{user.email}</div>
              <div>{user.role}</div>
              <div>{user.status}</div>
              <div className="flex gap-2">
                <Link onClick={() => handleUpdate(user.id)}>
                  <SvgAdminUpdate className="w-5 h-5" />
                </Link>
                <Link onClick={() => handleDelete(user.id)}>
                  <SvgAdminDelete className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))
        )}

        <div className="mt-auto mx-6 mb-2 text-sm text-gray-500 text-right">
          Trang {currentPage + 1} / {totalPages}
        </div>
      </div>
    </>
  );
}
