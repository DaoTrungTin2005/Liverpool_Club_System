import "../output.css";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import FrameX from "../assets/img/FrameX.png";
import { useLocation, useNavigate } from "react-router-dom";
import Options from "./componentAdminUser/options.jsx";
import api from "../Api/apitoken.js";

export default function AddUserAddQuestion() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userData = state?.userData;

  const handleYes = async () => {
    try {
      await api.post("/api/admin/users/add", {
        fullName: userData?.fullName?.trim(),
        email: userData?.email?.trim(),
        role: (userData?.role || "USER").toUpperCase(),
        password: userData?.password,
      });

      alert("Thêm người dùng thành công!");
      navigate("/admin/user");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;

      if (err.response?.status === 401) {
        alert("Phiên hết hạn rồi nha!");
        return;
      }

      if (err.response?.status === 409 || /duplicate|exists/i.test(msg)) {
        alert("Email này đã được dùng rồi!");
      } else {
        alert("Lỗi: " + (msg || "Không thêm được user"));
      }
    }
  };

  const handleNo = () => navigate(-1);
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
