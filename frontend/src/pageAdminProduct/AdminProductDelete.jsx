import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01.jsx";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage.jsx";
import Button from "../pageAdminUser/componentAdminUser/Button.jsx";
import FrameX from "../assets/img/FrameX.png";
import { logout } from "../Api/logout.js";
export default function AdminProductDelete(props) {
  const tilte = {
    ...props,
    text01: "You want delete?",
    text02:
      "If you cancel now, your progress will be deleted, and you will have to start over.",
  };
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
        </div>
        ;
      </div>
    </>
  );
}
