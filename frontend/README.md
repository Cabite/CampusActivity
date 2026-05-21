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
```
