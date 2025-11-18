import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Search from "./componentAdminMatch/Search.jsx";
import SvgAdminOrder from "../assets/svg/SvgAdmin";
import { SvgAdminDelete } from "../assets/svg/SvgAdmin";
import { SvgAdminView } from "../assets/svg/SvgAdmin";
import { SvgAdminUpdate } from "../assets/svg/SvgAdmin";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../Api/apitoken";
import { logout } from "../Api/logout.js";

export default function AdminMatch() {
  const [matches, setMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const size = 8;

  const fetchMatches = async (search = "", pageNum = 0) => {
    setLoading(true);
    try {
      const response = await api.get(
        `api/matches-and-tickets/list/matches_and_tickets`,
        {
          params: { page: pageNum, size, search },
        }
      );

      if (response.data.status === "success") {
        setMatches(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setPage(response.data.data.number);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const [tournaments, setTournaments] = useState([]);
  const [, setLoadingTournaments] = useState(false);
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await api.get("api/dropdowns/tournaments");
        if (response.data?.status === "success") {
          setTournaments(response.data.data);
        } else {
          console.error("API trả về lỗi:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoadingTournaments(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMatches(searchTerm, page);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handlePrev = () => page > 0 && setPage(page - 1);
  const handleNext = () => page < totalPages - 1 && setPage(page + 1);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
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
            <Search onSearch={handleSearch} />
            <Link to={"/admin/match/add"}>
              <Button text="Add"></Button>
            </Link>
          </div>

          <div className="flex flex-col bg-white mx-4 h-[80%] rounded-3xl">
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
              Match List
            </p>

            {/* Header */}
            <div className="grid mx-6 text-[#A3AED0] grid-cols-7 py-3 text-sm transition border border-transparent">
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

            {/* Body - Dữ liệu động */}
            {loading ? (
              <div className="text-center py-10 text-gray-500">Đang tải...</div>
            ) : matches.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Không có dữ liệu
              </div>
            ) : (
              matches.map((match) => (
                <div
                  key={match.matchId}
                  className=" grid-flow-col grid grid-cols-7 mx-6 py-3 text-sm hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                >
                  <div>{match.matchId}</div>
                  <div>
                    {tournaments.find((t) => t.id === match.tournamentId).name}
                  </div>
                  <div>{match.homeTeam}</div>
                  <div>{match.awayTeam}</div>
                  <div>{formatDate(match.matchDate)}</div>
                  <div>{match.location}</div>
                  <div className="flex gap-1">
                    <Link
                      to={`/admin/match/update`}
                      state={{ matchId: match.matchId }}
                      className="mr-1"
                    >
                      <SvgAdminUpdate />
                    </Link>
                    <Link
                      to={`/admin/match/delete`}
                      state={{ matchId: match.matchId }}
                      className="ml-2"
                    >
                      <SvgAdminDelete />
                    </Link>
                    <Link
                      to={`/admin/match/view`}
                      state={{ matchId: match.matchId }}
                      className="mt-0.5 ml-2.5"
                    >
                      <SvgAdminView />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex text-center justify-center gap-10 mt-4">
            <button
              onClick={handlePrev}
              disabled={page === 0 || loading}
              className="disabled:opacity-50"
            >
              <SvgAdminOrder className="rotate-90 text-amber-50" />
            </button>
            <p className="font-bold text-white text-3xs">
              {page + 1} / {totalPages}
            </p>
            <button
              onClick={handleNext}
              disabled={page >= totalPages - 1 || loading}
              className="disabled:opacity-50"
            >
              <SvgAdminOrder className="rotate-270 text-amber-50" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
