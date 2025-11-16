import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Search from "./componentAdminTicket/Search.jsx";
import SvgAdminOrder from "../assets/svg/SvgAdmin";
import { SvgAdminUpdate } from "../assets/svg/SvgAdmin";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../Api/apitoken";
import { logout } from "../Api/logout.js";

export default function AdminTicketList() {
  // === STATE QUẢN LÝ DỮ LIỆU ===
  const [tickets, setTickets] = useState([]); // Danh sách vé
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm (khu vực hoặc tên trận)
  const [page, setPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái đang tải
  const size = 10; // Số vé mỗi trang

  // === GỌI API CHÍNH XÁC THEO LINK BẠN ĐÃ CUNG CẤP ===
  const fetchTickets = async (search = "", pageNum = 0) => {
    setLoading(true);
    try {
      const response = await api.get("api/matches-and-tickets/list/tickets", {
        params: {
          page: pageNum,
          size,
          search, // Tìm theo sectionName hoặc matchDisplay
        },
      });
      console.log(response.data);
      if (response.data) {
        setTickets(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
        setPage(response.data.number || 0);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể tải danh sách vé");
    } finally {
      setLoading(false);
    }
  };

  // === TỰ ĐỘNG GỌI LẠI KHI SEARCH HOẶC ĐỔI TRANG (debounce 400ms) ===
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets(searchTerm, page);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  // === XỬ LÝ TÌM KIẾM TỪ Ô SEARCH ===
  const handleSearch = (value) => {
    setSearchTerm(value.trim());
    setPage(0); // Reset về trang đầu khi tìm kiếm
  };

  // === CHUYỂN TRANG ===
  const handlePrev = () => page > 0 && setPage(page - 1);
  const handleNext = () => page < totalPages - 1 && setPage(page + 1);

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        {/* === SIDEBAR === */}
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text="Log Out" onClick={logout} />
        </div>

        {/* === MAIN CONTENT === */}
        <div className="flex flex-col w-[78%]">
          {/* === SEARCH BAR === */}
          <div className="flex justify-between w-full items-center mb-6">
            <Search onSearch={handleSearch} />
          </div>

          {/* === TABLE CONTAINER === */}
          <div className="flex flex-col bg-white mx-4 h-[80%] rounded-3xl overflow-hidden">
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-2">
              Ticket List
            </p>

            {/* === TABLE HEADER === */}
            <div className="grid grid-cols-6 mx-6 text-[#A3AED0] font-medium text-sm pb-2">
              <div className="flex items-center">
                TicketArea <SvgAdminOrder className="ml-1 w-4 h-4" />
              </div>
              <div className="flex items-center">
                Match <SvgAdminOrder className="ml-1 w-4 h-4" />
              </div>
              <div>Quantity</div>
              <div className="flex items-center">
                Sold <SvgAdminOrder className="ml-1 w-4 h-4" />
              </div>
              <div className="flex items-center">
                Price <SvgAdminOrder className="ml-1 w-4 h-4" />
              </div>
              <div>Action</div>
            </div>

            {/* === TABLE BODY === */}
            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No tickets found
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.ticketSettingId}
                  className="grid grid-cols-6 mx-6 py-3 text-sm hover:bg-gray-50 transition"
                >
                  {/* Khu vực */}
                  <div className="font-medium">{ticket.sectionName}</div>

                  {/* Tên trận đấu */}
                  <div
                    className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]"
                    title={ticket.matchDisplay}
                  >
                    {ticket.matchDisplay}
                  </div>

                  {/* Tổng số vé */}
                  <div>{ticket.totalQuantity}</div>

                  {/* Số vé đã bán */}
                  <div className="text-green-600 font-medium">
                    {ticket.soldQuantity}
                  </div>

                  {/* Giá vé */}
                  <div className="font-medium">
                    {ticket.price.toLocaleString()} VND
                  </div>

                  {/* Nút sửa */}
                  <div className="flex items-center">
                    <Link
                      to="/admin/ticket/update"
                      state={{ ticketSettingId: ticket.ticketSettingId }}
                    >
                      <SvgAdminUpdate className="w-5 h-5 text-blue-600" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* === PAGINATION === */}
          <div className="flex justify-center items-center gap-8 mt-4">
            <button
              onClick={handlePrev}
              disabled={page === 0 || loading}
              className="disabled:opacity-50 hover:scale-110 transition"
            >
              <SvgAdminOrder className="rotate-90 w-6 h-6 text-amber-50" />
            </button>

            <p className="font-bold text-white text-sm">
              Page {page + 1} / {totalPages}
            </p>

            <button
              onClick={handleNext}
              disabled={page >= totalPages - 1 || loading}
              className="disabled:opacity-50 hover:scale-110 transition"
            >
              <SvgAdminOrder className="rotate-270 w-6 h-6 text-amber-50" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
