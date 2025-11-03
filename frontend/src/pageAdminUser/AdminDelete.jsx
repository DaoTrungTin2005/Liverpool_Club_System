import "../output.css";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import FrameX from "../assets/img/FrameX.png";
import Options from "./componentAdminUser/options.jsx";
import api from "../Api/apitoken.js";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
export default function AddUserAddQuestion(props) {
  const tilte = {
    ...props,
    text01: "You want delete?",
    text02:
      "If you cancel now, your progress will be deleted, and you will have to start over.",
  };
  const { state } = useLocation();
  const navigate = useNavigate();

  const userId = state?.userId;
  const user = state?.user;

  const [deleting, setDeleting] = useState(false);

  // === HÀM XÁC NHẬN XÓA ===
  const onConfirm = async () => {
    if (!userId || deleting) return;
    setDeleting(true);

    try {
      await api.delete(`/api/admin/users/delete/${userId}`);
      alert(`Đã xóa user: ${user?.fullName || userId}`);
      navigate("/admin/user");
    } catch (err) {
      console.error("Xóa thất bại:", err);
      alert("Xóa thất bại. Vui lòng thử lại.");
    } finally {
      setDeleting(false);
    }
  };

  // === HÀM HỦY ===
  const onCancel = () => {
    navigate("/admin/user");
  };

  // Nếu không có dữ liệu → về danh sách
  if (!userId) {
    navigate("/admin/user");
    return null;
  }

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} />
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
