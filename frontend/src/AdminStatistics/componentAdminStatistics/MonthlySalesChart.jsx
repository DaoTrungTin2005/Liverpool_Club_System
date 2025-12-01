import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlySalesChart() {
  const [viewType, setViewType] = useState("Year");

  // Dữ liệu mẫu theo tháng
  const monthlyData = [
    { month: "Jan", sales: 500 },
    { month: "Feb", sales: 2000 },
    { month: "Mar", sales: 1300 },
    { month: "Apr", sales: 500 },
    { month: "May", sales: 3300 },
    { month: "Jun", sales: 1900 },
    { month: "Jul", sales: 2700 },
    { month: "Aug", sales: 1200 },
    { month: "Sep", sales: 3800 },
    { month: "Oct", sales: 600 },
    { month: "Nov", sales: 2000 },
    { month: "Dec", sales: 3000 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-20"></div>
        <h2 className="text-center font-bold text-lg text-gray-800">
          MONTHLY SALES PERFORMANCE
        </h2>
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 cursor-pointer"
        >
          <option>Year</option>
          <option>2025</option>
          <option>2026</option>
        </select>
      </div>

      {/* Chart */}
      <div className="relative">
        <span className="absolute top-[-15px] left-8 text-sm font-semibold text-transparent bg-clip-text bg-[linear-gradient(180deg,#FF0D0D_0%,#000_100%)]">
          (VND)
        </span>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 70, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: "#9ca3af" }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              label={{
                value: "(Month)",
                position: "right",
                offset: 0,
                style: {
                  fill: "url(#barGradient)",
                  fontSize: 14,
                  fontWeight: 600,
                },
              }}
            />
            <YAxis
              axisLine={{ stroke: "#9ca3af" }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]}
              tickFormatter={(value) => `${value / 1000}m`}
            />
            <Tooltip
              formatter={(value) => [
                `${(value / 1000).toLocaleString()}m VND`,
                "Sales",
              ]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FC0000" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            <Bar
              dataKey="sales"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
