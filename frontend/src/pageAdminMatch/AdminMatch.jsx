import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Search from "../pageAdminUser/componentAdminUser/Search";
import SvgAdminOrder from "../assets/svg/SvgAdmin";
import { SvgAdminDelete } from "../assets/svg/SvgAdmin";
import { SvgAdminView } from "../assets/svg/SvgAdmin";
import { SvgAdminUpdate } from "../assets/svg/SvgAdmin";
import { Link } from "react-router-dom";
export default function AdminMatch() {
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
            <Link to={"/admin/match/add"}>
              <Button text="Add"></Button>
            </Link>
          </div>
          <div className="flex flex-col bg-white mx-4 h-[80%] rounded-3xl">
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
              Match List
            </p>
            {/* Header */}
            <div className="grid auto-cols-auto grid-flow-col mx-6 text-[#A3AED0] grid-cols-7 w-full">
              <div className=" flex items-center">
                MatchID
                <SvgAdminOrder className="ml-1" />
              </div>
              <div className="flex items-center">
                Tournament <SvgAdminOrder className="ml-1" />
              </div>
              <div className="">Home</div>
              <div className="flex items-center">
                Away <SvgAdminOrder className="ml-1" />
              </div>
              <div className=" flex items-center">
                Date <SvgAdminOrder className="ml-1" />
              </div>
              <div className=" flex items-center">
                Location <SvgAdminOrder className="ml-1" />
              </div>
              <div className="">Action</div>
            </div>
            {/* Body */}
            <div className="grid grid-cols-7 py-2.75 w-full grid-flow-col mx-6">
              <div className="flex items-center">LivManci</div>
              <div>Champions League</div>
              <div>Liverpool</div>
              <div>ManDan</div>
              <div>12/12/1912</div>
              <div>Anfield</div>
              <div className="flex gap-1">
                <Link to={"/admin/match/update"} className="mr-1">
                  <SvgAdminUpdate />
                </Link>
                <Link to={"/admin/match/delete"}>
                  <SvgAdminDelete className="w-5 h-5" />
                </Link>
                <Link to={"/admin/match/view"} className="mt-0.5 ml-2">
                  <SvgAdminView />
                </Link>
              </div>
            </div>
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
