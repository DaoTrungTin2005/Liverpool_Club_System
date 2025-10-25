import "../output.css";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import FrameX from "../assets/img/FrameX.png";
import Options from "./componentAdminUser/options.jsx";
export default function AddUserAddQuestion(props) {
  const tilte = {
    ...props,
    text01: "Are you sure you want to make the edits?",
    text02:
      "If you cancel now, your progress will be update, and you will have to start over.",
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
          <Options link={"/admin/user"} notlink="/admin/user/add/user/update" />
        </div>
        ;
      </div>
    </>
  );
}
