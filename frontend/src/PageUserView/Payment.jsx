import "../output.css";
import Header from "../componentUserView/Header";
import Carabaocup from "../assets/img/Carabaocup.png";
import C1 from "../assets/img/C1.png";
import CupFA from "../assets/img/CupFA.png";
import MOMO from "../assets/img/MOMO.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Zalo from "../assets/img/Zalo.png";
import VNPAY from "../assets/img/VNPay.png";
import api from "../Api/apitoken";

export default function Payment() {
  const [selected, setSelected] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [price, setPrice] = useState(null);
  const [sectionName, setSectionName] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeLogo, setHomeLogo] = useState("");
  const [awayLogo, setAwayLogo] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [locationStadium, setLocationStadium] = useState("");

  const matchId = location.state?.matchId;
  const sectionId = location.state?.sectionId;
  const quantity = location.state?.quantity;
  console.log(
    "matchId:",
    matchId,
    "sectionId:",
    sectionId,
    "quantity:",
    quantity
  );
  useEffect(() => {
    if (!matchId || !sectionId) {
      alert("Thiếu dữ liệu vé");
      return;
    }

    const fetchMatchDetail = async () => {
      try {
        const response = await api.get(
          `/api/matches-and-tickets/detail/match/${matchId}`
        );
        const data = response.data.data;

        if (data) {
          // Lấy thông tin đội
          setHomeTeam(data.homeTeam);
          setAwayTeam(data.awayTeam);
          setHomeLogo(data.homeLogoUrl);
          setAwayLogo(data.awayLogoUrl);

          // Lấy ngày giờ
          const dateObj = new Date(data.matchDate);
          setMatchDate(dateObj.toLocaleDateString()); // ví dụ: 12/25/2025
          setMatchTime(
            dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          ); // ví dụ: 19:00

          // Sân vận động
          setLocationStadium(data.location);

          // Lấy giá và tên khán đài
          if (data.ticketSettings && Array.isArray(data.ticketSettings)) {
            const section = data.ticketSettings.find(
              (s) => s.sectionId === sectionId
            );
            if (section) {
              setPrice(section.price);
              setSectionName(section.sectionName);
            } else {
              alert("Không tìm thấy khán đài tương ứng");
            }
          }
        } else {
          alert("Không lấy được dữ liệu trận đấu");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết trận đấu:", error);
      }
    };
    fetchMatchDetail();
  }, [matchId, sectionId]);
  useEffect(() => {
    if (!matchId || !sectionId || !quantity) {
      alert("Thiếu dữ liệu thanh toán!");
      navigate("/payment");
    }
  }, []);
  const handleMakePayment = async (e) => {
    e.preventDefault();
    console.log("SUBMIT");

    if (!selected) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    try {
      // Tạo đơn hàng
      const res = await api.post("/api/payment/create-order", {
        matchId,
        sectionId,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        quantity,
      });

      if (res.data.status !== "success") {
        alert("Không tạo được đơn hàng!");
        return;
      }

      const orderId = res.data.data.id;
      let url = "";

      // Chọn phương thức thanh toán
      if (selected === 1) {
        console.log("THANH TOÁN MOMO");
        const result = await api.post(`/api/payment/create-momo/${orderId}`);
        url = result.data.data.paymentUrl;
      }

      if (selected === 2) {
        console.log("THANH TOÁN VNPAY");
        const result = await api.post(`/api/payment/create-vnpay/${orderId}`);
        url = result.data.data.paymentUrl;
      }

      if (selected === 3) {
        console.log("THANH TOÁN ZALOPAY");
        const result = await api.post(`/api/payment/create-zalopay/${orderId}`);
        url = result.data.data.paymentUrl;
      }

      // Redirect sang cổng thanh toán
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Error create order:", err);
      alert("Không thể tạo đơn thanh toán!");
    }
  };

  return (
    <div className="flex flex-col Oxanium">
      <Header />
      <div className=" w-full h-70 pr-20 max-sm:w-dvh overflow-hidden">
        <div className=" w-full h-full m-10 text-5xl font-bold flex items-center justify-center bg-black text-white ">
          <p>PAYMENT CONFIRMATION</p>
        </div>
      </div>
      <div className="flex items-center justify-center pt-28 gap-12 max-sm:gap-5 max-sm:pt-15 h-full "></div>
      <div className="bg-white w-full h-full m-auto flex flex-col pt-20 pb-50 items-center gap-10 justify-center max-sm:w-dvh">
        <p className="text-7xl font-bold">INFORMATION</p>
        <form className="flex flex-col gap-10" onSubmit={handleMakePayment}>
          <div className="flex flex-col gap-10 w-200">
            <input
              type="text"
              placeholder="Please enter name..."
              className="border border-1 border-gray-500 h-10 w-full text-gray-500 text-xs italic"
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <div className="flex w-full gap-[10%]">
              <input
                type="email"
                placeholder="Please enter email..."
                className="border border-1 border-gray-500 h-10 w-[45%] text-gray-500 text-xs italic"
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Please enter number..."
                className="border border-1 border-gray-500 h-10 w-[45%] text-gray-500 text-xs italic"
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <input
              type="text"
              placeholder="Please enter Address..."
              className="border border-1 border-gray-500 h-10 w-full text-gray-500 text-xs italic"
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-10">
            <p className="text-black text-4xl text-center">CHAMPION LEAGUE</p>
            <div className="w-200 flex items-center justify-between gap-15 text-4xl bg-[#EEEEEE]">
              <img src={homeLogo} alt="" className="w-15 h-15" />
              <p className="w-70">{homeTeam}</p>
              <p className="w-15 h-15">VS</p>
              <p className="w-70">{awayTeam}</p>
              <img src={awayLogo} alt="" className="w-15 h-15" />
            </div>
            <div className="flex text-2xl gap-10 items-center justify-center">
              <p>{matchDate}</p>
              <div className="w-[1px] h-6 border border-1 border-black"></div>
              <p>{matchTime}</p>
              <div className="w-[1px] h-6 border border-1 border-black"></div>
              <p>{locationStadium}</p>
            </div>
          </div>
          <fieldset className="text-center border border-1 border-gray-500 h-40 w-120 m-auto font-medium text-xl ">
            <legend>{sectionName}</legend>
            <div className="flex items-center justify-center gap-10 my-10">
              <div className="w-40 h-10 bg-red-600 text-white flex items-center justify-center">
                <p>Quantity: {quantity}</p>
              </div>
              <div className="w-40 h-10 bg-red-600 text-white flex items-center justify-center">
                <p>Quantity: {Number(quantity) * Number(price)}</p>
              </div>
            </div>
          </fieldset>
          <div className="flex flex-col items-center justify-center py-20 gap-10">
            <p className="text-3xl font-bold">MAKE A PAYMENT</p>
            <div className="flex gap-5">
              <input
                type="text"
                className="w-100 h-50 border border-1 border-gray-500 text-gray-500 text-xs italic text-center "
                placeholder="Leave a message for Liverpool Club"
              />
              <div className="flex gap-5 flex-col">
                {[
                  { id: 1, label: "Payment by MOMO", img: MOMO },
                  { id: 2, label: "Payment by VNPAY", img: VNPAY },
                  { id: 3, label: "Payment by ZALOPAY", img: Zalo },
                ].map((p) => (
                  <div
                    key={p.id}
                    className={`w-100 h-13 flex items-center justify-center gap-40 bg-white cursor-pointer rounded border border-1 border-gray-500 text-gray-500 text-xs italic text-center
            ${selected === p.id ? "ring-4 ring-red-500 border-red-500" : ""}`}
                    onClick={() => setSelected(p.id)}
                  >
                    <p>{p.label}</p>
                    <img src={p.img} alt="" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-210 h-20 bg-red-500 text-white text-3xl font-bold rounded-2xl shadow-2xl"
          >
            MAKE A PAYMENT
          </button>
        </form>
      </div>
    </div>
  );
}
