# 校园活动管理平台 - 学生端前端

基于需求文档实现，UI 组件与布局参考 **CampusActivity** 项目（`../CampusActivity/frontend`）。

## 技术栈

Vue 3 · Vite · TypeScript · TailwindCSS · Pinia · Axios · reka-ui（shadcn 风格）· vite-plugin-mock

## 快速开始

```bash
cd campus-activity-web
pnpm install
pnpm approve-builds   # 若提示 Ignored build scripts
pnpm dev
```

访问 http://localhost:5173/

### Mock 登录（无后端时）

- 学号：`2024000001`
- 密码：`password123`

Mock 数据在 `mock/` 目录，开发时由 `vite-plugin-mock` 拦截 `/api` 请求。

## 页面路由

| 路径 | 说明 |
|------|------|
| `/login` | 登录（CampusActivity 风格渐变背景 + AppForm） |
| `/register` | 注册 |
| `/activities` | 活动查询 |
| `/activities/:id` | 活动详情 |
| `/profile` | 个人主页 |
| `/my/history` | 我的历史 |
| `/notifications` | 通知与公告 |
| `/achievement` | 统计排行 |

## 与 CampusActivity 的集成

从 CampusActivity 引入：

- `components/common`：AppButton、AppCard、AppInput
- `components/layout`：AppPageContainer、AppSidebar、AppNavbar、AppForm、AppDialog
- `components/ui`：button、card、input、label、dialog
- `layouts/Topbar.vue`、`layouts/Sidebar.vue`（已对接 vue-router）

业务 API、页面逻辑仍在本项目的 `src/api`、`src/views` 中，按接口文档实现。

## 目录结构

```
src/
  api/              # 接口
  components/       # CampusActivity 组件 + 业务 UI
  layouts/          # Topbar + Sidebar + AppLayout
  views/            # 业务页面
mock/               # 开发 Mock
```
