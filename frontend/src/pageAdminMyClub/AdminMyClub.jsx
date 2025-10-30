import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01.jsx";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage.jsx";
import Button from "../pageAdminUser/componentAdminUser/Button.jsx";
import Search from "../pageAdminUser/componentAdminUser/Search.jsx";
import PlayerList from "./componentMyClub/PlayerList.jsx";
import SvgAdminOrder from "../assets/svg/SvgAdmin.jsx";
import { Link } from "react-router-dom";
import "../pageRegister/Register.css";
export default function AdminMyClub() {
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} />
        </div>
        <div className="flex flex-col w-[78%]">
          <div className="flex justify-between w-full items-center mb-6">
            <Search />
            <Link to={"/admin/club/add"}>
              <Button text={"Add Player"} />
            </Link>
          </div>
          <div className="h-[78%]">
            <PlayerList className="" />
          </div>
          <div className="flex text-center justify-center gap-10">
            <SvgAdminOrder className="rotate-90 text-amber-50" />
            <p className="font-bold text-white text-3xs">1</p>
            <SvgAdminOrder className="rotate-270 text-amber-50" />
          </div>
        </div>
      </div>
    </>
  );
}
