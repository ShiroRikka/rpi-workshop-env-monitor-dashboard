// src/types/index.ts

// 当前状态的数据结构
export interface StatusData {
  temperature: number;
  humidity: number;
  smoke_level: number;
  fan_on: boolean;
  fan_speed: number;
  warning_on: boolean;
}

// 历史数据单条记录的结构
export interface HistoryDataItem {
  id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  smoke_level: number;
  fan_on: boolean;
  fan_speed: number;
  warning_on: boolean;
}
