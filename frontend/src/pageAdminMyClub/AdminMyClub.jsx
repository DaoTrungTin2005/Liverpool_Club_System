import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01.jsx";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage.jsx";
import Button from "../pageAdminUser/componentAdminUser/Button.jsx";
import Search from "../pageAdminUser/componentAdminUser/Search.jsx";
import PlayerList from "./componentMyClub/PlayerList.jsx";
import SvgAdminOrder from "../assets/svg/SvgAdmin.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../pageRegister/Register.css";
export default function AdminMyClub() {
  const navigate = useNavigate();
  const [, setSearching] = useState(false);
  const [players, setPlayers] = useState([]); // kết quả search

  const [currentPage, setCurrentPage] = useState(0);
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
          <Button text={"Log Out"} />
        </div>
        <div className="flex flex-col w-[78%]">
          <div className="flex justify-between w-full items-center mb-6">
            <Search
              onSearchStart={() => setSearching(true)}
              onSearchEnd={() => setSearching(false)}
              endpoint="/api/players/list"
              onResult={(data) => setPlayers(data)}
            />

            <Link to={"/admin/club/add"}>
              <Button text={"Add Player"} />
            </Link>
          </div>
          <div className="h-[78%]">
            <PlayerList
              currentPage={currentPage}
              players={players}
              navigate={navigate}
            />
          </div>
          <div className="flex text-center justify-center gap-10">
            <SvgAdminOrder
              className="rotate-90 text-amber-50"
              onClick={handlePrevPage}
              style={{ opacity: currentPage === 0 ? 0.5 : 1 }}
            />
            <p className="font-bold text-white text-3xs">{currentPage + 1}</p>
            <SvgAdminOrder
              className="rotate-270 text-amber-50"
              onClick={handleNextPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
