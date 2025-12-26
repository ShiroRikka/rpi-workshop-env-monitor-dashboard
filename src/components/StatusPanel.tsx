// src/components/StatusPanel.tsx

import type { StatusData } from "../types";

interface StatusPanelProps {
  data: StatusData | null;
  isLoading: boolean;
  error: string | null;
}

export const StatusPanel = ({ data, isLoading, error }: StatusPanelProps) => {
  if (isLoading)
    return (
      <div className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100">
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
          <span className="text-blue-700 font-medium">加载状态数据中...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="p-6 bg-linear-to-r from-red-50 to-pink-50 rounded-xl shadow-sm border border-red-100">
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
          <span className="text-red-700 font-medium">错误: {error}</span>
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="p-6 bg-linear-to-r from-gray-50 to-slate-50 rounded-xl shadow-sm border border-gray-200">
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
          <span className="text-gray-700 font-medium">暂无状态数据</span>
        </div>
      </div>
    );

  // 根据温度值确定颜色
  const getTempColor = (temp: number) => {
    if (temp < 18) return "text-blue-600";
    if (temp > 28) return "text-red-600";
    return "text-green-600";
  };

  // 根据湿度值确定颜色
  const getHumidityColor = (humidity: number) => {
    if (humidity < 30) return "text-orange-600";
    if (humidity > 70) return "text-blue-600";
    return "text-green-600";
  };

  // 根据烟雾水平确定颜色
  const getSmokeColor = (smoke: number) => {
    if (smoke < 50) return "text-green-600";
    if (smoke < 100) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/30 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center mb-6">
        <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg p-2 mr-3">
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
        <h2 className="text-2xl font-bold text-gray-800">当前状态</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-orange-50/70 backdrop-blur-sm rounded-lg p-4 border border-orange-100/50 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">温度</p>
            <svg
              className="h-5 w-5 text-orange-500"
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
          <p className={`text-2xl font-bold ${getTempColor(data.temperature)}`}>
            {data.temperature.toFixed(1)} °C
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-linear-to-r from-blue-400 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max((data.temperature / 40) * 100, 0),
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-blue-50/70 backdrop-blur-sm rounded-lg p-4 border border-blue-100/50 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">湿度</p>
            <svg
              className="h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p
            className={`text-2xl font-bold ${getHumidityColor(data.humidity)}`}
          >
            {data.humidity.toFixed(1)} %
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-linear-to-r from-yellow-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.humidity}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">烟雾水平</p>
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <p
            className={`text-2xl font-bold ${getSmokeColor(data.smoke_level)}`}
          >
            {data.smoke_level.toFixed(1)} ppm
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                data.smoke_level < 50
                  ? "bg-green-500"
                  : data.smoke_level < 100
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${Math.min((data.smoke_level / 200) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-green-50/70 backdrop-blur-sm rounded-lg p-4 border border-green-100/50 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">风扇状态</p>
            <svg
              className="h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                data.fan_on ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <p
              className={`text-2xl font-bold ${
                data.fan_on ? "text-green-600" : "text-gray-400"
              }`}
            >
              {data.fan_on ? "运行中" : "已关闭"}
            </p>
          </div>
        </div>

        <div className="bg-purple-50/70 backdrop-blur-sm rounded-lg p-4 border border-purple-100/50 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">风扇速度</p>
            <svg
              className="h-5 w-5 text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {(data.fan_speed * 100).toFixed(0)} %
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-linear-to-r from-purple-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.fan_speed * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-red-50/70 backdrop-blur-sm rounded-lg p-4 border border-red-100/50 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">警报状态</p>
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                data.warning_on ? "bg-red-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <p
              className={`text-2xl font-bold ${
                data.warning_on ? "text-red-600" : "text-gray-400"
              }`}
            >
              {data.warning_on ? "已触发" : "正常"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
