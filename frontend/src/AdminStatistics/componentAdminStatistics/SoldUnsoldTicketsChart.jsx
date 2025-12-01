import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function SoldUnsoldTicketsChart() {
  const [selectedMatch, setSelectedMatch] = useState("Match");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Dữ liệu mẫu
  const data = [
    { name: "Sold", value: 58, color: "#4400FF" },
    { name: "Unsold", value: 42, color: "#FF0077" },
  ];

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 cursor-pointer"
        >
          <option>Match</option>
          <option>Match 1</option>
          <option>Match 2</option>
          <option>Match 3</option>
        </select>
        <h2 className="text-sm font-bold text-gray-800 flex-1 text-center">
          SOLD AND UNSOLD TICKETS
        </h2>
        <div className="w-24"></div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={285}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              dataKey="value"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{
                    filter:
                      hoveredIndex === index
                        ? "brightness(1.3)"
                        : "brightness(1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Label và Tooltip - Sold (Trái) */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-left">
          {hoveredIndex === 0 && (
            <div className="flex items-center mb-1 animate-fade-in">
              <div className="bg-white px-2 py-1 rounded shadow-md border border-gray-300">
                <div className="font-bold text-lg text-black">
                  {data[0].value}%
                </div>
              </div>
              <svg width="60" height="2" className="ml-0.5">
                <line
                  x1="0"
                  y1="1"
                  x2="60"
                  y2="1"
                  stroke="black"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          )}
          <div className="text-sm font-semibold" style={{ color: "#4400FF" }}>
            Sold
          </div>
        </div>

        {/* Label và Tooltip - Unsold (Phải) */}
        <div className="absolute right-4 top-1/3 transform -translate-y-1/2 text-right">
          {hoveredIndex === 1 && (
            <div className="flex items-center justify-end mb-1 animate-fade-in">
              <svg width="60" height="2" className="mr-0.5">
                <line
                  x1="0"
                  y1="1"
                  x2="60"
                  y2="1"
                  stroke="black"
                  strokeWidth="1.5"
                />
              </svg>
              <div className="bg-white px-2 py-1 rounded shadow-md border border-gray-300">
                <div className="font-bold text-lg text-black">
                  {data[1].value}%
                </div>
              </div>
            </div>
          )}
          <div className="text-sm font-semibold" style={{ color: "#FF0077" }}>
            Unsold
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
