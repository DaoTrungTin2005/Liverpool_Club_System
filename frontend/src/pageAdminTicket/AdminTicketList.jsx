import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Search from "../pageAdminUser/componentAdminUser/Search";
import SvgAdminOrder from "../assets/svg/SvgAdmin";
import { SvgAdminUpdate } from "../assets/svg/SvgAdmin";
import { Link } from "react-router-dom";
export default function AdminTicketList() {
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
          </div>
          <div className="flex flex-col bg-white mx-4 h-[80%] rounded-3xl">
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
              Ticket List
            </p>
            {/* Header */}
            <div className="grid auto-cols-auto grid-flow-col mx-6 text-[#A3AED0] grid-cols-6 w-full">
              <div className=" flex items-center">
                TicketArea
                <SvgAdminOrder className="ml-1" />
              </div>
              <div className="flex items-center">
                MatchID <SvgAdminOrder className="ml-1" />
              </div>
              <div className="">Quantity</div>
              <div className="flex items-center">
                Sold <SvgAdminOrder className="ml-1" />
              </div>
              <div className=" flex items-center">
                Price <SvgAdminOrder className="ml-1" />
              </div>
              <div className="">Action</div>
            </div>
            {/* Body */}
            <div className="grid grid-cols-6 py-2.75 w-full grid-flow-col mx-6">
              <div className="flex items-center">001A</div>
              <div>LivManci</div>
              <div>1200</div>
              <div>200</div>
              <div>12.000.000</div>
              <div className="ml-4">
                <Link to={"/admin/ticket/update"}>
                  <SvgAdminUpdate className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
