import React, { useState } from "react";
import ImgAdminUser01Component from "./componentAdminUser/ImgAdminUser01";
import LinkGoPage from "./componentAdminUser/LinkGoPage.jsx";
import Button from "./componentAdminUser/Button.jsx";
import Form from "./componentAdminUser/Form.jsx";
import { Link } from "react-router-dom";
import "../pageRegister/Register.css";

export default function AdminUserAddUser() {
  const [role, setRole] = useState(null); // 'admin' or 'user'

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
          <Form showPass={false} />
          <form action="" className="mr-35">
            <div className="flex flex-col gap-4">
              <p className="text-[#2B3674] text-sm">Role</p>
              <div className="flex gap-4 items-center">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
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
                  onClick={() => setRole("user")}
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
            </div>
          </form>
          <Link to={"/admin/user/add/user/update/question"}>
            <Button text="Add" />
          </Link>
        </div>
      </div>
    </>
  );
}
