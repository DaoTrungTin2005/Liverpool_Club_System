import Footer from "../componentUserView/Footer";
import Header from "../componentUserView/Header";
import "../output.css";
import PaymentCheckoutCards from "../componentUserView/OrderStatusCards";
export default function OrderHistoryProduct() {
  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center py-20 mt-20 mb-10">
        <h1 className="Geist text-6xl font-black">ORDER HISTORY</h1>
        <p className="text-[#8F8F8F] Geist text-xl">
          Manage and follow all your orders
        </p>
      </div>
      <PaymentCheckoutCards />
      <Footer />
    </>
  );
}
