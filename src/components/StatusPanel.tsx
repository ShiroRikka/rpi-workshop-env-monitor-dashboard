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
      <div className="p-4 bg-blue-100 text-blue-700">Loading status...</div>
    );
  if (error)
    return <div className="p-4 bg-red-100 text-red-700">Error: {error}</div>;
  if (!data)
    return (
      <div className="p-4 bg-gray-100 text-gray-700">
        No status data available.
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">当前状态</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Temperature</p>
          <p className="text-xl font-semibold text-gray-800">
            {data.temperature.toFixed(1)} °C
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Humidity</p>
          <p className="text-xl font-semibold text-gray-800">
            {data.humidity.toFixed(1)} %
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Smoke Level</p>
          <p className="text-xl font-semibold text-gray-800">
            {data.smoke_level.toFixed(1)} ppm
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Fan Status</p>
          <p
            className={`text-xl font-semibold ${
              data.fan_on ? "text-green-600" : "text-gray-400"
            }`}
          >
            {data.fan_on ? "ON" : "OFF"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Fan Speed</p>
          <p className="text-xl font-semibold text-gray-800">
            {(data.fan_speed * 100).toFixed(0)} %
          </p>
        </div>
      </div>
    </div>
  );
};
