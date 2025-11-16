import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // THÊM useNavigate
import "../pageRegister/Register.css";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import api from "../Api/apitoken";
import { logout } from "../Api/logout.js";

export default function AdminTicketUpdate() {
  // === LẤY DỮ LIỆU TỪ STATE (từ Link) ===
  const location = useLocation();
  const navigate = useNavigate();
  const ticketId = location.state?.ticketSettingId;
  console.log("location.state:", location.state);
  console.log("ticketSettingId:", location.state?.ticketSettingId);

  // === STATE CHO FORM ===
  const [ticket, setTicket] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({ quantity: "", price: "" });

  // === GỌI API LẤY CHI TIẾT (DỮ LIỆU CŨ) ===
  useEffect(() => {
    if (!ticketId) {
      alert("Ticket ID not found in state!");
      navigate("/admin/ticket"); // Quay lại nếu không có ID
      return;
    }

    const fetchTicket = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `api/matches-and-tickets/detail/ticket/${ticketId}`
        );
        console.log("Full API response:", response.data);
        const data = response.data.data;

        if (data) {
          console.log("Ticket detail:", data);
          setTicket(data);
          setQuantity(data.totalQuantity ?? data.quantity ?? 0);
          setPrice(data.price ?? data.ticketPrice ?? 0);
        } else {
          alert("Không tìm thấy dữ liệu vé!");
        }
      } catch (error) {
        console.error("Load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, navigate]);

  // === VALIDATE ===
  const validateForm = () => {
    const newErrors = { quantity: "", price: "" };
    let isValid = true;
    const sold = ticket?.soldQuantity || 0;
    const q = Number(quantity);
    const p = Number(price);

    if (!quantity || isNaN(q)) {
      newErrors.quantity = "Please enter quantity";
      isValid = false;
    } else if (q < 0) {
      newErrors.quantity = "Quantity cannot be negative";
      isValid = false;
    } else if (q < sold) {
      newErrors.quantity = `Cannot be less than sold (${sold})`;
      isValid = false;
    }

    if (!price || isNaN(p)) {
      newErrors.price = "Please enter price";
      isValid = false;
    } else if (p < 0) {
      newErrors.price = "Price cannot be negative";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // === CẬP NHẬT VÉ ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        totalQuantity: parseInt(quantity, 10),
        price: parseFloat(price), // giữ 2 chữ số thập phân nếu cần
      };

      const response = await api.put(
        `api/matches-and-tickets/update/ticket/${ticketId}`,
        payload
      );

      if (response.data?.status === "success") {
        const updatedData = response.data.data;

        // Cập nhật lại state để hiển thị mới nhất
        setTicket(updatedData);
        setQuantity(updatedData.totalQuantity.toString());
        setPrice(updatedData.price.toString());

        alert("Cập nhật vé thành công!");
        navigate("/admin/ticket");
      } else {
        alert(response.data?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      const msg =
        error.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // === LOADING ===
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        {/* === SIDEBAR === */}
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text="Log Out" onClick={logout} />
        </div>

        {/* === FORM === */}
        <div className="w-[80%] bg-white mr-10 ml-10 mt-15 mb-10 shadow-2xl rounded-3xl p-8 flex flex-col items-center justify-center gap-6">
          <p className="text-2xl text-[#2B3674] font-bold">Update Ticket</p>

          <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
            {/* === HIỂN THỊ THÔNG TIN === */}
            <div className="flex flex-col items-center justify-center gap-6 text-sm">
              <div className="flex gap-2 items-center">
                <span className="font-medium">Area:</span>
                <p className="font-bold text-gray-700">{ticket.sectionName}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium">Match:</span>
                <p
                  className="font-bold text-gray-700 truncate max-w-xs"
                  title={ticket.matchDisplay}
                >
                  {ticket.matchDisplay}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium">Sold:</span>
                <p className="font-bold text-green-600">
                  {ticket.soldQuantity}
                </p>
              </div>
            </div>

            {/* === CHỈNH SỬA === */}
            <div className="flex justify-center gap-10">
              <label className="flex flex-col w-40 relative">
                <span className="font-medium mb-1">Quantity:</span>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`border rounded-lg h-10 px-3 focus:ring-2 focus:ring-blue-500 ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.quantity && (
                  <span className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {errors.quantity}
                  </span>
                )}
              </label>

              <label className="flex flex-col w-40 relative">
                <span className="font-medium mb-1">Price (VND):</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`border rounded-lg h-10 px-3 focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <span className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {errors.price}
                  </span>
                )}
              </label>
            </div>

            {/* === NÚT CẬP NHẬT === */}
            <div className="flex justify-center mt-8">
              <Button text="Update" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
