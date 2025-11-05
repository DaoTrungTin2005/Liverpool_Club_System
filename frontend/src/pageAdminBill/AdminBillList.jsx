import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import { Link } from "react-router-dom";
import Search from "../pageAdminUser/componentAdminUser/Search";

export default function AdminBillList() {
  const bills = [
    {
      paymentId: "0120291",
      fullName: "Đào Trung Tín",
      email: "visaoemkhoc@gmail.com",
      number: "023637373",
      address: "Thụy sĩ",
      ticketArea: "A101C",
      matchId: "LiverManCI25102025",
      quantity: 20,
      total: "12.000.000",
      paymentBy: "MoMo",
      time: "11:29 - 21/12/2025",
      message: "Tui rất là vui",
      status: "Success",
    },
    {
      paymentId: "0120291",
      fullName: "Đào Trung Tín",
      email: "visaoemkhoc@gmail.com",
      number: "023637373",
      address: "Thụy sĩ",
      ticketArea: "A101C",
      matchId: "LiverManCI25102025",
      quantity: 20,
      total: "12.000.000",
      paymentBy: "MoMo",
      time: "11:29 - 21/12/2025",
      message: "Tui rất là vui",
      status: "Error",
    },
    // Thêm nhiều bill để test scroll
    ...Array(10).fill({
      paymentId: "D:0120291",
      fullName: "Đào Trung Tín",
      email: "visaoemkhoc@gmail.com",
      number: "023637373",
      address: "Thụy sĩ",
      ticketAreaId: "A101C",
      matchId: "LiverManCI25102025",
      quantity: 20,
      total: "12.000.000",
      paymentBy: "MoMo",
      time: "11:29 - 21/12/2025",
      message: "Tui rất là vui",
      status: "Success",
    }),
  ];

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex h-screen">
        {/* Sidebar - cố định */}
        <div className="flex flex-col shadow-3xl w-[20%] h-full items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} />
        </div>

        {/* Main Content - chiếm 78% */}
        <div className="flex flex-col w-[78%] p-4">
          <div className="flex justify-between w-full items-center mb-2">
            <Search />
          </div>
          <div className="flex flex-col bg-white h-full rounded-3xl shadow-lg overflow-hidden">
            {/* Tiêu đề */}
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-4">
              Bill List
            </p>

            {/* Danh sách bill - CUỘN RIÊNG, KHÔNG LÀM DÀI TRANG */}
            <div className="flex-1 mx-6 mb-6 overflow-y-auto">
              <div className="flex flex-col gap-4 pr-2">
                {bills.map((bill, index) => (
                  <div
                    key={index}
                    className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-300 relative"
                  >
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      PaymentID: {bill.paymentId}
                    </div>

                    <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-sm mb-6">
                      <div>
                        <span className="font-medium">FullName:</span>{" "}
                        {bill.fullName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        <span className="text-blue-600 underline">
                          {bill.email}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Number:</span>{" "}
                        {bill.number}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span>{" "}
                        {bill.address}
                      </div>
                      <div>
                        <span className="font-medium">TicketArea:</span>{" "}
                        {bill.ticketArea}
                      </div>
                      <div>
                        <span className="font-medium">MatchID:</span>{" "}
                        {bill.matchId}
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span>{" "}
                        {bill.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> {bill.total}
                      </div>
                      <div>
                        <span className="font-medium">Payment by:</span>{" "}
                        {bill.paymentBy}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {bill.time}
                      </div>
                      <div className="col-span-3">
                        <span className="font-medium">Message:</span>{" "}
                        {bill.message}
                      </div>
                    </div>

                    {/* Nút góc phải dưới */}
                    <div className="absolute bottom-4 right-4 flex gap-3">
                      <button
                        className={`px-5 py-2 rounded-lg text-white font-medium text-sm shadow-sm transition-all hover:shadow-md ${
                          bill.status === "Success"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {bill.status}
                      </button>
                      <button className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm shadow-sm transition-all hover:shadow-md">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
