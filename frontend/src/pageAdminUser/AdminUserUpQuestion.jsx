import "../output.css";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import FrameX from "../assets/img/FrameX.png";
import Options from "./componentAdminUser/options.jsx";
import api from "../Api/apitoken.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function AddUserAddQuestion(props) {
  const navigate = useNavigate();

  const location = useLocation();

  // ✅ Nhận dữ liệu từ trang Update truyền qua
  const { state } = location || {};
  const userId = state?.userId;
  const updateData = state?.updateData;

  const tilte = {
    ...props,
    text01: "Are you sure you want to make the edits?",
    text02:
      "If you cancel now, your progress will be updated, and you will have to start over.",
  };

  // ✅ Hàm xử lý khi người dùng xác nhận
  const handleConfirm = async () => {
    if (!userId || !updateData) {
      alert("Không tìm thấy dữ liệu cập nhật!");
      navigate("/admin/user/update");
      return;
    }

    try {
      console.log("🔹 Gửi dữ liệu update:", updateData);

      // ⚙️ Gọi API PUT update user
      const res = await api.put(`/api/admin/users/edit/${userId}`, {
        fullName: updateData.fullName,
        email: updateData.email,
        role: updateData.role,
      });

      console.log("✅ Phản hồi từ server:", res.data);
      alert("Cập nhật người dùng thành công!");
      navigate("/admin/user");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      alert(err.response?.data?.message || "Cập nhật thất bại!");
      navigate("/admin/user/update");
    }
  };
  const handleCancel = () => {
    navigate("/admin/user/update");
  };

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
          <Options onConfirm={handleConfirm} onCancel={handleCancel} />
        </div>
        ;
      </div>
    </>
  );
}
