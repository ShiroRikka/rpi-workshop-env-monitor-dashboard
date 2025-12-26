// src/components/HistoryChart.tsx

import type { HistoryDataItem } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HistoryChartProps {
  data: HistoryDataItem[] | null;
  isLoading: boolean;
  error: string | null;
}

export const HistoryChart = ({ data, isLoading, error }: HistoryChartProps) => {
  if (isLoading)
    return (
      <div className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 mt-6">
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-blue-700 font-medium">加载图表数据中...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-linear-to-r from-red-50 to-pink-50 rounded-xl shadow-sm border border-red-100 mt-6">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-red-500 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-red-700 font-medium">图表错误: {error}</span>
        </div>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="p-6 bg-linear-to-r from-gray-50 to-slate-50 rounded-xl shadow-sm border border-gray-200 mt-6">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-gray-500 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-700 font-medium">暂无图表数据</span>
        </div>
      </div>
    );

  // 预处理数据：将时间戳转换为可读格式，并限制显示点数以避免图表过于拥挤
  const chartData = data
    .slice() // 浅拷贝
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((item) => ({
      ...item,
      // 格式化时间为 HH:mm:ss
      time: new Date(item.timestamp).toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      // 添加日期标签用于工具提示
      fullDate: new Date(item.timestamp).toLocaleString("zh-CN"),
    }));

  // 如果数据点过多，可以抽样显示（例如每5个点显示一个）
  const displayData =
    chartData.length > 30
      ? chartData.filter((_, idx) => idx % Math.ceil(chartData.length / 30) === 0)
      : chartData;

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/30 mt-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-linear-to-r from-cyan-500 to-teal-600 rounded-lg p-2 mr-3">
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">历史数据趋势图</h2>
        </div>
        <div className="text-sm text-gray-500">
          显示 {displayData.length} 个数据点（共 {data.length} 条）
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              stroke="#888"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              stroke="#888"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "#6b7280", fontWeight: "bold" }}
              formatter={(value: unknown, name: string | undefined) => {
                const num = typeof value === "number" ? value : 0;
                const displayName = name === "temperature"
                  ? "温度"
                  : name === "humidity"
                  ? "湿度"
                  : "烟雾";
                const unit = name === "temperature"
                  ? "°C"
                  : name === "humidity"
                  ? "%"
                  : "ppm";
                return [
                  `${num.toFixed(2)} ${unit}`,
                  displayName,
                ];
              }}
              labelFormatter={(label) => `时间: ${label}`}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                if (value === "temperature") return "温度 (°C)";
                if (value === "humidity") return "湿度 (%)";
                if (value === "smoke_level") return "烟雾 (ppm)";
                return value;
              }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="temperature"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="humidity"
            />
            <Line
              type="monotone"
              dataKey="smoke_level"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="smoke_level"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50/70 backdrop-blur-sm p-4 rounded-lg border border-blue-100/50">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm font-medium text-blue-800">温度</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600">
            {data[data.length - 1].temperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-blue-500">
            最新值
          </div>
        </div>
        <div className="bg-green-50/70 backdrop-blur-sm p-4 rounded-lg border border-green-100/50">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium text-green-800">湿度</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-green-600">
            {data[data.length - 1].humidity.toFixed(1)}%
          </div>
          <div className="text-xs text-green-500">
            最新值
          </div>
        </div>
        <div className="bg-purple-50/70 backdrop-blur-sm p-4 rounded-lg border border-purple-100/50">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-sm font-medium text-purple-800">烟雾</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-600">
            {data[data.length - 1].smoke_level.toFixed(1)} ppm
          </div>
          <div className="text-xs text-purple-500">
            最新值
          </div>
        </div>
      </div>
    </div>
  );
};