# 车间环境监控系统 - 开发指南

> 📖 **相关文档**: [项目概述](../README.md) | [API接口文档](API.md) | [组件文档](COMPONENTS.md) | [文档中心](README.md)

本文档为车间环境监控系统项目的详细开发指南，包含开发环境设置、项目配置、开发工作流、调试技巧、性能优化和部署指南等内容。

## 目录

1. [开发环境设置](#开发环境设置)
2. [项目配置详解](#项目配置详解)
3. [开发工作流](#开发工作流)
4. [调试指南](#调试指南)
5. [性能优化](#性能优化)
6. [部署指南](#部署指南)
7. [扩展开发](#扩展开发)

## 开发环境设置

### 必需软件和版本要求

| 软件 | 最低版本 | 推荐版本 | 说明 |
|------|----------|----------|------|
| Node.js | 18.0.0 | 20.x LTS | JavaScript运行时环境 |
| pnpm | 8.0.0 | 8.x | 包管理器（推荐） |
| npm | 9.0.0 | 10.x | 备选包管理器 |
| Git | 2.30.0 | 2.40+ | 版本控制系统 |

#### 安装 Node.js

```bash
# 使用 nvm 安装 Node.js（推荐）
nvm install 20
nvm use 20

# 验证安装
node --version
npm --version
```

#### 安装 pnpm

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

### IDE推荐和配置

#### Visual Studio Code（推荐）

1. **安装 VS Code**
   ```bash
   # 下载并安装 VS Code
   # https://code.visualstudio.com/
   ```

2. **推荐扩展**
   - TypeScript and JavaScript Language Features (内置)
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Auto Rename Tag
   - Prettier - Code formatter
   - ESLint
   - GitLens
   - Thunder Client (API测试)

3. **VS Code 设置**

   创建 `.vscode/settings.json` 文件：

   ```json
   {
     "typescript.preferences.importModuleSpecifier": "relative",
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": "explicit"
     },
     "emmet.includeLanguages": {
       "typescript": "html",
       "typescriptreact": "html"
     },
     "files.associations": {
       "*.css": "tailwindcss"
     },
     "tailwindCSS.includeLanguages": {
       "typescript": "html",
       "typescriptreact": "html"
     }
   }
   ```

4. **VS Code 任务配置**

   创建 `.vscode/tasks.json` 文件：

   ```json
   {
     "version": "2.0.0",
     "tasks": [
       {
         "type": "npm",
         "script": "dev",
         "problemMatcher": [],
         "label": "npm: dev",
         "detail": "启动开发服务器",
         "isBackground": true
       },
       {
         "type": "npm",
         "script": "build",
         "problemMatcher": [],
         "label": "npm: build",
         "detail": "构建生产版本"
       },
       {
         "type": "npm",
         "script": "lint",
         "problemMatcher": [],
         "label": "npm: lint",
         "detail": "运行代码检查"
       }
     ]
   }
   ```

### 浏览器开发工具设置

#### Chrome DevTools

1. **安装 React Developer Tools**
   - 访问 Chrome Web Store
   - 搜索 "React Developer Tools"
   - 安装扩展

2. **推荐设置**
   - 打开开发者工具 (F12)
   - 在设置中启用 "Enable custom formatters"
   - 启用 "Show timestamps in console"
   - 启用 "Autocomplete from history"

3. **网络面板设置**
   - 启用 "Disable cache"
   - 设置 "Network throttling" 为 "No throttling"（开发时）

## 项目配置详解

### Vite配置说明

[`vite.config.ts`](vite.config.ts:1) 是项目的构建配置文件：

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

#### 高级配置选项

如需更复杂的配置，可以扩展为：

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://192.168.3.16:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
});
```

### TypeScript配置详解

项目使用多个TypeScript配置文件：

#### 主配置文件 [`tsconfig.json`](tsconfig.json:1)

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

#### 应用配置 [`tsconfig.app.json`](tsconfig.app.json:1)

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

#### Node.js配置 [`tsconfig.node.json`](tsconfig.node.json:1)

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

#### TypeScript配置说明

| 配置项 | 说明 | 推荐值 |
|--------|------|--------|
| `strict` | 启用所有严格类型检查选项 | `true` |
| `noUnusedLocals` | 检查未使用的局部变量 | `true` |
| `noUnusedParameters` | 检查未使用的参数 | `true` |
| `jsx` | 指定JSX生成方式 | `"react-jsx"` |
| `moduleResolution` | 模块解析策略 | `"bundler"` |
| `allowImportingTsExtensions` | 允许导入带.ts扩展名的文件 | `true` |

### ESLint配置和代码规范

[`eslint.config.js`](eslint.config.js:1) 文件定义了项目的代码规范：

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

#### 代码规范最佳实践

1. **命名约定**
   - 组件使用 PascalCase: `StatusPanel`
   - 函数和变量使用 camelCase: `fetchStatus`
   - 常量使用 UPPER_SNAKE_CASE: `API_BASE_URL`
   - 类型接口使用 PascalCase: `StatusData`

2. **文件组织**
   - 每个组件一个文件
   - 相关的类型定义放在 `types/` 目录
   - API调用放在 `services/` 目录

3. **代码格式化**
   - 使用 Prettier 进行代码格式化
   - 行长度限制为 80-100 字符
   - 使用 2 个空格缩进

### Tailwind CSS配置

项目使用 Tailwind CSS v4，配置通过 Vite 插件完成：

```typescript
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

#### 自定义样式

项目在 [`src/index.css`](src/index.css:1) 中定义了自定义样式：

```css
@import "tailwindcss";

/* 流光背景效果 */
@keyframes flowing-light {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 更多自定义样式... */
```

#### Tailwind CSS 最佳实践

1. **响应式设计**
   ```tsx
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     {/* 内容 */}
   </div>
   ```

2. **状态样式**
   ```tsx
   <div className={`px-4 py-2 rounded ${
     isActive 
       ? 'bg-blue-500 text-white' 
       : 'bg-gray-200 text-gray-700'
   }`}>
     {/* 内容 */}
   </div>
   ```

3. **组合工具类**
   ```tsx
   <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/30">
     {/* 内容 */}
   </div>
   ```

## 开发工作流

### 分支管理策略

项目采用 Git Flow 工作流：

#### 主要分支

- `main` - 生产环境代码
- `develop` - 开发环境代码
- `feature/*` - 功能开发分支
- `bugfix/*` - 错误修复分支
- `release/*` - 发布准备分支
- `hotfix/*` - 紧急修复分支

#### 分支操作示例

```bash
# 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-dashboard

# 开发完成后合并
git checkout develop
git merge feature/new-dashboard
git push origin develop

# 删除功能分支
git branch -d feature/new-dashboard
```

### 代码提交规范

#### 提交信息格式

```
type(scope): description

[optional body]

[optional footer]
```

#### 提交类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(dashboard): add temperature alert` |
| `fix` | 修复bug | `fix(api): handle network timeout` |
| `docs` | 文档更新 | `docs(readme): update installation guide` |
| `style` | 代码格式化 | `style(components): fix indentation` |
| `refactor` | 代码重构 | `refactor(services): extract API client` |
| `test` | 测试相关 | `test(components): add StatusPanel tests` |
| `chore` | 构建过程或辅助工具的变动 | `chore(deps): update React to 19.2.3` |

#### 提交示例

```bash
# 好的提交
git commit -m "feat(chart): add smoke level trend line"

# 带详细说明的提交
git commit -m "fix(api): handle network timeout

- Add retry mechanism for failed requests
- Show user-friendly error messages
- Implement exponential backoff strategy

Closes #123"
```

### 开发、测试、构建流程

#### 开发流程

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd learn-vite-react
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

4. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **开发代码**
   - 编写组件
   - 添加类型定义
   - 实现API调用
   - 添加样式

6. **代码检查**
   ```bash
   pnpm lint
   ```

7. **提交代码**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   git push origin feature/your-feature-name
   ```

#### 测试流程

1. **手动测试**
   - 在浏览器中测试功能
   - 检查响应式设计
   - 验证错误处理

2. **构建测试**
   ```bash
   pnpm build
   ```

3. **预览构建结果**
   ```bash
   pnpm preview
   ```

#### 构建流程

1. **生产构建**
   ```bash
   pnpm build
   ```

2. **分析构建结果**
   ```bash
   # 安装分析工具
   pnpm add -D rollup-plugin-visualizer
   
   # 在 vite.config.ts 中添加
   import { visualizer } from 'rollup-plugin-visualizer';
   
   export default defineConfig({
     plugins: [
       react(), 
       tailwindcss(),
       visualizer({ open: true })
     ],
   });
   ```

## 调试指南

### 前端调试技巧

#### React DevTools

1. **组件检查**
   - 选择组件查看props和state
   - 检查组件层次结构
   - 查看性能分析

2. **Profiler使用**
   ```tsx
   import { Profiler } from 'react';

   function onRenderCallback(id, phase, actualDuration) {
     console.log('Component render time:', actualDuration);
   }

   <Profiler id="StatusPanel" onRender={onRenderCallback}>
     <StatusPanel {...props} />
   </Profiler>
   ```

#### 浏览器调试

1. **Console调试**
   ```tsx
   // 使用console.log进行调试
   console.log('Status data:', statusData);
   
   // 使用console.table显示对象数组
   console.table(historyData);
   
   // 使用console.group组织日志
   console.group('API Calls');
   console.log('Fetching status...');
   console.log('Fetching history...');
   console.groupEnd();
   ```

2. **断点调试**
   - 在源代码中设置断点
   - 使用条件断点
   - 监视变量变化

3. **网络调试**
   - 检查API请求和响应
   - 模拟网络条件
   - 查看请求头和响应头

### API调试方法

#### 使用浏览器开发者工具

1. **网络面板**
   - 查看所有API请求
   - 检查请求状态码
   - 查看请求和响应数据

2. **控制台调试**
   ```tsx
   // 在api.ts中添加调试日志
   export const fetchStatus = async (): Promise<StatusData> => {
     console.log('Fetching status from:', `${API_BASE_URL}/status`);
     const response = await fetch(`${API_BASE_URL}/status`);
     console.log('Response status:', response.status);
     
     if (!response.ok) {
       console.error('Failed to fetch status:', response.statusText);
       throw new Error("Failed to fetch status");
     }
     
     const data = await response.json();
     console.log('Status data:', data);
     return data;
   };
   ```

#### 使用Thunder Client或Postman

1. **测试API端点**
   - GET `http://192.168.3.16:8000/status`
   - GET `http://192.168.3.16:8000/history?limit=25`

2. **检查响应格式**
   ```json
   // 预期的status响应格式
   {
     "temperature": 25.5,
     "humidity": 60.2,
     "smoke_level": 45.8,
     "fan_on": true,
     "fan_speed": 0.75,
     "warning_on": false
   }
   ```

### 常见问题排查

#### 问题1: API请求失败

**症状**: 控制台显示网络错误

**排查步骤**:
1. 检查API服务器是否运行
   ```bash
   curl http://192.168.3.16:8000/status
   ```

2. 检查CORS设置
   - 确保后端允许前端域名访问
   - 检查预检请求是否通过

3. 检查网络连接
   - 确认能够访问API服务器
   - 检查防火墙设置

**解决方案**:
```tsx
// 在api.ts中添加错误处理
export const fetchStatus = async (): Promise<StatusData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching status:', error);
    throw error;
  }
};
```

#### 问题2: 组件不更新

**症状**: 数据变化但UI不更新

**排查步骤**:
1. 检查state更新
   ```tsx
   // 确保正确更新state
   setStatusData(prevData => ({
     ...prevData,
     temperature: newTemperature
   }));
   ```

2. 检查依赖数组
   ```tsx
   // 确保useEffect依赖正确
   useEffect(() => {
     // 副作用逻辑
   }, [dependency]); // 确保包含所有依赖
   ```

3. 检查组件key属性
   ```tsx
   // 列表渲染时使用唯一key
   {data.map(item => (
     <div key={item.id}>{item.name}</div>
   ))}
   ```

#### 问题3: 样式不生效

**症状**: Tailwind CSS类不生效

**排查步骤**:
1. 检查类名拼写
2. 确保类名在Tailwind配置中存在
3. 检查CSS优先级

**解决方案**:
```tsx
// 使用!important提高优先级（谨慎使用）
<div className="bg-blue-500 !important">

// 或使用CSS模块
import styles from './Component.module.css';
<div className={styles.customClass}>
```

#### 问题4: TypeScript类型错误

**症状**: 类型检查失败

**排查步骤**:
1. 检查类型定义
   ```tsx
   // 确保类型定义正确
   interface StatusData {
     temperature: number;
     humidity: number;
     // ...
   }
   ```

2. 使用类型断言（谨慎使用）
   ```tsx
   const data = response.json() as StatusData;
   ```

3. 使用类型守卫
   ```tsx
   function isStatusData(obj: any): obj is StatusData {
     return typeof obj.temperature === 'number' &&
            typeof obj.humidity === 'number';
   }
   ```

## 性能优化

### 代码分割和懒加载

#### 路由级别的代码分割

```tsx
// 使用React.lazy进行组件懒加载
import { lazy, Suspense } from 'react';

const StatusPanel = lazy(() => import('./components/StatusPanel'));
const HistoryChart = lazy(() => import('./components/HistoryChart'));
const HistoryTable = lazy(() => import('./components/HistoryTable'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <StatusPanel {...props} />
      </Suspense>
      
      <Suspense fallback={<div>Loading chart...</div>}>
        <HistoryChart {...props} />
      </Suspense>
      
      <Suspense fallback={<div>Loading table...</div>}>
        <HistoryTable {...props} />
      </Suspense>
    </div>
  );
}
```

#### 动态导入

```tsx
// 按需加载模块
const loadChartModule = async () => {
  const { default: chartModule } = await import('./utils/chart');
  return chartModule;
};

// 使用动态导入
const handleChartClick = async () => {
  const chartUtils = await loadChartModule();
  chartUtils.createChart(data);
};
```

### 组件优化策略

#### React.memo优化

```tsx
// 使用React.memo避免不必要的重渲染
import React, { memo } from 'react';

interface StatusPanelProps {
  data: StatusData | null;
  isLoading: boolean;
  error: string | null;
}

export const StatusPanel = memo<StatusPanelProps>(({ data, isLoading, error }) => {
  // 组件逻辑
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.data === nextProps.data &&
         prevProps.isLoading === nextProps.isLoading &&
         prevProps.error === nextProps.error;
});
```

#### useMemo和useCallback优化

```tsx
import { useMemo, useCallback } from 'react';

function HistoryChart({ data }: HistoryChartProps) {
  // 使用useMemo缓存计算结果
  const chartData = useMemo(() => {
    return data
      ?.slice()
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(item => ({
        ...item,
        time: new Date(item.timestamp).toLocaleTimeString("zh-CN"),
      }));
  }, [data]);

  // 使用useCallback缓存函数
  const handleChartClick = useCallback((data: any) => {
    console.log('Chart clicked:', data);
  }, []);

  return (
    // 组件JSX
  );
}
```

#### 虚拟化长列表

```tsx
// 对于大量数据，考虑使用虚拟化
import { FixedSizeList as List } from 'react-window';

function VirtualizedTable({ data }: { data: HistoryDataItem[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {/* 渲染行内容 */}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={data.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### 构建优化

#### Vite构建优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 将React相关库打包在一起
          'react-vendor': ['react', 'react-dom'],
          // 将图表库单独打包
          'charts': ['recharts'],
          // 将工具库打包在一起
          'utils': ['date-fns', 'lodash'],
        },
      },
    },
    // 启用源码映射
    sourcemap: true,
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除console.log
        drop_debugger: true, // 移除debugger
      },
    },
  },
});
```

#### 资源优化

```tsx
// 图片懒加载
import { useState, useRef, useEffect } from 'react';

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="relative">
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {!isLoaded && <div className="animate-pulse bg-gray-200 h-full w-full" />}
    </div>
  );
}
```

## 部署指南

### 生产环境构建

#### 构建命令

```bash
# 标准构建
pnpm build

# 分析构建结果
pnpm build --mode analyze

# 自定义构建配置
pnpm build --mode production
```

#### 构建前检查

```bash
# 运行类型检查
pnpm run type-check

# 运行代码检查
pnpm run lint

# 运行测试（如果有）
pnpm run test
```

### 部署配置

#### Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 处理SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API代理
    location /api/ {
        proxy_pass http://192.168.3.16:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Docker部署

创建 `Dockerfile`:

```dockerfile
# 多阶段构建
FROM node:20-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package.json pnpm-lock.yaml ./

# 安装pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine

# 复制构建结果
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

部署命令:
```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 环境变量管理

#### 使用Vite环境变量

1. **创建环境文件**

   `.env.development`:
   ```env
   VITE_API_BASE_URL=http://192.168.3.16:8000
   VITE_APP_TITLE=车间环境监控系统 - 开发版
   VITE_REFRESH_INTERVAL=3000
   ```

   `.env.production`:
   ```env
   VITE_API_BASE_URL=https://api.your-domain.com
   VITE_APP_TITLE=车间环境监控系统
   VITE_REFRESH_INTERVAL=5000
   ```

2. **在代码中使用环境变量**

   ```tsx
   // src/services/api.ts
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

   // src/App.tsx
   const appTitle = import.meta.env.VITE_APP_TITLE || '车间环境监控系统';
   const refreshInterval = Number(import.meta.env.VITE_REFRESH_INTERVAL) || 3000;
   ```

3. **类型定义**

   创建 `src/vite-env.d.ts`:
   ```typescript
   /// <reference types="vite/client" />

   interface ImportMetaEnv {
     readonly VITE_API_BASE_URL: string;
     readonly VITE_APP_TITLE: string;
     readonly VITE_REFRESH_INTERVAL: string;
   }

   interface ImportMeta {
     readonly env: ImportMetaEnv;
   }
   ```

#### 运行时配置

对于需要运行时更改的配置，可以创建配置API:

```tsx
// src/config/index.ts
interface AppConfig {
  apiBaseUrl: string;
  refreshInterval: number;
  features: {
    charts: boolean;
    tables: boolean;
    alerts: boolean;
  };
}

const defaultConfig: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  refreshInterval: Number(import.meta.env.VITE_REFRESH_INTERVAL) || 3000,
  features: {
    charts: true,
    tables: true,
    alerts: true,
  },
};

export const getConfig = async (): Promise<AppConfig> => {
  try {
    // 尝试从远程加载配置
    const response = await fetch('/config.json');
    if (response.ok) {
      const remoteConfig = await response.json();
      return { ...defaultConfig, ...remoteConfig };
    }
  } catch (error) {
    console.warn('Failed to load remote config, using defaults');
  }
  
  return defaultConfig;
};
```

## 扩展开发

### 添加新功能模块

#### 1. 创建新组件

```tsx
// src/components/NewFeature.tsx
import { useState, useEffect } from 'react';
import type { NewFeatureData } from '../types';

interface NewFeatureProps {
  data: NewFeatureData | null;
  isLoading: boolean;
  error: string | null;
}

export const NewFeature = ({ data, isLoading, error }: NewFeatureProps) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">新功能</h2>
      {/* 组件内容 */}
    </div>
  );
};
```

#### 2. 添加类型定义

```typescript
// src/types/index.ts
// 添加新功能的类型定义
export interface NewFeatureData {
  id: number;
  name: string;
  value: number;
  timestamp: string;
}
```

#### 3. 创建API服务

```typescript
// src/services/api.ts
// 添加新功能的API调用
export const fetchNewFeature = async (): Promise<NewFeatureData> => {
  const response = await fetch(`${API_BASE_URL}/new-feature`);
  if (!response.ok) {
    throw new Error("Failed to fetch new feature data");
  }
  return response.json();
};
```

#### 4. 集成到主应用

```tsx
// src/App.tsx
import { NewFeature } from './components/NewFeature';
import { fetchNewFeature } from './services/api';
import type { NewFeatureData } from './types';

function App() {
  // 添加新功能的状态
  const [newFeatureData, setNewFeatureData] = useState<NewFeatureData | null>(null);
  const [newFeatureLoading, setNewFeatureLoading] = useState(true);
  const [newFeatureError, setNewFeatureError] = useState<string | null>(null);

  // 在useEffect中添加数据获取逻辑
  useEffect(() => {
    const loadNewFeature = async () => {
      try {
        setNewFeatureLoading(true);
        setNewFeatureError(null);
        const data = await fetchNewFeature();
        setNewFeatureData(data);
      } catch (e: unknown) {
        setNewFeatureError(e instanceof Error ? e.message : "未知错误");
      } finally {
        setNewFeatureLoading(false);
      }
    };

    loadNewFeature();
  }, []);

  return (
    <div className="min-h-screen flowing-gradient-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 现有组件 */}
        
        {/* 添加新功能组件 */}
        <div className="mt-6">
          <NewFeature
            data={newFeatureData}
            isLoading={newFeatureLoading}
            error={newFeatureError}
          />
        </div>
      </div>
    </div>
  );
}
```

### 集成第三方库

#### 1. 安装第三方库

```bash
# 安装日期处理库
pnpm add date-fns

# 安装状态管理库
pnpm add zustand

# 安装表单处理库
pnpm add react-hook-form @hookform/resolvers zod
```

#### 2. 创建工具模块

```typescript
// src/utils/date.ts
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (dateString: string, formatStr = 'yyyy-MM-dd HH:mm:ss') => {
  return format(parseISO(dateString), formatStr, { locale: zhCN });
};

export const formatRelativeTime = (dateString: string) => {
  const date = parseISO(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
  
  return formatDate(dateString, 'MM-dd HH:mm');
};
```

#### 3. 创建状态管理

```typescript
// src/store/useAppStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StatusData, HistoryDataItem } from '../types';

interface AppState {
  // 状态
  statusData: StatusData | null;
  historyData: HistoryDataItem[];
  isLoading: boolean;
  error: string | null;
  
  // 操作
  setStatusData: (data: StatusData | null) => void;
  setHistoryData: (data: HistoryDataItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 异步操作
  fetchStatus: () => Promise<void>;
  fetchHistory: (limit?: number) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // 初始状态
      statusData: null,
      historyData: [],
      isLoading: false,
      error: null,
      
      // 操作
      setStatusData: (data) => set({ statusData: data }),
      setHistoryData: (data) => set({ historyData: data }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // 异步操作
      fetchStatus: async () => {
        try {
          set({ isLoading: true, error: null });
          const data = await fetchStatus();
          set({ statusData: data, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '未知错误',
            isLoading: false 
          });
        }
      },
      
      fetchHistory: async (limit = 100) => {
        try {
          set({ isLoading: true, error: null });
          const data = await fetchHistory(limit);
          set({ historyData: data, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '未知错误',
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'app-store',
    }
  )
);
```

### 自定义主题和样式

#### 1. 创建主题配置

```typescript
// src/theme/index.ts
export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

export type Theme = typeof theme;
```

#### 2. 创建主题提供者

```tsx
// src/theme/ThemeProvider.tsx
import { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from './index';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};
```

#### 3. 使用主题

```tsx
// src/components/ThemedComponent.tsx
import { useTheme } from '../theme/ThemeProvider';

export const ThemedComponent = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.colors.primary[50],
        borderColor: theme.colors.primary[200],
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.md,
      }}
    >
      <h1 style={{ color: theme.colors.primary[700] }}>
        主题化组件
      </h1>
    </div>
  );
};
```

#### 4. 深色模式支持

```tsx
// src/theme/ThemeProvider.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { theme, Theme } from './index';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 从localStorage读取主题设置
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // 应用主题到document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 保存主题设置
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

#### 5. 主题切换组件

```tsx
// src/components/ThemeToggle.tsx
import { useTheme } from '../theme/ThemeProvider';

export const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      aria-label="切换主题"
    >
      {isDarkMode ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};
```

---

## 📚 相关文档

- [项目概述](../README.md) - 了解项目基本情况和功能特性
- [API接口文档](API.md) - 了解API接口的详细说明
- [组件文档](COMPONENTS.md) - 了解前端组件的详细说明
- [文档中心](README.md) - 查看所有文档的导航索引

本开发指南涵盖了车间环境监控系统项目的各个方面，从环境设置到部署上线，为开发者提供了全面的参考。如有任何问题或建议，请随时提出反馈。