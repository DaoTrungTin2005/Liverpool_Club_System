import "../output.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../pageAdminUser/componentAdminUser/Button";
import { logout } from "../Api/logout.js";
export default function Header() {
  const [user, setUser] = useState(null);
  const [, setDebugInfo] = useState(null);
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    // Đọc lại user mỗi khi route thay đổi
    const data = localStorage.getItem("user");

    if (data) {
      try {
        const parsedUser = JSON.parse(data);
        setUser(parsedUser);

        // Debug info cho UI
        setDebugInfo({
          hasUser: true,
          fullName:
            parsedUser.fullName || parsedUser.full_name || parsedUser.name,
          email: parsedUser.email,
          rawKeys: Object.keys(parsedUser),
        });
      } catch (err) {
        console.error(" Lỗi parse user:", err);
        setUser(null);
        setDebugInfo({ hasUser: false, error: "Parse failed" });
      }
    } else {
      setUser(null);
      setDebugInfo({ hasUser: false, reason: "No data" });
    }
  }, [location]);
  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-lg">
      {/* BG đỏ đen gradient phong cách Liverpool */}
      <div className="bg-gradient-to-r from-black via-red-800 to-black px-8 py-3 flex items-center justify-between h-20 max-sm:h-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="bg-red-600 w-8 h-8 rounded flex items-center justify-center max-sm:w-6 max-sm:h-6"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <span className="text-white font-bold text-lg max-sm:text-xs">
              LIV
            </span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-widest max-sm:hidden">
            LIVERPOOL FC
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-8 text-white font-semibold justify-center max-sm:gap-3 max-sm:text-sm max-sm:ml-5">
          <Link
            to="/match"
            className="hover:text-red-300 duration-200 max-sm:hidden"
          >
            Home
          </Link>
          <Link
            to="/myclub"
            className="hover:text-red-300 duration-200 max-sm:hidden"
          >
            MyClub
          </Link>
          <Link
            to="/contact"
            className="hover:text-red-300 duration-200 max-sm:hidden"
          >
            Contact
          </Link>

          {!user && (
            <>
              <Link
                to="/register"
                className="hover:text-red-300 duration-200 max-sm:hidden"
              >
                Register
              </Link>
              <Button text="Login" className="mb-10" onClick={logout}></Button>
            </>
          )}

          {user && (
            <>
              <span className="text-red-300">Xin chào, {user.fullname}</span>
              <Button
                text={"Log Out"}
                onClick={logout}
                className="mb-10 max-sm:h-7 max-sm:w-25 max-sm:text-xs"
              />
            </>
          )}
        </nav>

        {/* Search */}
      </div>
      {/* mobile */}
      {openMenu && (
        <div className="bg-red-600 py-3 flex justify-center items-center w-20 h-full flex-col">
          {/* Logo */}

          {/* Nav */}
          <nav className="flex items-center gap-8 text-white font-semibold justify-center max-sm:gap-3 max-sm:text-sm max-sm:flex-col">
            <Link to="/match" className="hover:text-red-300 duration-200">
              Home
            </Link>
            <Link to="/myclub" className="hover:text-red-300 duration-200">
              MyClub
            </Link>
            <Link to="/contact" className="hover:text-red-300 duration-200">
              Contact
            </Link>

            {!user && (
              <>
                <Link
                  to="/register"
                  className="hover:text-red-300 duration-200"
                >
                  Register
                </Link>
                <Button
                  text="Login"
                  className="mb-10"
                  onClick={logout}
                ></Button>
              </>
            )}
          </nav>

          {/* Search */}
        </div>
      )}
    </header>
  );
}
