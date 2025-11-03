import { useState, useEffect } from "react";
import SvgGoogle from "../../assets/svg/SvgGoogle.jsx";
import "../../output.css";
import axios from "axios";

export default function Form() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra token từ URL (Google callback) và chuyển hướng
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("authToken", tokenFromUrl);
      setIsLoggedIn(true);
      // Xóa token khỏi URL
      window.history.replaceState({}, document.title, "/");
      // Chuyển hướng đến /admin/user
      window.location.href = "/admin/user";
    } else {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsLoggedIn(true);
        // Nếu đã có token (trước đó), vẫn chuyển hướng đến /admin/user
        window.location.href = "/admin/user";
      }
    }
  }, []);

  // Nếu đang ở trang login mà đã có token → không render form
  // (vì useEffect sẽ tự redirect)
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
      const res = await axios.post(
        "https://0d9ffd8a6329.ngrok-free.app/api/auth/login",
        {
          email: user.email,
          password: user.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const token = res.data?.data?.token;

      if (token) {
        localStorage.setItem("authToken", token);
        setIsLoggedIn(true);
        setUser({ email: "", password: "" });
        // Chuyển hướng đến /admin/user
        window.location.href = "/admin/user";
      } else {
        alert("Server didn't return a valid token.");
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        const msg = err.response.data.message || "Login failed";
        alert(` ${msg}`);
      } else {
        alert("Cannot connect to server. Please try again later.");
      }
    }
  };

  // 🔹 Login với Google
  // Login với Google
  const handleGoogleLogin = async () => {
    try {
      const res = await fetch(
        "https://0d9ffd8a6329.ngrok-free.app/api/auth/login/google/start",
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );

      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Server không trả về redirectUrl hợp lệ!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API Google Login:", error);
      alert("Không thể kết nối đến máy chủ Google Login!");
    }
  };
  //  Nếu đã đăng nhập → hiển thị trang logged-in
  if (isLoggedIn) {
    return (
      <div className="flex flex-col items-center mt-10 text-center">
        <h2 className="text-xl font-semibold text-green-500">
          You are logged in!
        </h2>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            setIsLoggedIn(false);
            alert("🚪 Logged out successfully!");
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

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
