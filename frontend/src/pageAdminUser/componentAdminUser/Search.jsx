import { useState } from "react";
import "../../output.css";
import {
  SvgAdminSearch01,
  SvgAdminSearch02,
} from "../../assets/svg/SvgAdmin.jsx";
import Avatar from "../../assets/img/Avatar01.png";
import api from "../../Api/apitoken.js"; // axios instance có token

export default function Search({
  endpoint,
  onResult,
  onSearchStart,
  onSearchEnd,
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    onSearchStart?.();

    try {
      const response = await api.get(endpoint, {
        params: { page: 0, size: 10, search: query },
      });

      if (response.data.status === "success") {
        onResult?.(response.data.data.content);
      } else {
        onResult?.([]);
        alert("Không tìm thấy kết quả!");
      }
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      alert("Không thể kết nối tới server hoặc token không hợp lệ.");
    } finally {
      setLoading(false);
      onSearchEnd?.();
    }
  };

  return (
    <div className="flex gap-2 m-4 p-2 rounded-3xl w-sm bg-white items-center justify-around h-10 mt-10">
      <form
        className="flex items-center gap-2 h-7 w-3xs rounded-2xl bg-[#F4F7FE]"
        onSubmit={handleSearch}
      >
        <SvgAdminSearch01 />
        <p className="text-xs text-[#8F9BBA]">Search</p>
        <input
          className="border-0 bg-transparent outline-none text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <SvgAdminSearch02 className={loading ? "animate-spin" : ""} />
      <img src={Avatar} alt="Avatar" className="w-5 h-5" />
    </div>
  );
}
