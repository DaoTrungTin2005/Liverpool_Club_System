import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01.jsx";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage.jsx";
import Button from "../pageAdminUser/componentAdminUser/Button.jsx";
import FrameX from "../assets/img/FrameX.png";
import Options from "../pageAdminUser/componentAdminUser/options.jsx";
import api from "../Api/apitoken.js";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../Api/logout.js";
export default function AdminMatchDelete(props) {
  const tilte = {
    ...props,
    text01: "You want delete?",
    text02:
      "If you cancel now, your progress will be deleted, and you will have to start over.",
  };
  const { state } = useLocation();
  const navigate = useNavigate();

  const matchId = state?.matchId;
  const match = state?.match;

  const [deleting, setDeleting] = useState(false);

  // === HÀM XÁC NHẬN XÓA ===
  const onConfirm = async () => {
    if (!matchId || deleting) return;
    setDeleting(true);

    try {
      await api.delete(`api/matches-and-tickets/delete/${matchId}`);
      alert(`Đã xóa match: ${match?.fullName || matchId}`);
      navigate("/admin/match");
    } catch (err) {
      console.error("Xóa thất bại:", err);
      alert("Xóa thất bại. Vui lòng thử lại.");
    } finally {
      setDeleting(false);
    }
  };

  // === HÀM HỦY ===
  const onCancel = () => {
    navigate("/admin/match");
  };

  // Nếu không có dữ liệu → về danh sách
  if (!matchId) {
    navigate("/admin/match");
    return null;
  }
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} onClick={logout} />
        </div>
        <div className="w-[60%] bg-white mx-auto my-20 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-5">
          <p className="text-[#636363] font-bold text-3xl">{tilte.text01}</p>
          <p className="text-[#98A0B4] italic text-sm">{tilte.text02}</p>
          <img src={FrameX} alt="FrameX" />
          <Options onConfirm={onConfirm} onCancel={onCancel} />
        </div>
        ;
      </div>
    </>
  );
}
