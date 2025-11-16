import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  console.log("🛡️ AdminRoute check:");
  console.log("  - Token:", token ? "✅ Có" : "❌ Không");
  console.log("  - Role:", role);
  console.log("  - Is Admin:", role === "ADMIN");

  if (!token) {
    console.log("⚠️ Không có token → Redirect /login");
    return <Navigate to="/login" />;
  }

  if (role !== "ADMIN") {
    console.log("⚠️ Role không phải admin → Redirect /match");
    return <Navigate to="/match" />;
  }

  console.log("✅ Admin access granted!");
  return children;
}
