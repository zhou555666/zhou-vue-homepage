// server/routes/articles.js
// 文章资源 RESTful 接口：
//   GET    /api/articles       查询全部文章
//   GET    /api/articles/:id   按编号查询单篇文章
//   POST   /api/articles       新增文章
//   PUT    /api/articles/:id   修改指定编号文章
//   DELETE /api/articles/:id   删除指定编号文章
import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

function rowToArticle(r) {
  return { id: r.id, title: r.title, category: r.category, summary: r.summary, content: r.content, date: r.date }
}

/**
 * @api {get} /api/articles 查询全部文章
 * @apiName GetArticles
 * @apiGroup Article
 * @apiDescription 返回文章表中的全部文章列表。
 * @apiSuccess {Number} code 状态码（0 表示成功）
 * @apiSuccess {String} message 提示信息
 * @apiSuccess {Object[]} data 文章数组
 * @apiSuccessExample {json} 成功响应:
 *   {
 *     "code": 0,
 *     "message": "ok",
 *     "data": [{ "id": 1, "title": "我的第一个 Vue 项目", "category": "学习笔记",
 *                "summary": "记录……", "content": "正文", "date": "2026-10-01" }]
 *   }
 */

/**
 * @api {get} /api/articles/:id 按编号查询单篇文章
 * @apiName GetArticle
 * @apiGroup Article
 * @apiParam {Number} id 文章编号（路径参数）
 * @apiSuccess {Number} code 状态码（0 表示成功）
 * @apiSuccess {String} message 提示信息
 * @apiSuccess {Object} data 单篇文章
 * @apiError (404) NotFound 文章不存在
 * @apiError (400) BadRequest 文章编号不合法
 */

/**
 * @api {post} /api/articles 新增文章
 * @apiName AddArticle
 * @apiGroup Article
 * @apiBody {String} [title] 文章标题（必填）
 * @apiBody {String} [category] 文章分类（默认"随笔"）
 * @apiBody {String} [summary] 摘要
 * @apiBody {String} [content] 正文
 * @apiBody {String} [date] 发布日期 YYYY-MM-DD
 * @apiSuccess (201) {Number} code 状态码（0 表示成功）
 * @apiSuccess (201) {String} message 提示信息
 * @apiSuccess (201) {Object} data 新增后的文章
 * @apiError (400) BadRequest 文章标题为空
 */

/**
 * @api {put} /api/articles/:id 修改指定编号文章
 * @apiName UpdateArticle
 * @apiGroup Article
 * @apiParam {Number} id 文章编号（路径参数）
 * @apiBody {String} [title] 文章标题（必填）
 * @apiBody {String} [category] 文章分类
 * @apiBody {String} [summary] 摘要
 * @apiBody {String} [content] 正文
 * @apiBody {String} [date] 发布日期
 * @apiSuccess {Number} code 状态码（0 表示成功）
 * @apiSuccess {String} message 提示信息
 * @apiSuccess {Object} data 修改后的文章
 * @apiError (404) NotFound 文章不存在
 * @apiError (400) BadRequest 文章编号不合法或标题为空
 */

/**
 * @api {delete} /api/articles/:id 删除指定编号文章
 * @apiName DeleteArticle
 * @apiGroup Article
 * @apiParam {Number} id 文章编号（路径参数）
 * @apiSuccess {Number} code 状态码（0 表示成功）
 * @apiSuccess {String} message 提示信息
 * @apiSuccess {Object} data { id }
 * @apiError (404) NotFound 文章不存在
 * @apiError (400) BadRequest 文章编号不合法
 */

// GET /api/articles
router.get('/', async (req, res, next) => {
  try {
    const rows = await query('SELECT * FROM articles ORDER BY id')
    res.json({ code: 0, message: 'ok', data: rows.map(rowToArticle) })
  } catch (e) { next(e) }
})

// GET /api/articles/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ code: 400, message: '文章编号不合法' })
    }
    const rows = await query('SELECT * FROM articles WHERE id = ?', [id])
    if (!rows.length) return res.status(404).json({ code: 404, message: '文章不存在' })
    res.json({ code: 0, message: 'ok', data: rowToArticle(rows[0]) })
  } catch (e) { next(e) }
})

// POST /api/articles
router.post('/', async (req, res, next) => {
  try {
    const { title = '', category = '随笔', summary = '', content = '', date = '' } = req.body || {}
    if (!String(title).trim()) {
      return res.status(400).json({ code: 400, message: '文章标题不能为空' })
    }
    const result = await query(
      'INSERT INTO articles (title, category, summary, content, date) VALUES (?, ?, ?, ?, ?)',
      [title, category, summary, content, date]
    )
    const rows = await query('SELECT * FROM articles WHERE id = ?', [result.insertId])
    res.status(201).json({ code: 0, message: '新增成功', data: rowToArticle(rows[0]) })
  } catch (e) { next(e) }
})

// PUT /api/articles/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ code: 400, message: '文章编号不合法' })
    }
    const { title = '', category = '随笔', summary = '', content = '', date = '' } = req.body || {}
    if (!String(title).trim()) {
      return res.status(400).json({ code: 400, message: '文章标题不能为空' })
    }
    const result = await query(
      'UPDATE articles SET title=?, category=?, summary=?, content=?, date=? WHERE id=?',
      [title, category, summary, content, date, id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: '文章不存在或未修改' })
    }
    const rows = await query('SELECT * FROM articles WHERE id = ?', [id])
    res.json({ code: 0, message: '修改成功', data: rowToArticle(rows[0]) })
  } catch (e) { next(e) }
})

// DELETE /api/articles/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ code: 400, message: '文章编号不合法' })
    }
    const result = await query('DELETE FROM articles WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: '文章不存在' })
    }
    res.json({ code: 0, message: '删除成功', data: { id } })
  } catch (e) { next(e) }
})

export default router
