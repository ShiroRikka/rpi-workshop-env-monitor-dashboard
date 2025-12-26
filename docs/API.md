# 车间环境监控系统 API 文档

> 📖 **相关文档**: [项目概述](../README.md) | [组件文档](COMPONENTS.md) | [开发指南](DEVELOPMENT.md) | [文档中心](README.md)

## 目录

- [API概述](#api概述)
- [认证和安全](#认证和安全)
- [API端点](#api端点)
  - [获取当前状态](#获取当前状态)
  - [获取历史数据](#获取历史数据)
- [数据模型](#数据模型)
- [错误处理](#错误处理)
- [使用示例](#使用示例)
- [API限制和注意事项](#api限制和注意事项)

## API概述

车间环境监控系统API提供实时环境数据和历史数据查询功能，用于监控车间内的温度、湿度、烟雾水平等环境参数。

### 基础信息

- **基础URL**: `http://192.168.3.16:8000`
- **API版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8
- **时区**: UTC+8 (北京时间)

### 支持的HTTP方法

- `GET`: 获取数据

### 内容类型

所有API请求和响应均使用JSON格式：
```
Content-Type: application/json
```

## 认证和安全

当前版本的API不需要身份验证，所有端点都是公开的。

**注意**: 在生产环境中，建议添加适当的身份验证机制，如API密钥或OAuth令牌，以确保数据安全。

## API端点

### 获取当前状态

获取车间环境的当前实时状态数据。

#### 请求信息

- **方法**: `GET`
- **路径**: `/status`
- **描述**: 获取当前环境参数的实时数据

#### 请求参数

无

#### 请求示例

```bash
curl -X GET "http://192.168.3.16:8000/status" \
     -H "Content-Type: application/json"
```

#### 响应格式

成功响应返回包含当前环境状态数据的JSON对象：

```json
{
  "temperature": 23.5,
  "humidity": 65.2,
  "smoke_level": 12.8,
  "fan_on": true,
  "fan_speed": 0.75,
  "warning_on": false
}
```

#### 响应字段说明

| 字段名 | 类型 | 描述 | 示例值 |
|--------|------|------|--------|
| temperature | number | 当前温度，单位为摄氏度(°C) | 23.5 |
| humidity | number | 当前湿度，单位为百分比(%) | 65.2 |
| smoke_level | number | 烟雾水平，单位为ppm | 12.8 |
| fan_on | boolean | 风扇是否开启 | true |
| fan_speed | number | 风扇速度，范围0-1，表示百分比 | 0.75 |
| warning_on | boolean | 警报是否触发 | false |

#### 状态码说明

| 状态码 | 描述 |
|--------|------|
| 200 | 请求成功，返回当前状态数据 |
| 500 | 服务器内部错误 |

#### 错误响应示例

```json
{
  "error": "Internal server error",
  "message": "Failed to retrieve status data"
}
```

---

### 获取历史数据

获取车间环境的历史数据记录。

#### 请求信息

- **方法**: `GET`
- **路径**: `/history`
- **描述**: 获取指定数量的历史环境数据记录

#### 请求参数

| 参数名 | 类型 | 必需 | 默认值 | 描述 |
|--------|------|------|--------|------|
| limit | integer | 否 | 100 | 返回的数据条数，最大值为1000 |

#### 请求示例

```bash
# 获取默认数量(100条)的历史数据
curl -X GET "http://192.168.3.16:8000/history" \
     -H "Content-Type: application/json"

# 获取指定数量的历史数据
curl -X GET "http://192.168.3.16:8000/history?limit=50" \
     -H "Content-Type: application/json"
```

#### 响应格式

成功响应返回包含历史数据记录的JSON数组：

```json
[
  {
    "id": 1,
    "timestamp": "2023-12-26T09:15:30.123Z",
    "temperature": 23.5,
    "humidity": 65.2,
    "smoke_level": 12.8,
    "fan_on": true,
    "fan_speed": 0.75,
    "warning_on": false
  },
  {
    "id": 2,
    "timestamp": "2023-12-26T09:15:33.456Z",
    "temperature": 23.6,
    "humidity": 65.1,
    "smoke_level": 12.9,
    "fan_on": true,
    "fan_speed": 0.75,
    "warning_on": false
  }
]
```

#### 响应字段说明

| 字段名 | 类型 | 描述 | 示例值 |
|--------|------|------|--------|
| id | number | 记录的唯一标识符 | 1 |
| timestamp | string | 数据记录的时间戳，ISO 8601格式 | "2023-12-26T09:15:30.123Z" |
| temperature | number | 温度，单位为摄氏度(°C) | 23.5 |
| humidity | number | 湿度，单位为百分比(%) | 65.2 |
| smoke_level | number | 烟雾水平，单位为ppm | 12.8 |
| fan_on | boolean | 风扇是否开启 | true |
| fan_speed | number | 风扇速度，范围0-1，表示百分比 | 0.75 |
| warning_on | boolean | 警报是否触发 | false |

#### 状态码说明

| 状态码 | 描述 |
|--------|------|
| 200 | 请求成功，返回历史数据数组 |
| 400 | 请求参数错误 |
| 500 | 服务器内部错误 |

#### 错误响应示例

```json
{
  "error": "Bad request",
  "message": "Invalid limit parameter. Must be between 1 and 1000."
}
```

## 数据模型

### StatusData

当前状态数据模型：

```typescript
interface StatusData {
  temperature: number;    // 温度 (°C)
  humidity: number;       // 湿度 (%)
  smoke_level: number;    // 烟雾水平 (ppm)
  fan_on: boolean;        // 风扇是否开启
  fan_speed: number;      // 风扇速度 (0-1)
  warning_on: boolean;    // 警报是否触发
}
```

### HistoryDataItem

历史数据记录模型：

```typescript
interface HistoryDataItem {
  id: number;             // 记录ID
  timestamp: string;      // 时间戳 (ISO格式)
  temperature: number;    // 温度 (°C)
  humidity: number;       // 湿度 (%)
  smoke_level: number;    // 烟雾水平 (ppm)
  fan_on: boolean;        // 风扇是否开启
  fan_speed: number;      // 风扇速度 (0-1)
  warning_on: boolean;    // 警报是否触发
}
```

### ErrorResponse

错误响应模型：

```typescript
interface ErrorResponse {
  error: string;          // 错误类型
  message: string;        // 错误详细信息
}
```

## 错误处理

### 错误响应格式

所有API错误都遵循统一的响应格式：

```json
{
  "error": "错误类型",
  "message": "错误详细信息"
}
```

### 常见错误类型

| 错误类型 | HTTP状态码 | 描述 | 解决方案 |
|----------|------------|------|----------|
| Internal server error | 500 | 服务器内部错误 | 稍后重试或联系系统管理员 |
| Bad request | 400 | 请求参数错误 | 检查请求参数格式和值 |
| Not found | 404 | 请求的资源不存在 | 检查请求URL是否正确 |
| Service unavailable | 503 | 服务暂时不可用 | 稍后重试 |

### 错误处理最佳实践

1. **检查HTTP状态码**: 首先检查响应的状态码，确定请求是否成功
2. **解析错误信息**: 对于非200状态码，解析响应体中的错误信息
3. **实现重试机制**: 对于临时性错误(如5xx状态码)，实现适当的重试逻辑
4. **记录错误日志**: 记录详细的错误信息以便调试

## 使用示例

### JavaScript/TypeScript 示例

```typescript
// 获取当前状态
async function getCurrentStatus() {
  try {
    const response = await fetch('http://192.168.3.16:8000/status');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('当前状态:', data);
    return data;
  } catch (error) {
    console.error('获取状态失败:', error);
    throw error;
  }
}

// 获取历史数据
async function getHistoryData(limit = 100) {
  try {
    const response = await fetch(`http://192.168.3.16:8000/history?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('历史数据:', data);
    return data;
  } catch (error) {
    console.error('获取历史数据失败:', error);
    throw error;
  }
}

// 使用示例
(async () => {
  try {
    const status = await getCurrentStatus();
    const history = await getHistoryData(50);
    
    console.log('温度:', status.temperature);
    console.log('历史记录数:', history.length);
  } catch (error) {
    console.error('API调用失败:', error);
  }
})();
```

### Python 示例

```python
import requests
import json

# API基础URL
BASE_URL = "http://192.168.3.16:8000"

def get_current_status():
    """获取当前状态"""
    try:
        response = requests.get(f"{BASE_URL}/status")
        response.raise_for_status()  # 检查HTTP错误
        
        data = response.json()
        print("当前状态:", json.dumps(data, indent=2, ensure_ascii=False))
        return data
    except requests.exceptions.RequestException as e:
        print(f"获取状态失败: {e}")
        raise

def get_history_data(limit=100):
    """获取历史数据"""
    try:
        params = {"limit": limit}
        response = requests.get(f"{BASE_URL}/history", params=params)
        response.raise_for_status()  # 检查HTTP错误
        
        data = response.json()
        print(f"历史数据 ({len(data)} 条):", json.dumps(data[:2], indent=2, ensure_ascii=False))
        return data
    except requests.exceptions.RequestException as e:
        print(f"获取历史数据失败: {e}")
        raise

# 使用示例
if __name__ == "__main__":
    try:
        status = get_current_status()
        history = get_history_data(50)
        
        print(f"温度: {status['temperature']}°C")
        print(f"历史记录数: {len(history)}")
    except Exception as e:
        print(f"API调用失败: {e}")
```

### React Hook 示例

```typescript
import { useState, useEffect } from 'react';

// 自定义Hook：获取当前状态
export function useStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://192.168.3.16:8000/status');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const statusData = await response.json();
        setData(statusData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // 设置轮询，每3秒更新一次
    const interval = setInterval(fetchStatus, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}

// 自定义Hook：获取历史数据
export function useHistory(limit = 100) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://192.168.3.16:8000/history?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const historyData = await response.json();
        setData(historyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    
    // 设置轮询，每30秒更新一次
    const interval = setInterval(fetchHistory, 30000);
    
    return () => clearInterval(interval);
  }, [limit]);

  return { data, loading, error };
}
```

## API限制和注意事项

### 请求频率限制

- **状态API (/status)**: 建议每3-5秒请求一次，过于频繁的请求可能导致服务器负载过高
- **历史数据API (/history)**: 建议每30-60秒请求一次，历史数据更新频率较低

### 数据限制

- **历史数据查询**: 单次请求最多返回1000条记录
- **时间范围**: 历史数据保留期限取决于服务器配置，通常为30天
- **数据精度**: 温度精度为0.1°C，湿度精度为0.1%，烟雾水平精度为0.1ppm

### 注意事项

1. **网络连接**: 确保客户端与服务器(192.168.3.16:8000)之间的网络连接正常
2. **时区处理**: 所有时间戳均为UTC时间，客户端需要根据本地时区进行转换
3. **错误处理**: 实现完善的错误处理机制，避免因API错误导致应用崩溃
4. **数据缓存**: 对于不常变化的数据，可以适当缓存以减少API请求
5. **轮询优化**: 在页面不可见时暂停轮询，以减少不必要的网络请求

### 性能优化建议

1. **批量请求**: 如果需要多个数据点，尽量使用单次请求获取更多数据
2. **数据压缩**: 对于大量历史数据，考虑使用数据压缩技术
3. **增量更新**: 对于实时监控，考虑实现增量更新机制
4. **本地缓存**: 在客户端实现适当的缓存策略，减少重复请求

### 故障排除

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 连接超时 | 网络问题或服务器不可达 | 检查网络连接和服务器状态 |
| 数据格式错误 | API版本不匹配 | 确认API版本和文档一致性 |
| 权限拒绝 | IP限制或防火墙设置 | 检查服务器访问控制配置 |
| 数据不完整 | 传感器故障或数据采集问题 | 联系系统管理员检查硬件状态 |

---

## 更新日志

### v1.0.0 (2023-12-26)
- 初始版本发布
- 提供状态查询和历史数据查询功能
- 支持JSON格式数据交换

---

## 📚 相关文档

- [项目概述](../README.md) - 了解项目基本情况和功能特性
- [组件文档](COMPONENTS.md) - 了解前端组件的详细说明
- [开发指南](DEVELOPMENT.md) - 了解开发环境设置和项目配置
- [文档中心](README.md) - 查看所有文档的导航索引

如有任何问题或建议，请联系系统管理员。