import Header from "../componentUserView/Header";
import Footer from "../componentUserView/Footer";
import { useState } from "react";
import api from "../Api/apitoken";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function OrderHistory() {
  // Dữ liệu mẫu đã phân tách đầy đủ các trường bạn yêu cầu
  const [orders, setOrders] = useState([
    {
      paymentId: "ORD-123752735723",
      timePayment: "18/11/2025 19:50",
      homeTeam: "Liverpool FC",
      homeLogo: "/liverpool-logo.png", // hoặc URL thật
      awayTeam: "Real Madrid FC",
      awayLogo: "/madrid-logo.png",
      league: "Champion League",
      timeDay: "28th May 2026",
      timeHours: "20:00 PM",
      stadium: "Anfield Stadium",
      quantity: 2,
      total: 2500,
      status: "PAID", // PAID | CANCELLED | PENDING
    },
    {
      paymentId: "ORD-123752735723",
      timePayment: "18/11/2025 19:50",
      homeTeam: "Liverpool FC",
      homeLogo: "/liverpool-logo.png",
      awayTeam: "Real Madrid FC",
      awayLogo: "/madrid-logo.png",
      league: "Champion League",
      timeDay: "28th May 2026",
      timeHours: "20:00 PM",
      stadium: "Anfield Stadium",
      quantity: 2,
      total: 2500,
      status: "CANCELLED",
    },
    {
      paymentId: "ORD-123752735723",
      timePayment: "18/11/2025 19:50",
      homeTeam: "Liverpool FC",
      homeLogo: "/liverpool-logo.png",
      awayTeam: "Real Madrid FC",
      awayLogo: "/madrid-logo.png",
      league: "Champion League",
      timeDay: "28th May 2026",
      timeHours: "20:00 PM",
      stadium: "Anfield Stadium",
      quantity: 2,
      total: 2500,
      status: "PENDING",
    },
    // ... thêm bao nhiêu cũng được
  ]);

  // Hàm đổi màu trạng thái
  const getStatusClass = (status) => {
    if (status === "PAID") return "bg-green-500";
    if (status === "CANCELLED") return "bg-red-500";
    if (status === "PENDING") return "bg-blue-700";
    return "bg-gray-500";
  };

  // Sau này fetch thật thì dùng useEffect
  useEffect(() => {
    api
      .get("api/payment/user/order-history")
      .then((res) => {
        // FIX CHÍNH Ở ĐÂY:
        const orderList = res.data?.content || res.data?.data || res.data || [];

        // Đảm bảo luôn là mảng, không bao giờ bị lỗi .map
        setOrders(Array.isArray(orderList) ? orderList : []);
      })
      .catch((err) => {
        console.error("Lỗi load order history:", err);
        setOrders([]); // nếu lỗi thì để mảng rỗng, không crash
      });
  }, []);
  const navigate = useNavigate();

  const handleBuyAgain = (matchId) => {
    // Truyền matchId sang trang Ticket
    navigate("/ticket", {
      state: { matchId: matchId }, // props.id là match.id từ API
    });
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container mx-auto px-4 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl mt-15 md:text-6xl font-bold mb-2 tracking-wider">
            ORDER HISTORY
          </h1>
          <p className="text-gray-400 text-lg">
            Manage and follow all your orders
          </p>
        </div>

        {/* Grid Orders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-600/30 transition-all duration-300"
            >
              {/* Header: Payment ID + Status */}
              <div className="p-5 border-b border-zinc-800 flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">Payment ID</p>
                  <p className="font-mono text-lg font-bold">
                    {order.paymentId}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ngày: {order.timePayment}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-white font-bold text-sm ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Match Info */}
              <div className="p-6 text-center space-y-4">
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  {order.league}
                </p>

                {/* Teams + Logos */}
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={order.homeLogo}
                    alt={order.homeTeam}
                    className="w-12 h-12 object-contain"
                  />
                  <div className="text-xl font-bold">
                    {order.homeTeam} vs {order.awayTeam}
                  </div>
                  <img
                    src={order.awayLogo}
                    alt={order.awayTeam}
                    className="w-12 h-12 object-contain"
                  />
                </div>

                {/* Time & Stadium */}
                <p className="text-sm text-gray-400">
                  {order.timeDay} | {order.timeHours} | {order.stadium}
                </p>

                <p className="text-xs text-gray-500">
                  Quantity: {order.quantity}
                </p>
              </div>

              {/* Footer: Total + Button */}
              <div className="p-5 border-t border-zinc-800 bg-zinc-900/70">
                <p className="text-2xl font-bold text-center mb-4">
                  TOTAL:{" "}
                  {order.status === "PAID" ? (
                    <span className="text-green-500">
                      {order.total.toLocaleString()}$
                    </span>
                  ) : order.status === "PENDING" ? (
                    <span className="text-blue-700">
                      {order.total.toLocaleString()}$
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {order.total.toLocaleString()}$
                    </span>
                  )}
                </p>

                {/* Chỉ hiện nút khi CANCELLED hoặc PENDING */}
                {order.status === "CANCELLED" && (
                  <button
                    onClick={() => handleBuyAgain(order.matchId)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-600/50 cursor-pointer"
                  >
                    ORDER AGAIN
                  </button>
                )}
                {order.status === "PENDING" && (
                  <button
                    onClick={() => handleBuyAgain(order.matchId)}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-700/50 cursor-pointer"
                  >
                    ORDER AGAIN
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Nếu không có đơn hàng */}
        {orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
