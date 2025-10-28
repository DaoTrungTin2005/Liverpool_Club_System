import React, { useState } from "react";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import Form from "./componentAdminUser/Form.jsx";
import { Link, useNavigate } from "react-router-dom";
import "../pageRegister/Register.css";

export default function AdminUserAddUser() {
  const navigate = useNavigate();
  const [validateSignal, setValidateSignal] = useState(0);
  // track form validity on demand
  const [pendingNavigate, setPendingNavigate] = useState(false);

  const handleValidityChange = ({ isValid /*, values, role */ }) => {
    if (pendingNavigate) {
      setPendingNavigate(false);
      if (isValid) navigate("/admin/user/adduser/question");
    }
  };

  const handleAdd = () => {
    // request Form to validate all fields; if valid, Form will trigger handleValidityChange and navigate
    setPendingNavigate(true);
    setValidateSignal((s) => s + 1);
  };

  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex">
        <div className="container flex flex-col shadow-3xl w-[20%] h-dvh items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} />
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
