import Footer from "../componentUserView/Footer";
import Header from "../componentUserView/Header";
import ProductCart from "../componentUserView/ProuctCart";
import "../output.css";
import { useState } from "react";

export default function ShoppingCart() {
  // Mỗi product có: id, name, price, size, stock, quantity
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "STRIKER ELITE", price: 189000, size: 8, stock: 800, quantity: 1 },
    { id: 2, name: "STRIKER ELITE", price: 189000, size: 8, stock: 800, quantity: 1 },
    { id: 3, name: "STRIKER ELITE", price: 189000, size: 8, stock: 800, quantity: 1 },
    { id: 4, name: "STRIKER ELITE", price: 189000, size: 8, stock: 800, quantity: 1 },
  ]);

  const shippingFee = 0;

  // Tăng số lượng
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id && item.quantity < item.stock) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    }));
  };

  // Giảm số lượng
  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  // Xóa một sản phẩm
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Xóa tất cả
  const clearCart = () => {
    setCartItems([]);
  };

  // Tính subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Tính total
  const calculateTotal = () => {
    return calculateSubtotal() + shippingFee;
  };

  // Format giá
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

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
          {cartItems.map(item => (
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
        </div>
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
          <button className="w-full mx-auto h-10 rounded-md hover:shadow-2xl hover:scale-101 cursor-pointer bg-[linear-gradient(90deg,#EF4444_0%,#892727_100%)] hover:![background-image:none] hover:border hover:border-2 hover:border-[#374151] hover:text-[#374151] hover:!bg-white transition-all duration-300 text-white font-light text-xs flex items-center justify-center gap-5 group">
            Continue Shopping
          </button>
          <div className="text-[#4B5563] mt-5">
            <h3 className="font-black text-sm">Shipping Information:</h3>
            <p className="text-xs">• Free shipping all your orders</p>
            <p className="text-xs">• Estimated delivery: 2–3 days</p>
            <p className="text-xs">• 30-day return policy</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}