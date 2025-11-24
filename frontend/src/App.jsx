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
import Payment from "./PageUserView/Payment.jsx";
import Contact from "./PageUserView/Contact.jsx";
import AdminContact from "./pageAdminContact/AdminContact.jsx";
import PaymentSuccess from "./PageUserView/PaymentStatus.jsx";
import PaymentFailed from "./PageUserView/PaymentStatus.jsx";
import OrderHistory from "./PageUserView/OrderHistory.jsx";
import AdminProduct from "./pageAdminProduct/AdminProduct.jsx";
import AdminProductShopping from "./pageAdminProduct/AdminProductShopping.jsx";
import AdminProductAdd from "./pageAdminProduct/AdminProductAdd.jsx";
import AdminProductUpdate from "./pageAdminProduct/AdminProductUpdate.jsx";
import AdminProductDelete from "./pageAdminProduct/AdminProductDelete.jsx";
import AdminProductView from "./pageAdminProduct/AdminProductView.jsx";
import Shopping from "./PageUserView/Shopping.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "./AdminRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/match" />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN — ĐÃ BẢO VỆ */}
        <Route
          path="/admin/user"
          element={
            <AdminRoute>
              <AdminUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notification"
          element={
            <AdminRoute>
              <AdminContact />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/user/add"
          element={
            <AdminRoute>
              <AdminUserAddUser />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/user/add/question"
          element={
            <AdminRoute>
              <AddUserAddQuestion />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/user/update"
          element={
            <AdminRoute>
              <AdminUserUpdate />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/user/update/question"
          element={
            <AdminRoute>
              <AdminUserUpQuesion />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/user/delete"
          element={
            <AdminRoute>
              <AdminDelete />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/club"
          element={
            <AdminRoute>
              <AdminMyClub />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/club/add"
          element={
            <AdminRoute>
              <AdminMyClubAdd />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/club/delete"
          element={
            <AdminRoute>
              <AdminMyClubDelete />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/club/update"
          element={
            <AdminRoute>
              <AdminMyClubUpdate />
            </AdminRoute>
          }
        />

        <Route path="/admin/club/view" element={<AdminMyClubView />} />
        <Route path="/admin/product" element={<AdminProduct />} />
        <Route
          path="/admin/product/shopping"
          element={<AdminProductShopping />}
        />
        <Route path="/admin/product/add" element={<AdminProductAdd />} />
        <Route path="/admin/product/update" element={<AdminProductUpdate />} />
        <Route path="/admin/product/delete" element={<AdminProductDelete />} />
        <Route path="/admin/product/view" element={<AdminProductView />} />
        {/* USER PAGE */}
        <Route path="/myclub" element={<MyClub />} />
        <Route path="/myclub/player" element={<ProfilePlayer />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/order" element={<OrderHistory />} />

        {/* ADMIN TICKET */}
        <Route
          path="/admin/ticket"
          element={
            <AdminRoute>
              <AdminTicketList />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/ticket/update"
          element={
            <AdminRoute>
              <AdminTicketUpdate />
            </AdminRoute>
          }
        />

        {/* ADMIN MATCH */}
        <Route
          path="/admin/match"
          element={
            <AdminRoute>
              <AdminMatch />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/match/add"
          element={
            <AdminRoute>
              <AdminMatchAdd />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/match/update"
          element={
            <AdminRoute>
              <AdminMatchUpdate />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/match/view"
          element={
            <AdminRoute>
              <AdminMatchView />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/match/delete"
          element={
            <AdminRoute>
              <AdminMatchDelete />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bill"
          element={
            <AdminRoute>
              <AdminBillList />
            </AdminRoute>
          }
        />

        {/* USER ROUTES */}
        <Route path="/match" element={<Match />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shopping" element={<Shopping />}></Route>

        {/* Nếu ai tự gõ /admin → CHẶN LUÔN */}
        <Route path="/admin" element={<Navigate to="/match" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
