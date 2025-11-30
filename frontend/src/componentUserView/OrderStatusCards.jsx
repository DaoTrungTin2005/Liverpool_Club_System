import { useState } from "react";
import ProductOrderCart from "./ProductOrderCart";
export default function OrderStatusCards() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orderStatuses = [
    {
      id: "paid",
      status: "PAID",
      color: {
        primary: "#69D208",
        glow: "rgba(0, 214, 50, 0.5)",
        border: "#69D208",
        button: "#69D208",
        buttonHover: "#69D208",
        shadow: "0 0 40px rgba(0, 214, 50, 0.6)",
        hoverShadow: "16px 16px 40px rgba(0, 214, 50, 0.8)",
      },
    },
    {
      id: "pending",
      status: "PENDING",
      color: {
        primary: "#3408D2",
        glow: "rgba(124, 58, 237, 0.5)",
        border: "#3408D2",
        button: "#3408D2",
        buttonHover: "#3408D2",
        shadow: "0 0 40px rgba(124, 58, 237, 0.6)",
        hoverShadow: "16px 16px 40px rgba(124, 58, 237, 0.8)",
      },
    },
    {
      id: "cancelled",
      status: "CANCELLED",
      color: {
        primary: "#D20808",
        glow: "rgba(239, 68, 68, 0.5)",
        border: "#D20808",
        button: "#D20808",
        buttonHover: "#D20808",
        shadow: "0 0 40px rgba(239, 68, 68, 0.6)",
        hoverShadow: "16px 16px 40px rgba(239, 68, 68, 0.8)",
      },
    },
  ];

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col gap-8 w-[60%]">
        {orderStatuses.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order.id)}
            className="relative cursor-pointer transition-all duration-300 hover:scale-105 group"
          >
            {/* Main Card Container */}
            <div
              className="bg-black rounded-2xl p-6 px-20 relative overflow-hidden transition-all duration-300"
              style={{
                border:
                  selectedOrder === order.id
                    ? `3px solid ${order.color.border}`
                    : "3px solid transparent",
                boxShadow:
                  selectedOrder === order.id ? order.color.shadow : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = order.color.hoverShadow;
              }}
              onMouseLeave={(e) => {
                if (selectedOrder !== order.id) {
                  e.currentTarget.style.boxShadow = "none";
                } else {
                  e.currentTarget.style.boxShadow = order.color.shadow;
                }
              }}
            >
              {/* Header - Order ID and Status Button */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-white text-sm font-mono Geist">
                  <p className="text-xl font-bold"> ORD-1273572357573</p>
                  <p className="text-sm text-[#BCBCBC]"> 18/11/2012|19:50</p>
                </div>
                <button
                  className="px-6 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: order.color.button,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = order.color.buttonHover;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = order.color.button;
                  }}
                >
                  {order.status}
                </button>
              </div>

              {/* Items Container - Thêm items của bạn vào đây */}
              <div className="space-y-4 mb-6">
                <ProductOrderCart color={order.color.primary} />
                <ProductOrderCart color={order.color.primary} />
                <ProductOrderCart color={order.color.primary} />
              </div>

              {/* Total Section */}
              <div className="border-t-4 border-white pt-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-white text-xl font-bold">TOTAL:</span>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: order.color.primary }}
                  >
                    2.500.000 VND
                  </span>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    className="px-12 py-3 rounded-lg text-white font-bold text-sm transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: order.color.button,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = order.color.buttonHover;
                      e.target.style.boxShadow = `0 8px 20px ${order.color.glow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = order.color.button;
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    ORDER AGAIN
                  </button>
                </div>
              </div>

              {/* Glow Effect on Hover */}
              {selectedOrder === order.id && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse"
                  style={{
                    boxShadow: `inset 0 0 30px ${order.color.glow}`,
                  }}
                ></div>
              )}
            </div>

            {/* Corner Indicator when selected */}
            {selectedOrder === order.id && (
              <div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center animate-scale-in z-10"
                style={{ backgroundColor: order.color.primary }}
              >
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}
