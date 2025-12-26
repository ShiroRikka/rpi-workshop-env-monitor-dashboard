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
      <div className="p-4 bg-blue-100 text-blue-700">Loading history...</div>
    );
  if (error)
    return <div className="p-4 bg-red-100 text-red-700">Error: {error}</div>;
  if (!data || data.length === 0)
    return (
      <div className="p-4 bg-gray-100 text-gray-700">
        No history data available.
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">历史数据</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Temp (°C)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Humidity (%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Smoke (ppm)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Speed (%)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.temperature.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.humidity.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.smoke_level.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.fan_on
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.fan_on ? "ON" : "OFF"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(item.fan_speed * 100).toFixed(0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
