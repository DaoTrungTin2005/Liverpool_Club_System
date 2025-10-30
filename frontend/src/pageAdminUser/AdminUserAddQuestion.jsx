import "../output.css";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import FrameX from "../assets/img/FrameX.png";
import Options from "./componentAdminUser/options.jsx";

// Định nghĩa mặc định (default config)
const defaultConfig = {
  text01: "Are you sure you want to add user?",
  text02:
    "If you cancel now, your progress will be deleted, and you will have to start over.",
  link: "/admin/user",
  notlink: "/admin/user/add",
};

export default function AddUserAddQuestion(props) {
  // Gộp props: props từ cha ghi đè default
  const { text01, text02, link, notlink } = { ...defaultConfig, ...props };

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
        <div className="w-[60%] bg-white mx-auto my-20 shadow-2xl rounded-3xl flex flex-col items-center justify-center gap-6 p-8">
          {/* Tiêu đề */}
          <h1 className="text-[#636363] font-bold text-3xl text-center">
            {text01}
          </h1>

          {/* Cảnh báo */}
          <p className="text-[#98A0B4] italic text-sm text-center max-w-md">
            {text02}
          </p>

          {/* Hình ảnh */}
          <img
            src={FrameX}
            alt="Confirmation"
            className="w-32 h-32 object-contain"
          />

          {/* Nút hành động */}
          <Options link={link} notlink={notlink} />
        </div>
      </div>
    </>
  );
}
