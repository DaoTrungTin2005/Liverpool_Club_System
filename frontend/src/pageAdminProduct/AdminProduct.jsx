import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Search from "../pageAdminTicket/componentAdminTicket/Search.jsx";
import SvgAdminOrder, {
  SvgAdminDelete,
  SvgAdminView,
} from "../assets/svg/SvgAdmin";
import { SvgAdminUpdate } from "../assets/svg/SvgAdmin";
import { Link } from "react-router-dom";
import { logout } from "../Api/logout.js";
export default function AdminProduct() {
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text="Log Out" onClick={logout} />
        </div>
        <div className="flex flex-col w-[78%]">
          <div className="flex justify-between w-full items-center mb-6">
            <Search />
            <div>
              <Button
                text="Shopping"
                className="cursor-pointer"
                onClick={() =>
                  (window.location.href = "/admin/product/shopping")
                }
              />
              <Button
                text="Add Product"
                className="cursor-pointer"
                onClick={() => (window.location.href = "/admin/product/add")}
              />
            </div>
          </div>
          <div className="flex flex-col bg-white mx-4 h-[80%] rounded-3xl overflow-hidden">
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
              Product List
            </p>

            {/* === TABLE HEADER === */}
            <div className="grid grid-cols-10 mx-6 text-[#A3AED0] font-medium text-sm pb-2">
              <div className="flex items-center">IDProduct</div>
              <div className="flex items-center">Name</div>
              <div className="flex items-center mr-2">BioProduct</div>
              <div className="flex items-center">Price</div>
              <div className="flex items-center">Quantity</div>
              <div className="flex items-center">Sold</div>
              <div className="flex items-center">TypeProduct</div>
              <div className="flex items-center">Size</div>
              <div className="flex items-center mr-2">Image</div>
              <div className="flex items-center pl-5">Action</div>
            </div>
            <div className="grid grid-cols-10 mx-6 text-[#A3AED0] font-medium text-sm pb-2 py-3">
              <p className="flex items-center">TinDao</p>
              <p className="flex items-center">CucCutTinDao</p>
              <p className="flex items-center truncate mr-2">
                Run the CLI tool to scan your source files for classes and build
                your CSS.
              </p>
              <p className="flex items-center">300000</p>
              <p className="flex items-center">2700</p>
              <p className="flex items-center">700</p>
              <p className="flex items-center">Ball</p>
              <p className="flex items-center">15</p>
              <p className="flex items-center truncate mr-2">
                canthofootball.img
              </p>
              <div className="flex items-center gap-2 mr-2 pl-5">
                <Link to={"/admin/product/update"}>
                  {" "}
                  <SvgAdminUpdate className="cursor-pointer mr-4" />
                </Link>
                <Link to={"/admin/product/delete"}>
                  <SvgAdminDelete className="cursor-pointer" />
                </Link>
                <div className="pt-2 ml-2">
                  <Link to={"/admin/product/view"}>
                    {" "}
                    <SvgAdminView className="cursor-pointer" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
