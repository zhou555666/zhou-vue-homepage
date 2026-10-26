// server/app.js
// 服务器入口文件：创建 Express 应用、启用 cors 跨域与 JSON 解析、
// 挂载 /api 路由、统一 404 与错误处理，并监听端口。
import express from 'express'
import cors from 'cors'
import { PORT } from './config.js'
import { testConnection } from './db.js'
import projectsRouter from './routes/projects.js'
import articlesRouter from './routes/articles.js'

const app = express()

// 跨域：允许前端（不同端口）访问本服务器
app.use(cors())
// 解析 JSON 请求体
app.use(express.json())

// 简单路由提示
app.get('/', (req, res) => {
  res.json({ code: 0, message: '个人主页后端服务运行中', data: { projects: '/api/projects', articles: '/api/articles' } })
})

// 挂载资源路由
app.use('/api/projects', projectsRouter)
app.use('/api/articles', articlesRouter)

// 404：未匹配到的接口
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' })
})

// 统一错误处理：捕获路由中的异常，返回 500 与提示
app.use((err, req, res, next) => {
  console.error('[server error]', err)
  res.status(500).json({ code: 500, message: '服务器异常：' + err.message })
})

// 启动前先检测数据库连接
app.listen(PORT, async () => {
  console.log(`服务器已启动：http://localhost:${PORT}`)
  try {
    await testConnection()
    console.log('MySQL 数据库连接成功 ✓')
  } catch (e) {
    console.error('MySQL 连接失败：' + e.message)
    console.error('请检查：1) MySQL 是否已启动；2) server/config.js 中的用户名密码是否正确；3) 是否已执行 server/sql/init.sql 建库建表。')
  }
})
