import Name from "./FormData";
import "../../output.css";
import { useState } from "react";
import axios from "axios";

export default function Form() {
  const handleFocus = (e) => {
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      e.target.placeholder = e.target.getAttribute("data-placeholder") || "";
    }
  };

  const [user, setUser] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  const [, setServerMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerMessage("");
  };

  const validators = {
    email: (v) => /\S+@\S+\.\S+/.test(v),
    fullName: (v) => v && v.trim().length > 6,
    password: (v) => v && v.length >= 6,
  };

  const fieldKeys = ["email", "fullName", "password"];

  const handleSubmit = async (e) => {
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
      const firstKey = Object.keys(newErrors)[0];
      const idx = fieldKeys.indexOf(firstKey);
      const inputs = document.querySelectorAll("form input");
      if (inputs[idx]) inputs[idx].focus();
      return;
    }

    // --- Gọi API ---
    try {
      const res = await axios.post(
        "https://367a5f36e756.ngrok-free.app/api/accounts/create_account",
        {
          fullname: user.fullName,
          email: user.email,
          password: user.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      //  Nếu API trả thành công
      console.log(res.data);

      alert(` ${res.data.message || "Account created successfully!"}`);

      // Reset form
      setUser({ email: "", fullName: "", password: "" });
    } catch (err) {
      if (err.response) {
        console.error(err.response.data);
        const data = err.response.data.data || {};

        //  Gộp thông tin lỗi trả về từ BE
        let errorText = `${err.response.data.message || "Registration failed"}`;
        if (data.fullname) errorText += `\n- ${data.fullname}`;
        if (data.email) errorText += `\n- ${data.email}`;

        alert(` ${errorText}`);

        // Cập nhật lỗi ở input
        setErrors((prev) => ({
          ...prev,
          fullName: data.fullname || "",
          email: data.email || "",
        }));
      } else {
        alert(" Cannot connect to server. Please try again later.");
      }
    }
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
            <div className="flex flex-col gap-2 px-14" key={index}>
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
