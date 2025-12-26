// src/types/index.ts

// 当前状态的数据结构
export interface StatusData {
  temperature: number;
  humidity: number;
  smoke_level: number;
  fan_on: boolean;
  fan_speed: number;
}

// 历史数据单条记录的结构
export interface HistoryDataItem {
  id: number;
  timestamp: string; // API 返回的是字符串，前端可以按需处理为 Date 对象
  temperature: number;
  humidity: number;
  smoke_level: number;
  fan_on: boolean;
  fan_speed: number;
}
