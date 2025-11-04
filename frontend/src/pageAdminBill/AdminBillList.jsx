import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Search from "../pageAdminUser/componentAdminUser/Search";
import { Link } from "react-router-dom";
export default function AdminBillList() {
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} />
        </div>
        <div className="flex flex-col w-[78%]">
          <div className="flex flex-col bg-white mx-4 h-[80%] rounded-3xl my-auto">
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
              Bill List
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
