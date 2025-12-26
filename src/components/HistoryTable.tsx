// src/components/HistoryTable.tsx

import type { HistoryDataItem } from "../types";

interface HistoryTableProps {
  data: HistoryDataItem[] | null;
  isLoading: boolean;
  error: string | null;
}

export const HistoryTable = ({ data, isLoading, error }: HistoryTableProps) => {
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
          <span className="text-blue-700 font-medium">加载历史数据中...</span>
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
          <span className="text-red-700 font-medium">错误: {error}</span>
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
          <span className="text-gray-700 font-medium">暂无历史数据</span>
        </div>
      </div>
    );

  // 根据温度值确定颜色
  const getTempColor = (temp: number) => {
    if (temp < 18) return "text-blue-600 bg-blue-50";
    if (temp > 28) return "text-red-600 bg-red-50";
    return "text-green-600 bg-green-50";
  };

  // 根据湿度值确定颜色
  const getHumidityColor = (humidity: number) => {
    if (humidity < 30) return "text-orange-600 bg-orange-50";
    if (humidity > 70) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  // 根据烟雾水平确定颜色
  const getSmokeColor = (smoke: number) => {
    if (smoke < 50) return "text-green-600 bg-green-50";
    if (smoke < 100) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-linear-to-r from-purple-500 to-pink-600 rounded-lg p-2 mr-3">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">历史数据</h2>
        </div>
        <div className="text-sm text-gray-500">共 {data.length} 条记录</div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-linear-to-r from-gray-50 to-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                时间戳
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                温度 (°C)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                湿度 (%)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                烟雾 (ppm)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                风扇状态
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                风扇速度 (%)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={`transition-all duration-200 hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                  {formatTimestamp(item.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTempColor(
                      item.temperature
                    )}`}
                  >
                    {item.temperature.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHumidityColor(
                      item.humidity
                    )}`}
                  >
                    {item.humidity.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSmokeColor(
                      item.smoke_level
                    )}`}
                  >
                    {item.smoke_level.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                      item.fan_on
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1.5 ${
                        item.fan_on ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    {item.fan_on ? "运行中" : "已关闭"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-linear-to-r from-purple-400 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.fan_speed * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {(item.fan_speed * 100).toFixed(0)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
