# 校园活动管理平台 - 学生端前端

## 技术栈

Vue 3 · Vite · TypeScript · TailwindCSS · Pinia · Axios · reka-ui（shadcn 风格）· vite-plugin-mock

## 快速开始

```bash
pnpm install
pnpm dev
```

访问 http://localhost:5173/

### Mock 登录（无后端时）

- 学号：`2024000001`
- 密码：`password123`

## 目录结构

```
src/
  api/              # 前后端接口
  assets/           # 静态资源（logo.png、main.css）
  components/
    common/         # 通用业务组件
    layout/         # 布局类组件（AppForm、AppPageContainer 等）
    ui/             # UI 组件库
  composables/      # 组合式函数
  layouts/          # 导航栏与页面框架（Sidebar、AppLayout）
  router/           # 路由
  stores/           # 数据存储（Pinia）
  utils/            # 工具函数、校验、常量
  views/            # 页面
  types/            # 类型定义
mock/               # 开发 Mock（路径无 /api 前缀）
```

## 最新接口文档对齐说明（`接口.docx`）

- 基础路径：无 `/api` 前缀，`VITE_API_BASE_URL` 留空
- 报名：`POST /activities/{id}/register` · 取消：`DELETE /activities/{id}/register`
- 我的报名：`GET /user/registrations`（`name`、`activity_id`、`category_id`、`start_date`、`campus`）
- 签到：`POST /activities/{id}/checkin`（body 仅 `checkin_code`）
- 我的签到：`GET /user/checkins`（`name`、`activity_id`、`category_id`、`start_date`、`campus`）
- 排行榜：`GET /leaderboard`（`period`、`college`、`grade`；响应 `total` + `list`，展示学号）
- 改密：`POST /user/reset-password`（`token`、`new_password`、`confirm_password`；个人中心先校验旧密码再调用）
- 活动详情：`is_registered`、`registration_status`、`check_status`
- 活动列表查询无 `activity_id` 参数，按 ID 筛选在前端完成
- 注册成功返回 `userId` + `token`，自动登录
