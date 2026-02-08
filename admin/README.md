# AuraKey Admin 管理后台

一个基于 React + TypeScript + Vite + TailwindCSS + Sass 的现代化前端管理后台系统。

## 功能特性

- ✅ 用户认证和授权
- ✅ 响应式设计
- ✅ TailwindCSS 样式系统
- ✅ Zustand 状态管理
- ✅ Axios API 请求
- ✅ TypeScript 完全支持
- ✅ 快速开发体验（Vite）

## 技术栈

- **框架**: React 19
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS + Sass
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **路由**: React Router v7
- **工具库**: js-cookie

## 项目结构

```
src/
├── components/        # UI 组件
│   ├── Layout.tsx     # 布局组件
│   ├── Sidebar.tsx    # 侧边栏
│   ├── Header.tsx     # 页头
│   ├── Card.tsx       # 卡片组件
│   └── ProtectedRoute.tsx  # 受保护路由
├── pages/             # 页面
│   ├── Login.tsx      # 登录页
│   └── Dashboard.tsx  # 仪表板
├── services/          # API 服务
│   ├── api.ts         # Axios 实例
│   └── auth.ts        # 认证服务
├── stores/            # Zustand 状态管理
│   └── auth.ts        # 认证状态
├── types/             # TypeScript 类型
│   └── index.ts       # 类型定义
├── utils/             # 工具函数
│   └── auth.ts        # 认证工具
├── hooks/             # 自定义 Hook
├── App.tsx            # 主应用
├── main.tsx           # 入口文件
└── index.css          # 全局样式
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 环境配置

创建 `.env` 文件，配置 API 地址：

```env
VITE_API_URL=http://localhost:3000/api
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 预览生产构建

```bash
npm preview
```

## 默认登录凭证

- **用户名**: admin
- **密码**: admin123

## API 集成

### 认证流程

1. 用户在登录页输入用户名和密码
2. 调用 `/auth/login` 获取 token
3. Token 保存到本地存储和 Cookie
4. 所有 API 请求自动附加 Authorization 头
5. Token 过期或无效时自动重定向到登录页

### 添加新的 API 服务

在 `src/services/` 目录下创建新的服务文件：

```typescript
// src/services/user.ts
import apiClient from './api';
import { ApiResponse, ListResponse, User, PaginationParams } from '../types';

export const userService = {
  getUsers: async (params: PaginationParams) => {
    const response = await apiClient.get<any, ApiResponse<ListResponse<User>>>('/users', { params });
    return response.data!;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get<any, ApiResponse<User>>(`/users/${id}`);
    return response.data!;
  },

  createUser: async (data: Omit<User, 'id'>) => {
    const response = await apiClient.post<any, ApiResponse<User>>('/users', data);
    return response.data!;
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put<any, ApiResponse<User>>(`/users/${id}`, data);
    return response.data!;
  },

  deleteUser: async (id: string) => {
    await apiClient.delete(`/users/${id}`);
  },
};
```

### 在组件中使用

```typescript
import { useEffect, useState } from 'react';
import { userService } from '../services/user';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService.getUsers({ page: 1, pageSize: 10 })
      .then(response => setUsers(response.items));
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
}
```

## 状态管理

使用 Zustand 进行全局状态管理。认证状态示例：

```typescript
import { useAuthStore } from '../stores/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('user', 'pass')}>Login</button>
      )}
    </div>
  );
}
```

## 样式系统

### TailwindCSS

在组件中直接使用 TailwindCSS 工具类：

```tsx
<div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
</div>
```

### Sass

创建 `.scss` 文件进行高级样式编写：

```scss
// styles/button.scss
.btn {
  $base-color: #3b82f6;
  
  padding: 0.5rem 1rem;
  background-color: $base-color;
  border-radius: 0.5rem;
  
  &:hover {
    background-color: darken($base-color, 10%);
  }
}
```

## 类型检查

项目完全支持 TypeScript。运行以下命令进行类型检查：

```bash
npx tsc --noEmit
```

## 常见问题

### Q: 如何添加新页面？
A: 在 `src/pages/` 目录下创建新组件，然后在 `src/App.tsx` 中添加路由。

### Q: 如何修改样式主题？
A: 编辑 `tailwind.config.js` 中的 `theme` 部分自定义颜色和其他设置。

### Q: 如何处理 API 错误？
A: API 错误会在响应拦截器中处理，401 错误会自动重定向到登录页。

## 性能优化建议

- 使用代码分割加载大型组件
- 启用图片懒加载
- 使用 React.memo 避免不必要的重渲染
- 定期检查打包大小

## 部署

### Vercel

```bash
npm run build
# 上传 dist 文件夹到 Vercel
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

## 许可证

MIT

## 支持

有问题或建议？请联系开发团队。

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
