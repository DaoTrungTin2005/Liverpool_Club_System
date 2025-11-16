import React, { useState } from "react";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import Form from "./componentAdminUser/Form.jsx";
import { useNavigate } from "react-router-dom";
import "../pageRegister/Register.css";
import { logout } from "../Api/logout.js";

export default function AdminUserAddUser() {
  const [validateSignal, setValidateSignal] = useState(0);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const navigate = useNavigate();

  const handleValidityChange = ({ isValid, values }) => {
    if (!pendingSubmit) return;
    setPendingSubmit(false);

    if (!isValid) {
      alert("Please fix the errors in the form.");
      return;
    }

    // CHỈ CHUYỂN DỮ LIỆU, KHÔNG GỌI API
    navigate("/admin/user/add/question", { state: { userData: values } });
  };

  const handleAdd = () => {
    setPendingSubmit(true);
    setValidateSignal((prev) => prev + 1);
  };

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} onClick={logout} />
        </div>
        <div className="w-[80%] bg-white mr-10 ml-10 mt-15 mb-10 shadow-2xl rounded-3xl flex items-center flex-col justify-center gap-5">
          <p className="text-2xl text-[#2B3674] font-bold">Add User</p>
          <Form
            onValidityChange={handleValidityChange}
            validateSignal={validateSignal}
          />

          <div>
            <Button text="Add" onClick={handleAdd} />
          </div>
        </div>
      </div>
    </>
  );
}
