# 实验五：网络请求与前后端交互 —— 运行说明

本实验把个人主页的项目、文章数据由 Pinia + localStorage 迁移到 MySQL 数据库，
由 Node.js + Express 服务器提供 RESTful 接口，前端用 Axios 调用接口完成数据加载与内容管理。

---

## 一、数据表设计说明

数据库名：`vue_homepage`（UTF-8，utf8mb4）

### projects 项目表

| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | INT | 主键，自增 | 项目编号 |
| title | VARCHAR(100) | NOT NULL | 项目标题 |
| role | VARCHAR(50) | 默认 '' | 项目角色 |
| status | VARCHAR(20) | 默认 '规划中' | 项目状态（亦可由起止时间推导） |
| start_time | VARCHAR(20) | 默认 '' | 开始月份 YYYY-MM |
| end_time | VARCHAR(20) | 默认 '' | 结束月份 YYYY-MM |
| `desc` | TEXT | | 项目描述 |
| is_star | TINYINT(1) | 默认 0 | 是否代表作（0/1） |
| techs | JSON | | 技术栈数组 |
| detail | TEXT | | 项目详情 |
| stages | JSON | | 项目进程阶段数组 |
| created_at | TIMESTAMP | 默认当前时间 | 创建时间 |

### articles 文章表

| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | INT | 主键，自增 | 文章编号 |
| title | VARCHAR(200) | NOT NULL | 文章标题 |
| category | VARCHAR(50) | 默认 '随笔' | 文章分类 |
| summary | VARCHAR(500) | 默认 '' | 摘要 |
| content | TEXT | | 正文 |
| date | VARCHAR(20) | 默认 '' | 发布日期 |
| created_at | TIMESTAMP | 默认当前时间 | 创建时间 |

两表的主键均为 `id`（自增）；本实验中项目、文章相互独立，暂无外键关联。

---

## 二、启动步骤

### 1. 建库建表

打开命令行，进入本目录下的 `sql` 文件夹执行（会用到你的 MySQL 密码）：

```bash
cd D:\作业\大三\上\vue\vue1\server\sql
mysql -uroot -p < init.sql
```

### 2. 填数据库密码

打开 `server/config.js`，把 `password` 改成你 MySQL root 账号的密码：

```js
password: process.env.DB_PASSWORD || '请改成你的MySQL密码',
```

### 3. 启动后端服务器

```bash
cd D:\作业\大三\上\vue\vue1\server
npm install        # 首次运行，安装 express / mysql2 / cors
npm start          # 启动，看到"MySQL 数据库连接成功 ✓"即成功
```

默认监听 `http://localhost:3000`。

### 4. 启动前端（另开一个终端）

```bash
cd D:\作业\大三\上\vue\vue1
npm run dev        # 启动 Vite 开发服务器
```

前端 `http://localhost:5173` 会把 `/api` 请求自动代理到 `http://localhost:3000`（见 `vite.config.js` 的 `server.proxy`）。

---

## 三、接口清单

统一响应格式：`{ "code": 0, "message": "ok", "data": ... }`；
业务失败返回非 0 的 code，查询无结果/不存在返回 404，参数错误返回 400，服务器异常返回 500。

### 项目接口 `/api/projects`

| 方法 | 路径 | 说明 | 请求参数 | 返回 data |
|---|---|---|---|---|
| GET | /api/projects | 查询全部项目 | 无 | 项目数组 |
| GET | /api/projects/:id | 按编号查询项目 | 路径 id | 单个项目 |
| POST | /api/projects | 新增项目 | body: {title, role, status, startTime, endTime, desc, isStar, techs, detail, stages} | 新增后的项目 |
| PUT | /api/projects/:id | 修改项目 | 路径 id + 同 POST 的 body | 修改后的项目 |
| DELETE | /api/projects/:id | 删除项目 | 路径 id | {id} |

### 文章接口 `/api/articles`

| 方法 | 路径 | 说明 | 请求参数 | 返回 data |
|---|---|---|---|---|
| GET | /api/articles | 查询全部文章 | 无 | 文章数组 |
| GET | /api/articles/:id | 按编号查询文章 | 路径 id | 单篇文章 |
| POST | /api/articles | 新增文章 | body: {title, category, summary, content, date} | 新增后的文章 |
| PUT | /api/articles/:id | 修改文章 | 路径 id + 同 POST 的 body | 修改后的文章 |
| DELETE | /api/articles/:id | 删除文章 | 路径 id | {id} |

---

## 四、前端改造点

- `src/api/request.js`：Axios 实例封装（baseURL、超时、响应拦截器统一处理 `{code,message,data}`）。
- `src/api/project.js` / `src/api/article.js`：项目、文章接口函数。
- `src/stores/project.js` / `src/stores/article.js`：Store 改用接口加载与增删改，`App.vue` 挂载时统一 `ensureLoaded()` 加载。
- 管理页：`ManageProjectsPage.vue` 保存时通过 `syncAll()` 对比草稿与数据库，按差异调用新增/修改/删除接口；`ArticleManagePage.vue` 的新增/编辑/删除直接调用对应接口。
- `vite.config.js`：本地开发时把 `/api` 代理到后端 `http://localhost:3000`。

> 提示：GitHub Pages 是纯静态托管，线上无法运行 Node 后端。线上演示仍走静态数据或需另配后端；实验五的数据交互验证在本地开发环境完成。

---

## 五、拓展功能

### 1. apidoc 接口文档（选做）

在路由文件（`routes/projects.js`、`routes/articles.js`）的每个接口上方编写了 `@api` 注释，
接口与文档同源，修改接口后重新生成即可保持文档同步。

```bash
cd D:\作业\大三\上\vue\vue1\server
npm install            # 已包含 apidoc 依赖
npm run doc            # 生成接口文档到 server/docs/
```

生成后用浏览器打开 `server/docs/index.html` 即可查看全部接口的地址、方法、参数与返回值说明。

### 2. 数据导出（选做）

- 项目管理页（`ManageProjectsPage.vue`）：工具栏「导出项目数据」按钮，将数据库中的项目列表导出为
  `projects.json`（保留 techs / stages 嵌套结构）。
- 文章管理页（`ArticleManagePage.vue`）：工具栏「导出文章数据」按钮，将文章列表导出为
  `articles.csv`（带 UTF-8 BOM，Excel 可直接打开，中文不乱码）。
- 通用工具封装在 `src/utils/export.js`（`exportJSON` / `exportCSV` / `downloadFile`）。

