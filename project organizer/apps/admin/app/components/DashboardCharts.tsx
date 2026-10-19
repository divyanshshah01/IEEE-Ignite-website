"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const overviewData = [
  { name: "Apr 10", value: 12 },
  { name: "Apr 20", value: 45 },
  { name: "Apr 26", value: 35 },
  { name: "May 3", value: 70 },
  { name: "May 10", value: 40 },
  { name: "May 17", value: 65 },
];

const growthData = [
  { name: "Apr 20", value: 10 },
  { name: "Apr 22", value: 15 },
  { name: "Apr 24", value: 12 },
  { name: "Apr 27", value: 25 },
  { name: "May 1", value: 20 },
  { name: "May 5", value: 30 },
  { name: "May 10", value: 28 },
  { name: "May 13", value: 35 },
  { name: "May 17", value: 32 },
];

export function OverviewChart({ data = [] }: { data?: any[] }) {
  const chartData = data && data.length > 0 ? data : overviewData;
  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f1f5f9", borderRadius: "8px" }}
            itemStyle={{ color: "#a78bfa" }}
          />
          <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UserGrowthChart({ data = [] }: { data?: any[] }) {
  const chartData = data && data.length > 0 ? data : growthData;
  return (
    <div className="w-full h-full min-h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} dy={10} />
          <Tooltip 
            cursor={{ fill: "#1e293b" }}
            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f1f5f9", borderRadius: "8px" }}
          />
          <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
