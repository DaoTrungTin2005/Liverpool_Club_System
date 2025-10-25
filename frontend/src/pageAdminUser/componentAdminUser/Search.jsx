import "../../output.css";
import { SvgAdminSearch01 } from "../../assets/svg/SvgAdmin.jsx";
import { SvgAdminSearch02 } from "../../assets/svg/SvgAdmin.jsx";
import Avatar from "../../assets/img/Avatar01.png";
export default function Search() {
  return (
    <>
      <div className="flex gap-2 m-4 p-2 rounded-3xl w-sm bg-white items-center justify-around h-10 mt-10 ">
        <form className="flex items-center gap-2 h-7 w-3xs rounded-2xl bg-[#F4F7FE]">
          <SvgAdminSearch01></SvgAdminSearch01>
          <p className="text-xs text-[#8F9BBA]">Search</p>
          <input className="border-0"></input>
        </form>
        <SvgAdminSearch02></SvgAdminSearch02>
        <img src={Avatar} alt="Avatar" className="w-5 h-5" />
      </div>
    </>
  );
}
