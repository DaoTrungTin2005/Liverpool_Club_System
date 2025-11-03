import React, { useState, useEffect } from "react";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import Form from "./componentAdminUser/Form.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../Api/apitoken.js";
import "../pageRegister/Register.css";

export default function AdminUserUpdate() {
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    role: null,
  });
  const [validateSignal, setValidateSignal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const userId = state?.userId;

  // ✅ Lấy thông tin user khi vào trang
  useEffect(() => {
    if (!userId) {
      alert("❌ Không tìm thấy ID người dùng.");
      navigate("/admin/user");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/admin/users/${userId}`);
        if (res.data.status === "success") {
          setUserData(res.data.data);
        } else {
          alert("❌ Không thể tải dữ liệu người dùng.");
          navigate("/admin/user");
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Lỗi khi tải thông tin người dùng!");
        navigate("/admin/user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  // ✅ Hàm cập nhật trực tiếp lên API
  const handleUpdateClick = async () => {
    setValidateSignal((prev) => prev + 1);

    setTimeout(async () => {
      if (!formState.isValid) {
        alert("⚠️ Vui lòng điền đầy đủ và chính xác thông tin!");
        return;
      }

      if (!userId) {
        alert("❌ Không tìm thấy ID người dùng.");
        return;
      }

      const updateData = {
        fullName: formState.values.fullName,
        email: formState.values.email,
        role: formState.role?.toUpperCase(),
      };

      try {
        setIsSubmitting(true);
        console.log("🔹 Gửi dữ liệu cập nhật:", updateData);

        const res = await api.put(
          `/api/admin/users/edit/${userId}`,
          updateData
        );

        if (res.data.status === "success") {
          alert("✅ Cập nhật thông tin người dùng thành công!");
          navigate("/admin/user"); // Quay lại trang danh sách
        } else {
          alert("❌ Cập nhật thất bại, vui lòng thử lại.");
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Lỗi trong quá trình cập nhật!");
      } finally {
        setIsSubmitting(false);
      }
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Đang tải dữ liệu người dùng...
      </div>
    );
  }
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} />
        </div>
        <div className="w-[80%] bg-white mr-10 ml-10 mt-15 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-5">
          <p className="text-2xl text-[#2B3674] font-bold">Update User</p>
          <Form
            showPass={false}
            validateSignal={validateSignal}
            onValidityChange={setFormState}
            defaultValues={{
              fullName: userData.fullname || "",
              email: userData.email || "",
              role: userData.role || "user",
            }}
          />
          <div>
            <Button onClick={handleUpdateClick} text="Update" />
          </div>
        </div>
      </div>
    </>
  );
}
