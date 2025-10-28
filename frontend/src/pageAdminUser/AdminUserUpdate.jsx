import React, { useState } from "react";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import Form from "./componentAdminUser/Form.jsx";
import { useNavigate } from "react-router-dom";
import "../pageRegister/Register.css";

export default function AdminUserUpdate() {
  // State để kiểm soát việc xác thực form
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    role: null,
  });
  const [validateSignal, setValidateSignal] = useState(0);
  const navigate = useNavigate();

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
          />
          <div
            onClick={() => {
              // Trigger validation by incrementing signal
              setValidateSignal((prev) => prev + 1);
              // Navigate only if form is valid after validation
              setTimeout(() => {
                if (formState.isValid) {
                  navigate("/admin/user/add/user/update/question");
                }
              }, 0);
            }}
          >
            <Button text="Update" />
          </div>
        </div>
      </div>
    </>
  );
}
