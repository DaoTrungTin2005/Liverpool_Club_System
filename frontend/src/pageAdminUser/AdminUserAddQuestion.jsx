import "../output.css";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import FrameX from "../assets/img/FrameX.png";
import { useLocation, useNavigate } from "react-router-dom";
import Options from "./componentAdminUser/options.jsx";
import axios from "axios";

export default function AddUserAddQuestion() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;

  // Bảo vệ: nếu không có dữ liệu → quay lại
  if (!userData) {
    navigate("/admin/user/add");
    return null;
  }

  const handleYes = async () => {
    if (!userData?.email) {
      alert("Invalid email.");
      navigate("/admin/user/add");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      // BƯỚC 1: KIỂM TRA EMAIL TRÙNG (nếu backend có API)
      // Nếu không có → vẫn gửi API và bắt lỗi 409/400
      const res = await axios.post(
        "https://0d9ffd8a6329.ngrok-free.app/api/admin/users/add",
        {
          fullName: userData.fullName?.trim(),
          email: userData.email?.trim(),
          role: (userData.role || "USER").toUpperCase(),
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (res.status === 201 || res.data.success) {
        alert("User added successfully!");
        navigate("/admin/user");
      }
    } catch (err) {
      console.error("API Error:", err);
      const msg = err.response?.data?.message || err.message;

      // BẮT LỖI TRÙNG EMAIL
      if (
        msg?.includes("Duplicate entry") ||
        msg?.includes("already exists") ||
        err.response?.status === 409
      ) {
        alert("Lỗi: Email này đã được sử dụng!");
      } else {
        alert("Thêm người dùng thất bại: " + msg);
        navigate("/admin/user/add");
      }
    }
  };

  const handleNo = () => {
    navigate("/admin/user/add");
  };
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex min-h-screen">
        {/* ==== SIDEBAR ==== */}
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text="Log Out" />
        </div>

        {/* ==== MAIN CONTENT ==== */}
        <div className="w-[60%] bg-white mx-auto my-20 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-5">
          {/* Tiêu đề */}
          <h1 className="text-[#636363] font-bold text-3xl">
            Accept Question ?
          </h1>

          {/* Cảnh báo */}
          <p className="text-[#98A0B4] italic text-sm">You really add user?</p>
          <img src={FrameX} alt="FrameX" />
          {/* Truyền hành động vào Options */}
          <Options onConfirm={handleYes} onCancel={handleNo} />
        </div>
      </div>
    </>
  );
}
