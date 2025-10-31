import "../../output.css";
import { SvgAdminUpdate } from "../../assets/svg/SvgAdmin.jsx";
import { SvgAdminDelete } from "../../assets/svg/SvgAdmin.jsx";
import { SvgAdminView } from "../../assets/svg/SvgAdmin.jsx";
import SvgAdminOrder from "../../assets/svg/SvgAdmin.jsx";
import { Link } from "react-router-dom";
export default function PlayerList() {
  return (
    <div className="flex flex-col bg-white mx-4 h-full rounded-3xl overflow-hidden">
      <p className="mx-6 text-[#2B3674] font-bold text-2xl my-3">Player List</p>

      {/* Bảng */}
      <div className="mx-2 ml-6 overflow-x-auto">
        <div className="grid grid-cols-[repeat(10,minmax(0,1fr))] min-w-full text-[#2B3674] text-sm">
          {/* ===== Header ===== */}
          <div className="font-semibold text-[#A3AED0] flex items-center">
            PlayerID <SvgAdminOrder />
          </div>
          <div className="font-semibold text-[#A3AED0] flex items-center ">
            PlayerName <SvgAdminOrder />
          </div>
          <div className="font-semibold text-[#A3AED0] ">Bio</div>
          <div className="font-semibold text-[#A3AED0] ">Information</div>
          <div className="font-semibold text-[#A3AED0] ">Stats</div>
          <div className="font-semibold text-[#A3AED0] ">Number</div>
          <div className="font-semibold text-[#A3AED0] ">Position</div>
          <div className="font-semibold text-[#A3AED0] ">Background</div>
          <div className="font-semibold text-[#A3AED0] ">Bio Image</div>
          <div className="font-semibold text-[#A3AED0] flex items-center ">
            Action <SvgAdminOrder />
          </div>

          {/* ===== Data Row ===== */}
          <div className="truncate py-2 ">001A</div>
          <div className="truncate py-2 ">DaoTinTrung</div>
          <div className="truncate py-2 ">Is the um bo</div>
          <div className="truncate py-2 ">...View more</div>
          <div className="truncate py-2 ">...View more</div>
          <div className="truncate py-2 ">11</div>
          <div className="truncate py-2 ">Attack</div>
          <div className="truncate py-2 ">Img.ten</div>
          <div className="truncate py-2 ">Img.ten</div>
          <div className="flex items-center justify-center gap-2 mr-10 ">
            <Link to={"/admin/club/update"}>
              <SvgAdminUpdate />
            </Link>
            <Link to={"/admin/club/delete"}>
              <SvgAdminDelete />
            </Link>
            <Link to={"/admin/club/view"} className="mt-2 ml-2">
              <SvgAdminView />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
