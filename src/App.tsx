// src/App.tsx

import { useState, useEffect } from "react";
import { StatusPanel } from "./components/StatusPanel";
import { HistoryTable } from "./components/HistoryTable";
import { HistoryChart } from "./components/HistoryChart";
import { fetchStatus, fetchHistory } from "./services/api";
import type { StatusData, HistoryDataItem } from "./types";

function App() {
  // 状态数据
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryDataItem[] | null>(
    null
  );

  // 加载和错误状态
  const [statusLoading, setStatusLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // 获取数据 - 初始加载 + 轮询
  useEffect(() => {
    let statusIntervalId: number | null = null;
    let historyIntervalId: number | null = null;
    let isMounted = true;
    let initialStatusLoaded = false;
    let initialHistoryLoaded = false;

    const loadStatus = async (isInitial = false) => {
      try {
        if (isInitial && !initialStatusLoaded) {
          setStatusLoading(true);
        }
        setStatusError(null);
        const status = await fetchStatus();
        if (isMounted) {
          setStatusData(status);
          if (isInitial && !initialStatusLoaded) {
            initialStatusLoaded = true;
            setStatusLoading(false);
          }
        }
      } catch (e: unknown) {
        if (isMounted) {
          setStatusError(e instanceof Error ? e.message : "未知错误");
          if (isInitial && !initialStatusLoaded) {
            setStatusLoading(false);
            initialStatusLoaded = true;
          }
        }
      }
    };

    const loadHistory = async (isInitial = false) => {
      try {
        if (isInitial && !initialHistoryLoaded) {
          setHistoryLoading(true);
        }
        setHistoryError(null);
        const history = await fetchHistory(25); // 获取最近25条
        if (isMounted) {
          setHistoryData(history);
          if (isInitial && !initialHistoryLoaded) {
            initialHistoryLoaded = true;
            setHistoryLoading(false);
          }
        }
      } catch (e: unknown) {
        if (isMounted) {
          setHistoryError(e instanceof Error ? e.message : "未知错误");
          if (isInitial && !initialHistoryLoaded) {
            setHistoryLoading(false);
            initialHistoryLoaded = true;
          }
        }
      }
    };

    // 初始加载
    loadStatus(true);
    loadHistory(true);

    // 设置轮询：状态每3秒，历史每30秒
    statusIntervalId = window.setInterval(() => loadStatus(false), 3000);
    historyIntervalId = window.setInterval(() => loadHistory(false), 30000);

    // 清理函数
    return () => {
      isMounted = false;
      if (statusIntervalId !== null) clearInterval(statusIntervalId);
      if (historyIntervalId !== null) clearInterval(historyIntervalId);
    };
  }, []); // 依赖数组为空，因为我们只需要在挂载时设置轮询

  return (
    <div className="min-h-screen flowing-gradient-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6 transition-all duration-500 hover:shadow-2xl border border-white/30">
          <div className="flex items-center">
            <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl p-3 mr-4 shadow-lg">
              <svg
                className="h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                车间环境监控仪表板
              </h1>
              <p className="text-gray-600 mt-1">
                实时监控车间环境参数和历史数据
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <StatusPanel
              data={statusData}
              isLoading={statusLoading}
              error={statusError}
            />
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="h-5 w-5 text-indigo-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              系统状态
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-sm font-medium text-green-800">
                  数据连接
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm text-green-600">正常</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-sm font-medium text-blue-800">
                  更新频率
                </span>
                <span className="text-sm text-blue-600">每3秒</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                <span className="text-sm font-medium text-purple-800">
                  数据记录
                </span>
                <span className="text-sm text-purple-600">
                  {historyData ? historyData.length : 0} 条
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <HistoryChart
              data={historyData}
              isLoading={historyLoading}
              error={historyError}
            />
          </div>
          <div className="lg:col-span-1">
            <HistoryTable
              data={historyData}
              isLoading={historyLoading}
              error={historyError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
