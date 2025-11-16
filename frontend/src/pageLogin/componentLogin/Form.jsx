import { useState, useEffect } from "react";
import SvgGoogle from "../../assets/svg/SvgGoogle.jsx";
import "../../output.css";
import api from "../../Api/apitoken.js";

export default function Form() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  //  FIX: Xử lý Google callback và redirect đúng
  useEffect(() => {
    const handleAuth = async () => {
      const url = new URL(window.location.href);
      const tokenFromUrl = url.searchParams.get("token");

      //  Xử lý Google Login callback
      if (tokenFromUrl) {
        localStorage.setItem("authToken", tokenFromUrl);
        localStorage.setItem("tokenTime", Date.now().toString());
        window.history.replaceState({}, "", "/");

        try {
          //  GỌI API LẤY THÔNG TIN USER
          const userRes = await api.post("/api/auth/login");
          const role = userRes.data?.data?.role || userRes.data?.role || "USER";
          const data = userRes.data?.data;
          const userInfo = {
            id: data?.id,
            email: data?.email,
            fullname: data?.fullname,
            role: data?.role,
          };

          localStorage.setItem("userRole", role);

          if (userInfo) {
            localStorage.setItem("user", JSON.stringify(userInfo));
          }

          console.log("✅ Google login success - Role:", role);

          // ✅ Redirect dựa vào role
          window.location.href = role === "ADMIN" ? "/admin/user" : "/match";
        } catch (err) {
          console.error("❌ Lỗi lấy thông tin user:", err);
          alert("Không thể lấy thông tin người dùng!");
          window.location.href = "/login";
        }
        return;
      }

      // ✅ Kiểm tra token hiện tại
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");

      if (token && role) {
        window.location.href = role === "ADMIN" ? "/admin/user" : "/match";
      }
    };

    handleAuth();
  }, []);

  const handleFocus = (e) => (e.target.placeholder = "");
  const handleBlur = (e) => {
    if (!e.target.value)
      e.target.placeholder = e.target.getAttribute("data-placeholder") || "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!user.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email))
      newErrors.email = "Please enter a valid email";

    if (!user.password) newErrors.password = "Password is required";
    else if (user.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await api.post("/api/auth/login", {
        email: user.email,
        password: user.password,
      });
      // Lấy đúng structure từ backend
      const token = res.data?.data?.token || res.data?.token;
      const role = res.data?.data?.role || res.data?.role || "USER";
      const data = res.data?.data;

      const userInfo = {
        id: data?.id,
        email: data?.email,
        fullname: data?.fullname,
        role: data?.role,
      };

      if (token) {
        // Lưu đầy đủ thông tin
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("tokenTime", Date.now().toString());

        if (userInfo) {
          localStorage.setItem("user", JSON.stringify(userInfo));
        }
        setUser({ email: "", password: "" });

        //  Redirect dựa vào role
        window.location.href = role === "ADMIN" ? "/admin/user" : "/match";
      } else {
        alert("Server didn't return a valid token.");
      }
    } catch (err) {
      if (err.response) {
        const msg = err.response.data.message || "Login failed";
        alert(`${msg}`);
      } else {
        alert("Cannot connect to server. Please try again later.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await api.get("/api/auth/login/google/start");
      if (res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        alert("Server không trả về redirectUrl hợp lệ!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gọi API Google Login:", error);
      alert("Cannot connect to the Google Login server!");
    }
  };

  const formFields = [
    {
      name: "Email Address",
      type: "email",
      placeholder: "Enter your email",
      key: "email",
    },
    {
      name: "Password",
      type: "password",
      placeholder: "Enter your password",
      key: "password",
    },
  ];

  return (
    <>
      <button
        onClick={handleGoogleLogin}
        className="flex text-base border border-white items-center gap-4 px-20 m-2 py-2 cursor-pointer hover:outline-2 justify-center rounded-lg"
      >
        Sign in with Google
        <SvgGoogle />
      </button>

      <form
        className="flex flex-col gap-4 items-center"
        onSubmit={handleSubmit}
      >
        {formFields.map((field) => (
          <div className="flex flex-col gap-2 px-14" key={field.key}>
            <label htmlFor={field.key} className="text-xl">
              {field.name}
            </label>
            <input
              id={field.key}
              name={field.key}
              value={user[field.key]}
              className="border border-white text-sm w-85 py-2 italic cursor-pointer hover:outline-2 rounded-md p-2"
              type={field.type}
              placeholder={field.placeholder}
              data-placeholder={field.placeholder}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              style={{
                borderColor: errors[field.key] ? "red" : undefined,
                backgroundColor: errors[field.key]
                  ? "rgba(255,0,0,0.08)"
                  : undefined,
              }}
            />
            {errors[field.key] && (
              <span className="text-red-500 text-sm">{errors[field.key]}</span>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="cursor-pointer border border-red bg-red-600 px-4 py-2 hover:outline-2 rounded-lg m-4 w-85"
        >
          Login
        </button>
      </form>
    </>
  );
}
