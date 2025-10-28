import "../../output.css";
import { SvgAdminUpdate } from "../../assets/svg/SvgAdmin.jsx";
import { SvgAdminDelete } from "../../assets/svg/SvgAdmin.jsx";
import SvgAdminOrder from "../../assets/svg/SvgAdmin.jsx";
import { Link } from "react-router-dom";
export default function UserList() {
  return (
    <>
      <div className="flex flex-col bg-white mx-4 h-full rounded-3xl">
        <p className=" mx-6 text-[#2B3674] font-bold text-2xl my-2">
          User Details
        </p>
        <div className="grid auto-cols-auto grid-flow-col mx-6 text-[#A3AED0] grid-cols-[1fr_2fr_3fr_1fr_1fr_0.75fr]  w-full">
          <div className="... flex items-center">
            UID
            <SvgAdminOrder></SvgAdminOrder>
          </div>
          <div className="... flex items-center">
            Full Name <SvgAdminOrder></SvgAdminOrder>
          </div>
          <div className="... ">Address Email</div>
          <div className="... flex items-center">
            Role <SvgAdminOrder></SvgAdminOrder>
          </div>
          <div className="... flex items-center">
            Status <SvgAdminOrder></SvgAdminOrder>
          </div>
          <div className="...">Action</div>
        </div>
        <div className="grid grid-cols-[1fr_2fr_3fr_1fr_1fr_0.75fr] my-2 mx-6 w-full grid-flow-col">
          <div>001A</div>
          <div>DaoTinTrung0713</div>
          <div>TinDaoDiDai@5611.com</div>
          <div>User</div>
          <div>Online</div>
          <div className="flex">
            <Link to={"/admin/user/update"}>
              <SvgAdminUpdate />
            </Link>
            <Link to={"/admin/user/delete"}>
              <SvgAdminDelete />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
