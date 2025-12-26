// src/services/api.ts

import type { StatusData, HistoryDataItem } from "../types";

// 假设您的 FastAPI 服务运行在本地 8000 端口
const API_BASE_URL = "http://192.168.3.16:8000";

/**
 * 获取当前设备状态
 */
export const fetchStatus = async (): Promise<StatusData> => {
  const response = await fetch(`${API_BASE_URL}/status`);
  if (!response.ok) {
    throw new Error("Failed to fetch status");
  }
  return response.json();
};

/**
 * 获取历史数据
 * @param limit - 返回的数据条数
 */
export const fetchHistory = async (
  limit: number = 100
): Promise<HistoryDataItem[]> => {
  const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }
  return response.json();
};
