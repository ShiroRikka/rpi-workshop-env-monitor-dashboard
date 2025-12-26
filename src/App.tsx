// src/App.tsx

import { useState, useEffect } from "react";
import { StatusPanel } from "./components/StatusPanel";
import { HistoryTable } from "./components/HistoryTable";
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

  // 获取数据
  useEffect(() => {
    const getData = async () => {
      try {
        setStatusLoading(true);
        setStatusError(null);
        const status = await fetchStatus();
        setStatusData(status);
      } catch (e: any) {
        setStatusError(e.message);
      } finally {
        setStatusLoading(false);
      }

      try {
        setHistoryLoading(true);
        setHistoryError(null);
        const history = await fetchHistory(100); // 获取最近100条
        setHistoryData(history);
      } catch (e: any) {
        setHistoryError(e.message);
      } finally {
        setHistoryLoading(false);
      }
    };

    getData();
  }, []); // 空依赖数组表示此 effect 仅在组件首次挂载时运行一次

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Environmental Monitor Dashboard
        </h1>

        <StatusPanel
          data={statusData}
          isLoading={statusLoading}
          error={statusError}
        />

        <HistoryTable
          data={historyData}
          isLoading={historyLoading}
          error={historyError}
        />
      </div>
    </div>
  );
}

export default App;
