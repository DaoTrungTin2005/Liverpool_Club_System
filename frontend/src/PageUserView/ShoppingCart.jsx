import Footer from "../componentUserView/Footer";
import Header from "../componentUserView/Header";
import ProductCart from "../componentUserView/ProuctCart";
import "../output.css";
import { useState, useEffect } from "react";
import api from "../Api/apitoken";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch cart data từ API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/cart/show");

      if (response.data?.status === "success") {
        const cartData = response.data.data;

        // Map data từ API sang format component
        const mappedItems = cartData.items.map((item) => ({
          id: item.cartItemId,
          productId: item.productId,
          variantId: item.variantId,
          name: item.productName,
          image: item.productImage,
          price: item.price,
          size: item.size,
          stock: item.available,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }));

        setCartItems(mappedItems);
        setTotalItems(cartData.totalItems);
        setShippingFee(cartData.shippingFee);
        setTotalPrice(cartData.totalPrice);

        console.log("✅ Cart loaded:", cartData);
      }
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      if (error.response?.status === 401) {
        alert("Vui lòng đăng nhập để xem giỏ hàng!");
      } else {
        alert("Không thể tải giỏ hàng. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load cart khi component mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Tăng số lượng
  const increaseQuantity = async (id) => {
    const item = cartItems.find((item) => item.id === id);

    if (!item) return;

    // Kiểm tra stock
    if (item.quantity >= item.stock) {
      alert(`Chỉ còn ${item.stock} sản phẩm trong kho!`);
      return;
    }

    const newQuantity = item.quantity + 1;

    try {
      const response = await api.put("/api/cart/update", {
        cartItemId: id,
        quantity: newQuantity,
      });

      if (response.data?.status === "success") {
        // Update local state
        setCartItems(
          cartItems.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
        );

        // Dispatch event để Header refresh
        window.dispatchEvent(new Event("cartUpdated"));

        console.log("✅ Increased quantity:", response.data);
      }
    } catch (error) {
      console.error("❌ Error increasing quantity:", error);
      alert("Không thể tăng số lượng. Vui lòng thử lại!");
    }
  };

  // Giảm số lượng
  const decreaseQuantity = async (id) => {
    const item = cartItems.find((item) => item.id === id);

    if (!item) return;

    if (item.quantity <= 1) {
      alert(
        "Số lượng tối thiểu là 1. Bạn có thể xóa sản phẩm nếu không muốn mua."
      );
      return;
    }

    const newQuantity = item.quantity - 1;

    try {
      const response = await api.put("/api/cart/update", {
        cartItemId: id,
        quantity: newQuantity,
      });

      if (response.data?.status === "success") {
        // Update local state
        setCartItems(
          cartItems.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
        );

        // Dispatch event để Header refresh
        window.dispatchEvent(new Event("cartUpdated"));

        console.log("✅ Decreased quantity:", response.data);
      }
    } catch (error) {
      console.error("❌ Error decreasing quantity:", error);
      alert("Không thể giảm số lượng. Vui lòng thử lại!");
    }
  };

  // Xóa một sản phẩm
  const removeItem = async (id) => {
    // Confirm trước khi xóa
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      return;
    }

    try {
      const response = await api.delete(`/api/cart/remove/${id}`);

      if (response.data?.status === "success") {
        // Update local state
        setCartItems(cartItems.filter((item) => item.id !== id));

        // Dispatch event để Header refresh
        window.dispatchEvent(new Event("cartUpdated"));

        alert("Đã xóa sản phẩm khỏi giỏ hàng!");
        console.log("✅ Removed item:", response.data);
      }
    } catch (error) {
      console.error("❌ Error removing item:", error);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  };

  // Xóa tất cả
  const clearCart = async () => {
    // Confirm trước khi xóa toàn bộ
    if (!window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      return;
    }

    try {
      const response = await api.delete("/api/cart/clear");

      if (response.data?.status === "success") {
        // Update local state
        setCartItems([]);
        setTotalItems(0);
        setTotalPrice(0);

        // Dispatch event để Header refresh
        window.dispatchEvent(new Event("cartUpdated"));

        alert("Đã xóa toàn bộ giỏ hàng!");
        console.log("✅ Cleared cart:", response.data);
      }
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      alert("Không thể xóa giỏ hàng. Vui lòng thử lại!");
    }
  };

  // Tính subtotal (từ items hiện tại, không dùng API)
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Tính total
  const calculateTotal = () => {
    return calculateSubtotal() + shippingFee;
  };

  // Format giá
  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN") || "0";
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="w-[65%] h-screen flex items-center justify-center mx-auto">
          <p className="text-xl text-gray-500">Đang tải giỏ hàng...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="w-[65%] h-full flex items-center justify-center mx-auto my-20 gap-10">
        <div className="flex flex-col justify-center pt-10 gap-5">
          <div className="font-bold flex flex-col">
            <h1 className="text-3xl">Shopping Cart</h1>
            <p className="text-sm text-[#4B5563]">
              {cartItems.length} Products in your Shopping cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 mb-5">Giỏ hàng trống</p>
              <a
                href="/shopping/details"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Tiếp tục mua sắm
              </a>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <ProductCart
                  key={item.id}
                  item={item}
                  onIncrease={() => increaseQuantity(item.id)}
                  onDecrease={() => decreaseQuantity(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
              <button
                onClick={clearCart}
                className="w-full mx-auto h-15 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#EF4444] hover:text-red-500 hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group"
              >
                Delete all your shopping cart
              </button>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="flex flex-col mt-30 gap-5 sticky top-25 self-start shadow-sm text-[#374151] p-5">
            <h2 className="font-bold text-[#0A0A0A]">Order Summary</h2>
            <div className="flex gap-10 justify-between text-sm">
              <p>Subtotal</p>
              <p>{formatPrice(calculateSubtotal())} VND</p>
            </div>
            <div className="flex gap-10 justify-between text-sm">
              <p>Shipping Fee</p>
              <p>{formatPrice(shippingFee)} VND</p>
            </div>
            <hr />
            <div className="flex gap-10 justify-between">
              <p className="font-bold text-[#0A0A0A]">Total</p>
              <p className="bg-[linear-gradient(180deg,#EF4444_0%,#892727_100%)] bg-clip-text text-transparent font-black">
                {formatPrice(calculateTotal())} VND
              </p>
            </div>
            <button className="w-full mx-auto h-10 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#374151] hover:text-[#374151] hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group">
              Checkout
            </button>
            <button
              onClick={() => (window.location.href = "/shopping/details")}
              className="w-full mx-auto h-10 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#374151] hover:text-[#374151] hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group"
            >
              Continue Shopping
            </button>
            <div className="text-[#4B5563] mt-5">
              <h3 className="font-black text-sm">Shipping Information:</h3>
              <p className="text-xs">• Free shipping all your orders</p>
              <p className="text-xs">• Estimated delivery: 2–3 days</p>
              <p className="text-xs">• 30-day return policy</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
