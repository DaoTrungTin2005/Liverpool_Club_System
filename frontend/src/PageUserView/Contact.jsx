import Header from "../componentUserView/Header";
import Footer from "../componentUserView/Footer";
import { useState } from "react";
import api from "../Api/apitoken";
export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/contact/send", formData);

      setMessage("Gửi tin nhắn thành công! Cảm ơn bạn ❤️");
      setIsSuccess(true);
      setFormData({ fullName: "", phone: "", email: "", content: "" }); // reset
    } catch (error) {
      console.error("Lỗi gửi contact:", error);
      setMessage(
        error.response?.data?.message || "Gửi thất bại, vui lòng thử lại sau!"
      );
      setIsSuccess(false);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000); // tự ẩn sau 5s
    }
  };
  return (
    <div className=" bg-gradient-to-br from-[#1a001a] via-[#2d001a] to-[#1a001a] pt-12 flex items-center justify-center flex-col">
      <Header />
      <div className=" w-full mx-auto mt-15">
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-center text-white mb-2 DelaGothicOne">
          CONTACT
        </h1>
        <p className="text-center text-white text-xl tracking-wider mb-5 font-bold">
          FOR LIVERPOOL FC
        </p>

        <div className="grid md:grid-cols-2 gap-16 bg-black/30 backdrop-blur-lg rounded-2xl py-10 px-20 shadow-2xl">
          {/* Cột trái - Thông tin liên hệ */}
          <div className="space-y-10">
            {/* Address */}
            <div className="flex gap-20 items-start">
              <div className="w-14 h-14 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                📍
              </div>
              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <p className="text-white text-lg leading-relaxed">
                  123 dong abschd djbsdu sdhsdujs jdusus
                </p>
              </div>
            </div>

            {/* Hotline */}
            <div className="flex gap-20 items-start">
              <div className="w-14 h-14 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                ☎
              </div>
              <div>
                <p className="text-gray-400 text-sm">Hotline</p>
                <p className="text-white text-lg">+84 123 456 789</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-20 items-start">
              <div className="w-14 h-14 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                ✉
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white text-lg">contact@gmail.com</p>
              </div>
            </div>

            {/* Working hours */}
            <div className="flex gap-20 items-start">
              <div className="w-14 h-14 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                ⏰
              </div>
              <div>
                <p className="text-gray-400 text-sm">Working hours</p>
                <p className="text-white text-lg">
                  Monday - Saturday : 9:00 - 18:00
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="bg-white/10 border border-white/20 rounded-lg px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-white/10 border border-white/20 rounded-lg px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
            />

            <textarea
              rows={6}
              placeholder="The content of your message"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-5 py-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-red-500 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-400 hover:bg-red-700 text-white font-bold text-lg py-5 rounded-full transition duration-300 shadow-lg hover:shadow-red-600/50 cursor-pointer"
            >
              {loading ? "Sending..." : "SEND MESSAGE"}
            </button>
            {message && (
              <div
                className={`mt-4 p-4 rounded-lg text-center font-bold text-white ${
                  isSuccess ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
