import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function RevenueMonthChart() {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Dữ liệu mẫu
  const data = [
    { month: 1, ticket: 300, product: 100 },
    { month: 2, ticket: 390, product: 490 },
    { month: 3, ticket: 340, product: 190 },
    { month: 4, ticket: 500, product: 100 },
    { month: 5, ticket: 280, product: 350 },
    { month: 6, ticket: 420, product: 280 },
    { month: 7, ticket: 380, product: 420 },
    { month: 8, ticket: 310, product: 240 },
    { month: 9, ticket: 450, product: 320 },
    { month: 10, ticket: 360, product: 180 },
    { month: 11, ticket: 480, product: 290 },
    { month: 12, ticket: 520, product: 150 },
  ];

  // Custom Dot với hover effect
  const CustomDot = (props) => {
    const { cx, cy, payload, dataKey } = props;
    const color = dataKey === "ticket" ? "#189AF8" : "#E23939";
    const isHovered =
      hoveredPoint?.month === payload.month && hoveredPoint?.type === dataKey;

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={isHovered ? 7 : 5}
          fill={color}
          stroke="white"
          strokeWidth={2}
          style={{
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        />
      </g>
    );
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-300">
          <p className="text-sm font-semibold text-gray-800">
            Month: {payload[0].payload.month}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === "ticket" ? "Ticket" : "Product"}m : {entry.value}m
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = () => (
    <div className="flex justify-center gap-6 mb-4">
      <div className="flex items-center gap-2">
        <div className="relative w-16 h-4 overflow-hidden border border-gray-300">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "#189AF833" }}
          ></div>
          <div
            className="absolute top-0 left-0 right-0 h-2 transform -translate-y-1/2"
            style={{ backgroundColor: "#189AF8" }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-700">Ticket</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-16 h-4 overflow-hidden border border-gray-300">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "#E2393933" }}
          ></div>
          <div
            className="absolute top-0 left-0 right-0 h-2 transform -translate-y-1/2"
            style={{ backgroundColor: "#E23939" }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-700">Product</span>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-black text-white text-center py-4">
        <h2 className="text-xl font-bold">Revenue In The Month</h2>
      </div>

      <div className="p-6">
        {/* Logo and Legend */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">LIVERPOOL FC</h3>
          <CustomLegend />
        </div>

        {/* Y-axis Label */}
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Revenue(VND)
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activePayload) {
                const payload = state.activePayload[0]?.payload;
                if (payload) {
                  setHoveredPoint({
                    month: payload.month,
                    type: state.activeTooltipIndex === 0 ? "ticket" : "product",
                  });
                }
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="colorTicket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#189AF8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#189AF8" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E23939" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#E23939" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: "#9ca3af" }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -10,
                style: { fill: "#374151", fontWeight: 600 },
              }}
            />
            <YAxis
              axisLine={{ stroke: "#9ca3af" }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              ticks={[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Area cho Ticket (xanh) */}
            <Area
              type="monotone"
              dataKey="ticket"
              stroke="#189AF8"
              strokeWidth={2.5}
              fill="url(#colorTicket)"
              dot={<CustomDot dataKey="ticket" />}
              activeDot={{ r: 7 }}
            />

            {/* Area cho Product (đỏ) */}
            <Area
              type="monotone"
              dataKey="product"
              stroke="#E23939"
              strokeWidth={2.5}
              fill="url(#colorProduct)"
              dot={<CustomDot dataKey="product" />}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
