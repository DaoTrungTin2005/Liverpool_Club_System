import "../output.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../pageAdminUser/componentAdminUser/Button";
import { logout } from "../Api/logout.js";
import Cart from "../assets/svg/SvgCart.jsx";
import api from "../Api/apitoken";

export default function Header(props) {
  const [user, setUser] = useState(null);
  const [, setDebugInfo] = useState(null);
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count từ API
  const fetchCartCount = async () => {
    try {
      const response = await api.get("/api/cart/show");
      if (response.data?.status === "success") {
        const totalItems = response.data.data.totalItems || 0;
        setCartCount(totalItems);
      }
    } catch (error) {
      // Nếu lỗi 401 (chưa login) hoặc lỗi khác, set về 0
      console.log(
        "Cart count error (might not be logged in):",
        error.response?.status
      );
      setCartCount(0);
    }
  };

  // Listen to cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log("🔄 Cart updated, refreshing count...");
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

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

        // Fetch cart count khi có user
        fetchCartCount();
      } catch (err) {
        console.error(" Lỗi parse user:", err);
        setUser(null);
        setDebugInfo({ hasUser: false, error: "Parse failed" });
      }
    } else {
      setUser(null);
      setCartCount(0);
      setDebugInfo({ hasUser: false, reason: "No data" });
    }
  }, [location]);

  // Nếu props.number được truyền từ parent, ưu tiên dùng props
  // Nếu không, dùng cartCount từ API
  const displayCartCount =
    props.number !== undefined ? props.number : cartCount;

  return (
    <header className="fixed top-0 left-0 w-full z-5000 shadow-lg">
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
          <Link
            to="/order"
            className="hover:text-red-300 duration-200 max-sm:hidden"
          >
            Order
          </Link>
          <Link
            to="/shopping"
            className="hover:text-red-300 duration-200 max-sm:hidden"
          >
            Product
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
              <Link to="/shopping/cart">
                <Cart
                  className="w-10 h-10 text-white relative"
                  number={displayCartCount}
                />
              </Link>
              <Link to="/admin/user">
                <span className="text-red-300">Xin chào, {user.fullname}</span>
              </Link>
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
