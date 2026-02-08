# AuraKey API 文档

## 概述
AuraKey 后端提供了完整的 RESTful API，用于管理用户认证、画廊数据和艺术家信息。

## 快速开始

### 1. 环境配置
```bash
cd www
npm install
```

创建 `.env` 文件（参考 `.env.example`）：
```env
DATABASE_URL="postgresql://user:password@localhost:5432/aurakey?schema=public"
JWT_SECRET="your-secure-secret-key"
PORT=3000
```

### 2. 数据库设置
```bash
# 生成 Prisma 客户端
npm run prisma:generate

# 执行迁移
npm run prisma:migrate

# 导入示例数据
npm run prisma:seed
```

### 3. 启动服务
```bash
# 开发模式（带热重载）
npm run dev

# 构建生产版本
npm run build
npm start
```

服务器将运行在 `http://localhost:3000`

---

## API 端点

### 认证接口 `/api/auth`

#### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

**响应**:
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username"
  }
}
```

#### 登出
```http
POST /api/auth/logout
```

**响应**:
```json
{
  "message": "Logout successful (discard your token)"
}
```

---

### 画廊接口 `/api/gallery`

#### 获取所有画廊项目
```http
GET /api/gallery
GET /api/gallery?category=Hot
```

**查询参数**:
- `category` (可选) - 按类别筛选（如 'Hot', 'Newest' 等）

**响应**:
```json
{
  "message": "Gallery items retrieved successfully",
  "data": [
    {
      "id": "clxx...",
      "url": "https://...",
      "title": "抽象流动色彩",
      "author": "设计师-Ziv",
      "avatar": "https://...",
      "likes": 1284,
      "width": 400,
      "height": 600,
      "category": "Newest",
      "prompt": "抽象流动色彩, 极简主义...",
      "model": "Seeddream4.0",
      "ratio": "2:3",
      "resolution": "1024x1536",
      "refImages": [],
      "createdAt": "2024-03-20T10:30:00Z"
    }
  ]
}
```

#### 获取单个画廊项目
```http
GET /api/gallery/:id
```

**响应**:
```json
{
  "message": "Gallery item retrieved successfully",
  "data": { /* gallery item object */ }
}
```

#### 创建新画廊项目
```http
POST /api/gallery
Content-Type: application/json

{
  "url": "https://...",
  "title": "作品标题",
  "author": "作者名称",
  "avatar": "https://...",
  "width": 400,
  "height": 600,
  "category": "Newest",
  "prompt": "提示词内容",
  "model": "Seeddream4.0",
  "ratio": "2:3",
  "resolution": "1024x1536",
  "refImages": ["https://...", "https://..."]
}
```

**响应**:
```json
{
  "message": "Gallery item created successfully",
  "data": { /* created gallery item */ }
}
```

#### 更新画廊项目
```http
PUT /api/gallery/:id
Content-Type: application/json

{
  "title": "新标题",
  "likes": 1500
}
```

#### 删除画廊项目
```http
DELETE /api/gallery/:id
```

**响应**:
```json
{
  "message": "Gallery item deleted successfully"
}
```

#### 点赞画廊项目
```http
POST /api/gallery/:id/like
```

**响应**:
```json
{
  "message": "Gallery item liked successfully",
  "data": { /* updated gallery item with likes incremented */ }
}
```

---

### 艺术家接口 `/api/artists`

#### 获取所有艺术家
```http
GET /api/artists
```

**响应**:
```json
{
  "message": "Artists retrieved successfully",
  "data": [
    {
      "id": "clxx...",
      "name": "Ilya Kuvshinov",
      "previewUrl": "https://...",
      "tags": ["插画", "日系", "女性"],
      "createdAt": "2024-03-20T10:30:00Z"
    }
  ]
}
```

#### 按名称搜索艺术家
```http
GET /api/artists/search/by-name?name=Ilya%20Kuvshinov
```

#### 获取单个艺术家
```http
GET /api/artists/:id
```

#### 创建新艺术家
```http
POST /api/artists
Content-Type: application/json

{
  "name": "Artist Name",
  "previewUrl": "https://...",
  "tags": ["风格1", "风格2"]
}
```

#### 更新艺术家信息
```http
PUT /api/artists/:id
Content-Type: application/json

{
  "name": "New Name",
  "tags": ["新标签1", "新标签2"]
}
```

#### 删除艺术家
```http
DELETE /api/artists/:id
```

---

## 数据模型

### GalleryItem
```typescript
{
  id: string              // 唯一标识符
  url: string            // 图片URL
  title: string          // 作品标题
  author: string         // 作者名称
  avatar: string         // 作者头像URL
  likes: number          // 点赞数
  width: number          // 图片宽度
  height: number         // 图片高度
  category: string       // 分类（Hot, Newest, Illustration等）
  prompt: string         // AI生成提示词
  model: string          // 使用的模型（如Seeddream4.0）
  ratio: string          // 宽高比（如"2:3"）
  resolution: string     // 分辨率（如"1024x1536"）
  refImages: string[]    // 参考图片URL数组
  createdAt: DateTime    // 创建时间
  updatedAt: DateTime    // 更新时间
  deletedAt?: DateTime   // 软删除时间
}
```

### Artist
```typescript
{
  id: string            // 唯一标识符
  name: string          // 艺术家名称
  previewUrl: string    // 预览图片URL
  tags: string[]        // 风格标签数组
  createdAt: DateTime   // 创建时间
  updatedAt: DateTime   // 更新时间
  deletedAt?: DateTime  // 软删除时间
}
```

---

## 常见错误响应

### 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "message": "Gallery item not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": {}
}
```

---

## 开发提示

1. **软删除**: 所有模型都支持软删除，删除的记录不会从数据库中移除，只是标记 `deletedAt` 时间
2. **数据库迁移**: 修改 schema.prisma 后，运行 `npm run prisma:migrate` 创建新的迁移
3. **种子数据**: 使用 `npm run prisma:seed` 命令导入示例数据
4. **热重载**: 开发模式下（`npm run dev`）修改代码会自动重启服务器

---

## 前端集成

### 获取画廊数据示例

```typescript
// 获取所有画廊项目
const response = await fetch('http://localhost:3000/api/gallery');
const data = await response.json();

// 按类别过滤
const hotItems = await fetch('http://localhost:3000/api/gallery?category=Hot');

// 点赞
await fetch('http://localhost:3000/api/gallery/item-id/like', {
  method: 'POST'
});
```

### 获取艺术家数据示例

```typescript
// 获取所有艺术家
const artists = await fetch('http://localhost:3000/api/artists');
const data = await artists.json();

// 搜索特定艺术家
const artist = await fetch('http://localhost:3000/api/artists/search/by-name?name=WLOP');
```
