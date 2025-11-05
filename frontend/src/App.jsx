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
import AdminMyClubDelete from "./pageAdminMyClub/AdminMyClubDelete.jsx";
import AdminMyClubUpdate from "./pageAdminMyClub/AdminMyClubUpdate.jsx";
import AdminMyClubView from "./pageAdminMyClub/AdminMyClubView.jsx";
import MyClub from "./PageUserView/MyClub.jsx";
import AdminTicketList from "./pageAdminTicket/AdminTicketList.jsx";
import ProfilePlayer from "./componentUserView/ProfilePlayer.jsx";
import AdminTicketUpdate from "./pageAdminTicket/AdminTicketUpdate.jsx";
import AdminMatch from "./pageAdminMatch/AdminMatch.jsx";
import AdminMatchAdd from "./pageAdminMatch/AdminMatchAdd.jsx";
import AdminMatchUpdate from "./pageAdminMatch/AdminMatchUpdate.jsx";
import AdminMatchView from "./pageAdminMatch/AdminMatchView.jsx";
import AdminMatchDelete from "./pageAdminMatch/AdminMatchDelete.jsx";
import AdminBillList from "./pageAdminBill/AdminBillList.jsx";
import Match from "./PageUserView/Match.jsx";
import Ticket from "./PageUserView/Ticket.jsx";
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

        <Route path="/admin/club/delete" element={<AdminMyClubDelete />} />
        <Route path="/admin/club/update" element={<AdminMyClubUpdate />} />

        <Route path="/admin/club/view" element={<AdminMyClubView />} />
        <Route path="/myclub" element={<MyClub />} />
        <Route path="/myclub/player" element={<ProfilePlayer />} />
        <Route path="/admin/ticket" element={<AdminTicketList />} />
        <Route path="/admin/ticket/update" element={<AdminTicketUpdate />} />
        <Route path="/admin/match" element={<AdminMatch />} />
        <Route path="/admin/match/add" element={<AdminMatchAdd />} />
        <Route path="/admin/match/update" element={<AdminMatchUpdate />} />
        <Route path="/admin/match/view" element={<AdminMatchView />} />
        <Route path="/admin/match/delete" element={<AdminMatchDelete />} />
        <Route path="/admin/bill" element={<AdminBillList />} />
        <Route path="/match" element={<Match />} />
        <Route path="/ticket" element={<Ticket />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
