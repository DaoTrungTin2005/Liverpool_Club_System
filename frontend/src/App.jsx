import "./App.css";
import Register from "./pageRegister/Register.jsx";
import Login from "./pageLogin/Login.jsx";
import AdminUser from "./pageAdminUser/AdminUser.jsx";
import AdminUserAddUser from "./pageAdminUser/AdminUserAddUser.jsx";
import AddUserAddQuestion from "./pageAdminUser/AdminUserAddQuestion.jsx";
import AdminUserUpdate from "./pageAdminUser/AdminUserUpdate.jsx";
import AdminUserUpQuesion from "./pageAdminUser/AdminUserUpQuestion.jsx";
import AdminDelete from "./pageAdminUser/AdminDelete.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/user" element={<AdminUser />} />
        <Route path="/admin/user/adduser" element={<AdminUserAddUser />} />
        <Route
          path="/admin/user/adduser/question"
          element={<AddUserAddQuestion />}
        />
        <Route
          path="/admin/user/add/user/update"
          element={<AdminUserUpdate />}
        />
        <Route
          path="/admin/user/add/user/update/question"
          element={<AdminUserUpQuesion />}
        />
        <Route
          path="/admin/user/delete"
          element={<AdminDelete></AdminDelete>}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
