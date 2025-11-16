import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import Search from "./componentAdminUser/Search.jsx";
import UserList from "./componentAdminUser/UserList.jsx";
import SvgAdminOrder from "../assets/svg/SvgAdmin.jsx";
import { Link } from "react-router-dom";
import "../pageRegister/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../Api/logout.js";

export default function AdminUser() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [, setSearching] = useState(false);
  const [users, setUsers] = useState([]); // kết quả search

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} onClick={logout} />
        </div>
        <div className="flex flex-col w-[78%]">
          <div className="flex justify-between w-full items-center mb-6">
            <Search
              onSearchStart={() => setSearching(true)}
              onSearchEnd={() => setSearching(false)}
              endpoint="/api/admin/users/list"
              onResult={(data) => setUsers(data)}
            />

            <Link to={"/admin/user/add"}>
              <Button text={"Add User"} />
            </Link>
          </div>
          <div className="h-[78%]">
            <UserList
              currentPage={currentPage}
              users={users}
              navigate={navigate}
            />
          </div>

          {/* Phân trang - Click mũi tên để chuyển trang */}
          <div className="flex text-center justify-center gap-10 items-center mt-4">
            <SvgAdminOrder
              className="rotate-90 text-amber-50 cursor-pointer hover:text-amber-300 transition"
              onClick={handlePrevPage}
              style={{ opacity: currentPage === 0 ? 0.5 : 1 }}
            />
            <p className="font-bold text-white text-3xs">{currentPage + 1}</p>
            <SvgAdminOrder
              className="rotate-270 text-amber-50 cursor-pointer hover:text-amber-300 transition"
              onClick={handleNextPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
