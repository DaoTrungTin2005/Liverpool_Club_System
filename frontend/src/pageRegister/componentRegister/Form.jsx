import Name from "./FormData";
import "../../output.css";
import { useState } from "react";

export default function Form() {
  const handleFocus = (e) => {
    e.target.placeholder = ""; // Xóa placeholder khi focus
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      e.target.placeholder = e.target.getAttribute("data-placeholder") || ""; // Khôi phục nếu input trống
    }
  };

  //khởi tạo state dưới dạng object để quản lý nhiều trường input
  const [user, setUser] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  // per-field error state
  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  //hàm xử lý thay đổi dữ liệu khi nhập vào input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validators = {
    email: (v) => /\S+@\S+\.\S+/.test(v),
    fullName: (v) => v && v.trim().length > 6,
    password: (v) => v && v.length >= 6,
  };

  const fieldKeys = ["email", "fullName", "password"];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    fieldKeys.forEach((key) => {
      const val = user[key];
      if (!validators[key](val)) {
        if (key === "email") newErrors[key] = "Please enter a valid email.";
        if (key === "fullName") newErrors[key] = "Please enter your full name.";
        if (key === "password")
          newErrors[key] = "Password must be at least 6 characters.";
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));

    const hasError = Object.keys(newErrors).length > 0;
    if (hasError) {
      // focus first error
      const firstKey = Object.keys(newErrors)[0];
      const idx = fieldKeys.indexOf(firstKey);
      const inputs = document.querySelectorAll("form input");
      if (inputs[idx]) inputs[idx].focus();
      return;
    }
    alert("Registration Successful");
  };

  return (
    <>
      <form
        className="flex flex-col gap-4 items-center"
        onSubmit={handleSubmit}
      >
        {Name.map((item, index) => {
          const key = fieldKeys[index];
          const hasError = Boolean(errors[key]);
          return (
            <div className="flex flex-col gap-2 px-14 " key={index}>
              <label htmlFor={key} className="text-xl">
                {item.name}
              </label>
              <input
                id={key}
                name={key}
                value={user[key]}
                className="border text-sm w-85 py-2 italic cursor-pointer hover:outline-2 rounded-md p-2"
                type={item.type}
                placeholder={item.placeholder}
                data-placeholder={item.placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                style={{
                  backgroundColor: hasError ? "rgba(255,0,0,0.08)" : undefined,
                  borderColor: hasError ? "red" : undefined,
                }}
              />
              {hasError && (
                <span style={{ color: "red", fontSize: "0.85rem" }}>
                  {errors[key]}
                </span>
              )}
            </div>
          );
        })}
        <button
          type="submit"
          className="cursor-pointer border border-red bg-red-600 px-4 py-2 hover:outline-2 rounded-lg m-4 w-85"
        >
          Create an account
        </button>
      </form>
    </>
  );
}
