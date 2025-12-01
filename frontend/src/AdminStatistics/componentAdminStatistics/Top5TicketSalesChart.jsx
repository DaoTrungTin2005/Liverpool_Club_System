import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";

export default function Top5TicketSalesChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Dữ liệu mẫu
  const data = [
    { match: "Liverpool vs Ajax Amsterdam", tickets: 25000 },
    { match: "Liverpool vs Real Madrid", tickets: 50000 },
    { match: "Liverpool vs Borussia Dortmund", tickets: 12000 },
    { match: "Liverpool vs Manchester City", tickets: 18000 },
    { match: "Liverpool vs Manchester United", tickets: 30000 },
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-300 animate-fade-in">
          <p className="font-bold text-black text-sm">
            {payload[0].value.toLocaleString()} tickets
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 cursor-pointer"
        >
          <option>Month</option>
          <option>Jan</option>
          <option>Feb</option>
          <option>Mar</option>
          <option>Apr</option>
          <option>May</option>
          <option>Jun</option>
          <option>Jul</option>
          <option>Aug</option>
          <option>Sep</option>
          <option>Oct</option>
          <option>Nov</option>
          <option>Dec</option>
        </select>
        <h2 className="text-center font-bold text-lg text-gray-800 flex-1">
          TOP 5 HIGHEST TICKET SALES
        </h2>
        <div className="w-24"></div>
      </div>

      {/* Labels */}
      <div className="relative mb-2">
        {/* Matches - trên đầu trục Y bên trái */}
        <div
          className="absolute left-65 -top-6 text-sm font-semibold"
          style={{
            background: "linear-gradient(180deg, #4DFF00 0%, #000 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          (Matches)
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 180, bottom: 5 }}
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setHoveredIndex(state.activeTooltipIndex);
            } else {
              setHoveredIndex(null);
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#e5e7eb"
          />
          <XAxis
            type="number"
            axisLine={{ stroke: "#9ca3af" }}
            tick={{ fill: "#6b7280", fontSize: 11 }}
            tickLine={false}
            ticks={[0, 5000, 15000, 25000, 35000, 45000, 50000]}
          />
          <YAxis
            type="category"
            dataKey="match"
            axisLine={{ stroke: "#9ca3af" }}
            tick={{ fill: "#374151", fontSize: 16 }}
            tickLine={false}
            width={270}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <defs>
            <linearGradient
              id="barGradientHorizontal"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#4DFF00" />
              <stop offset="100%" stopColor="#00AA00" />
            </linearGradient>
          </defs>
          <Bar
            dataKey="tickets"
            fill="url(#barGradientHorizontal)"
            radius={[0, 4, 4, 0]}
            barSize={35}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                style={{
                  filter:
                    hoveredIndex === index
                      ? "brightness(1.3) drop-shadow(0 4px 6px rgba(77, 255, 0, 0.3))"
                      : "brightness(1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Tickets label - dưới trục X bên phải */}
      <div className="flex justify-end -mt-2">
        <div
          className="text-sm font-semibold"
          style={{
            background: "linear-gradient(180deg, #4DFF00 0%, #000 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          (Tickets)
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
