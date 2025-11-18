import "../output.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import Search from "../pageAdminMatch/componentAdminMatch/Search.jsx";
import { useEffect, useState } from "react";
import api from "../Api/apitoken";
import { logout } from "../Api/logout.js";

export default function AdminContact() {
  const [bills, setBills] = useState([]);
  const [, setLoading] = useState(true);

  const [filterText, setFilterText] = useState("");
  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const res = await api.get("api/contact/admin/messages", {
        params: {
          page: 0,
          size: 10000,
        },
      });

      setBills(res.data.content);
    } catch (error) {
      console.error("Lỗi load bills:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredBills = bills.filter((bill) => {
    const text = filterText.toLowerCase();

    return (
      bill.id?.toString().toLowerCase().includes(text) ||
      bill.fullName?.toLowerCase().includes(text) ||
      bill.email?.toLowerCase().includes(text) ||
      bill.phone?.toLowerCase().includes(text) ||
      bill.content?.toLowerCase().includes(text)
    );
  });
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex h-screen">
        {/* Sidebar - cố định */}
        <div className="flex flex-col shadow-3xl w-[20%] h-full items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} onClick={logout} />
        </div>

        {/* Main Content - chiếm 78% */}
        <div className="flex flex-col w-[78%] p-4">
          <div className="flex justify-between w-full items-center mb-2">
            <Search onSearch={(value) => setFilterText(value)} />
          </div>
          <div className="flex flex-col bg-white h-full rounded-3xl shadow-lg overflow-hidden">
            {/* Tiêu đề */}
            <p className="mx-6 text-[#2B3674] font-bold text-2xl my-4">
              Contact List
            </p>

            {/* Danh sách bill - CUỘN RIÊNG, KHÔNG LÀM DÀI TRANG */}
            <div className="flex-1 mx-6 mb-6 overflow-y-auto">
              <div className="flex flex-col gap-4 pr-2">
                {filteredBills.map((bill, index) => (
                  <div
                    key={index}
                    className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-300 relative"
                  >
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      PaymentID: {bill.id}
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
                        <span className="font-medium">Phone:</span> {bill.phone}
                      </div>
                      <div className="flex flex-col gap-10">
                        <div>
                          <span className="font-medium">Message:</span>{" "}
                          {bill.content}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span>{" "}
                          {new Date(bill.createdAt).toLocaleString()}
                        </div>
                      </div>
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
