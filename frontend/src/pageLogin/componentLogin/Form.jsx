import { useState } from "react";
import "../../output.css";

export default function Form() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleFocus = (e) => {
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      e.target.placeholder = e.target.getAttribute("data-placeholder") || "";
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!user.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!user.password) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Login attempted with:", user);
    }
    if (!newErrors.email && !newErrors.password) {
      alert("Login Successful");
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
    <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
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
  );
}
