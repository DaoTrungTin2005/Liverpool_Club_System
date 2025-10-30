import "./App.css";
import Register from "./pageRegister/Register.jsx";
import Login from "./pageLogin/Login.jsx";
import AdminUser from "./pageAdminUser/AdminUser.jsx";
import AdminUserAddUser from "./pageAdminUser/AdminUserAddUser.jsx";
import AddUserAddQuestion from "./pageAdminUser/AdminUserAddQuestion.jsx";
import AdminUserUpdate from "./pageAdminUser/AdminUserUpdate.jsx";
import AdminUserUpQuesion from "./pageAdminUser/AdminUserUpQuestion.jsx";
import AdminDelete from "./pageAdminUser/AdminDelete.jsx";
import AdminMyClub from "./pageAdminMyClub/AdminMyClub.jsx";
import AdminMyClubAdd from "./pageAdminMyClub/AdminMyClubAdd.jsx";
import AdminMyClubAddQuestion from "./pageAdminMyClub/AdminMyClubAddQuestion.jsx";
import AdminMyClubDelete from "./pageAdminMyClub/AdminMyClubDelete.jsx";
import AdminMyClubUpdate from "./pageAdminMyClub/AdminMyClubUpdate.jsx";
import AdminMyClubUpdateQuestion from "./pageAdminMyClub/AdminMyClubUpdateQuestion.jsx";
import AdminMyClubView from "./pageAdminMyClub/AdminMyClubView.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/user" element={<AdminUser />} />
        <Route path="/admin/user/add" element={<AdminUserAddUser />} />
        <Route
          path="/admin/user/add/question"
          element={<AddUserAddQuestion />}
        />
        <Route path="/admin/user/update" element={<AdminUserUpdate />} />
        <Route
          path="/admin/user/update/question"
          element={<AdminUserUpQuesion />}
        />
        <Route
          path="/admin/user/delete"
          element={<AdminDelete></AdminDelete>}
        ></Route>
        <Route path="/admin/club" element={<AdminMyClub />} />
        <Route path="/admin/club/add" element={<AdminMyClubAdd />} />
        <Route
          path="/admin/club/add/question"
          element={<AdminMyClubAddQuestion />}
        />
        <Route path="/admin/club/delete" element={<AdminMyClubDelete />} />
        <Route path="/admin/club/update" element={<AdminMyClubUpdate />} />
        <Route
          path="/admin/club/update/question"
          element={<AdminMyClubUpdateQuestion />}
        />
        <Route path="/admin/club/view" element={<AdminMyClubView />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
