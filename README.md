# 车间环境监控系统

![React](https://img.shields.io/badge/React-19.2.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC)
![Recharts](https://img.shields.io/badge/Recharts-3.6.0-orange)

一个基于Vite+React的现代化车间环境监控系统前端应用，用于实时监控车间环境参数（温度、湿度、烟雾水平）并展示历史数据趋势。

## 🌟 功能特性

- **实时数据监控** - 每3秒自动刷新环境参数数据
- **历史数据可视化** - 使用图表展示历史数据趋势
- **响应式设计** - 适配各种屏幕尺寸，从手机到桌面设备
- **现代化UI** - 采用毛玻璃效果和流光背景的现代化界面设计
- **数据表格** - 详细的历史数据表格展示
- **状态指示器** - 直观的设备状态和警报状态显示
- **错误处理** - 完善的错误处理和加载状态显示

## 🛠️ 技术栈

- **前端框架**: React 19.2.3
- **构建工具**: Vite 7.3.0
- **类型系统**: TypeScript 5.9.3
- **样式框架**: Tailwind CSS 4.1.18
- **图表库**: Recharts 3.6.0
- **包管理器**: pnpm

## 📋 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm >= 9.0.0
- 现代浏览器支持 (Chrome, Firefox, Safari, Edge)

## 🚀 快速开始

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build
```

### 预览生产版本

```bash
# 使用 pnpm
pnpm preview

# 或使用 npm
npm run preview
```

### 代码检查

```bash
# 使用 pnpm
pnpm lint

# 或使用 npm
npm run lint
```

## 📁 项目结构

```
learn-vite-react/
├── public/                 # 静态资源目录
├── src/                    # 源代码目录
│   ├── components/         # React组件
│   │   ├── StatusPanel.tsx # 状态面板组件
│   │   ├── HistoryChart.tsx# 历史数据图表组件
│   │   └── HistoryTable.tsx# 历史数据表格组件
│   ├── services/           # API服务
│   │   └── api.ts         # API接口定义
│   ├── types/              # TypeScript类型定义
│   │   └── index.ts       # 数据类型定义
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 应用入口文件
│   └── index.css          # 全局样式
├── .gitignore             # Git忽略文件
├── eslint.config.js       # ESLint配置
├── index.html             # HTML模板
├── package.json           # 项目依赖和脚本
├── pnpm-lock.yaml         # pnpm锁定文件
├── tsconfig.json          # TypeScript配置
├── tsconfig.app.json      # 应用TypeScript配置
├── tsconfig.node.json     # Node.js TypeScript配置
├── vite.config.ts         # Vite配置
└── README.md              # 项目文档
```

## 🧩 组件概述

### StatusPanel 组件

实时显示当前环境参数的面板组件，包括：
- 温度显示（带颜色指示）
- 湿度显示（带颜色指示）
- 烟雾水平显示（带颜色指示）
- 风扇状态和速度
- 警报状态

### HistoryChart 组件

使用Recharts库实现的历史数据趋势图，支持：
- 多参数（温度、湿度、烟雾）同时显示
- 时间轴缩放
- 数据点悬停提示
- 最新数据统计卡片

### HistoryTable 组件

详细的历史数据表格，提供：
- 完整的历史数据记录
- 数据状态颜色编码
- 响应式表格设计
- 数据排序和格式化

## 🔌 API接口说明

应用通过以下API接口与后端通信：

### 获取当前状态

```typescript
GET /status
```

返回当前环境状态数据：

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

### 获取历史数据

```typescript
GET /history?limit={number}
```

返回指定数量的历史数据记录：

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

**注意**: 默认API基础URL为 `http://192.168.3.16:8000`，如需修改请编辑 [`src/services/api.ts`](src/services/api.ts:6) 文件。

## 📚 详细文档

更多详细文档请参考我们的[文档中心](docs/README.md)，包括：

- **[API接口文档](docs/API.md)** - 详细的API接口说明和使用示例
- **[组件文档](docs/COMPONENTS.md)** - 前端组件的详细说明和扩展指南
- **[开发指南](docs/DEVELOPMENT.md)** - 开发环境设置、项目配置和开发工作流

## 🛠️ 开发指南

### 添加新组件

1. 在 `src/components/` 目录下创建新组件文件
2. 使用TypeScript定义组件Props接口
3. 遵循现有的代码风格和命名约定
4. 在 `App.tsx` 中导入并使用新组件

### 修改API接口

1. 编辑 `src/services/api.ts` 文件
2. 更新 `src/types/index.ts` 中的类型定义
3. 在使用API的组件中处理新的数据结构

### 样式定制

1. 全局样式在 `src/index.css` 中定义
2. 组件特定样式使用Tailwind CSS类
3. 自定义CSS变量和动画效果在全局样式中定义

### 类型定义

所有数据类型定义在 `src/types/index.ts` 中，确保类型安全：

```typescript
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
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 严格模式
- 使用 Prettier 格式化代码（推荐）
- 编写有意义的提交信息

### 提交信息格式

```
type(scope): description

[optional body]

[optional footer]
```

类型：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue: [GitHub Issues](https://github.com/your-username/learn-vite-react/issues)
- 邮箱: your-email@example.com

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！