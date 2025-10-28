import "../../output.css";
import { useState, useEffect, useRef } from "react";

/*
  - File này định nghĩa component Form dùng trong trang Add User của phần quản trị.
  - Mục đích: thu thập FullName, Email, Password (tuỳ chọn) và chọn Role (ADMIN/USER).
  - Truyền vào props:
    - showPass: (boolean) có hiển thị input mật khẩu hay không.
    - onValidityChange: (function) callback để báo cho parent biết trạng thái hợp lệ của form.
    - validateSignal: (number) khi parent tăng giá trị này, Form sẽ chạy validateAll() để kiểm tra toàn bộ trường.
*/

export default function Form({
  showPass = true,
  onValidityChange,
  validateSignal,
}) {
  // Component chính của Form
  // - Trả về markup form
  // - Quản lý trạng thái values, errors, touched, role
  // - Expose validateAll qua validateSignal và báo trạng thái qua onValidityChange
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  // Theo dõi các trường đã được chạm để không hiển thị lỗi trước khi người dùng tương tác.
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
  });
  const [roleTouched, setRoleTouched] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  const validateField = (name, value) => {
    // Hàm validateField:
    // - Tham số: name (tên field), value (giá trị hiện tại)
    // - Trả về chuỗi lỗi (rỗng nếu hợp lệ)
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.length < 2) {
          error = "Full name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    // Hàm handleChange:
    // - Chạy khi input thay đổi
    // - Cập nhật values
    // - Đánh dấu field là 'touched' khi người dùng bắt đầu nhập
    // - Chạy validateField cho field đó và cập nhật errors tương ứng
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // mark field as touched when user starts typing
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const [role, setRole] = useState(null); // 'admin' or 'user'
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const roleAdminRef = useRef(null);

  // validate all fields and role, return boolean
  const validateAll = () => {
    // Hàm validateAll:
    // - Chạy validate toàn bộ các trường (fullName, email, password nếu có, role)
    // - Đặt submittedAttempt = true để hiển thị lỗi nếu parent yêu cầu
    // - Cập nhật errors state
    // - Nếu không hợp lệ, focus vào field lỗi đầu tiên
    setSubmittedAttempt(true);
    const newErrors = { ...errors };
    newErrors.fullName = validateField("fullName", values.fullName);
    newErrors.email = validateField("email", values.email);
    if (showPass)
      newErrors.password = validateField("password", values.password);
    // role validation
    newErrors.role = role ? "" : "Please select a role";

    setErrors(newErrors);

    const isValid =
      !newErrors.fullName &&
      !newErrors.email &&
      (!showPass || !newErrors.password) &&
      !newErrors.role;

    // if invalid, focus the first invalid field (after state updates)
    if (!isValid) {
      setTimeout(() => {
        if (newErrors.fullName) {
          fullNameRef.current?.focus();
        } else if (newErrors.email) {
          emailRef.current?.focus();
        } else if (showPass && newErrors.password) {
          passwordRef.current?.focus();
        } else if (newErrors.role) {
          roleAdminRef.current?.focus();
        }
      }, 0);
    }

    if (onValidityChange) onValidityChange({ isValid, values, role });
    return isValid;
  };

  // when validateSignal increments (parent requests validation), run full validation
  useEffect(() => {
    // Effect lắng nghe validateSignal từ parent.
    // - Chỉ chạy validateAll khi parent thực sự yêu cầu (validateSignal > 0).
    // - Điều này tránh việc validate khi component mount (validateSignal có thể là 0 ban đầu).
    if (typeof validateSignal !== "undefined" && validateSignal > 0) {
      validateAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateSignal]);

  // notify parent on each change of validity
  useEffect(() => {
    // Effect này thông báo cho parent mỗi khi trạng thái errors/values/role thay đổi.
    // Parent có thể dùng thông tin này để cập nhật UI (ví dụ bật/tắt nút Add).
    const isValid =
      !errors.fullName &&
      !errors.email &&
      (!showPass || !errors.password) &&
      !!role;
    if (onValidityChange) onValidityChange({ isValid, values, role });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, values, role]);

  return (
    <>
      <form
        action=""
        className="flex flex-col items-center gap-5 text-[#2B3674] text-sm"
      >
        <label htmlFor="" className="flex flex-col justify-center w-100 gap-5">
          FullName:
          <input
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            ref={fullNameRef}
            className={`border rounded-[10px] h-10 ${
              errors.fullName && (touched.fullName || submittedAttempt)
                ? "border-red-500"
                : ""
            }`}
          />
          {errors.fullName && (touched.fullName || submittedAttempt) && (
            <span className="text-red-500 text-xs">{errors.fullName}</span>
          )}
        </label>

        <label htmlFor="" className="flex flex-col justify-center w-100 gap-5">
          Email:
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            ref={emailRef}
            className={`border rounded-[10px] h-10 ${
              errors.email && (touched.email || submittedAttempt)
                ? "border-red-500"
                : ""
            }`}
          />
          {errors.email && (touched.email || submittedAttempt) && (
            <span className="text-red-500 text-xs">{errors.email}</span>
          )}
        </label>

        {showPass && (
          <label
            htmlFor=""
            className="flex flex-col justify-center w-100 gap-5"
          >
            Password:
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              ref={passwordRef}
              className={`border rounded-[10px] h-10 ${
                errors.password && (touched.password || submittedAttempt)
                  ? "border-red-500"
                  : ""
              }`}
            />
            {errors.password && (touched.password || submittedAttempt) && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password}
              </span>
            )}
          </label>
        )}
        <div action="" className="mr-35">
          <div className="flex flex-col gap-4">
            <p className="text-[#2B3674] text-sm">Role</p>
            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setRoleTouched(true);
                }}
                ref={roleAdminRef}
                aria-pressed={role === "admin"}
                className={`px-4 w-30 h-6 font-bold items-center rounded ${
                  role === "admin"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                ADMIN
              </button>
              <input
                className="sr-only"
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />

              <button
                type="button"
                onClick={() => {
                  setRole("user");
                  setRoleTouched(true);
                }}
                aria-pressed={role === "user"}
                className={`px-4 w-30 h-6 font-bold items-center rounded ${
                  role === "user"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                USER
              </button>
              <input
                className="sr-only"
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
              />
            </div>
            {errors.role && (roleTouched || submittedAttempt) && (
              <span className="text-red-500 text-xs mt-1">{errors.role}</span>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
