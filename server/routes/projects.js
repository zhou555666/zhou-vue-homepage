// server/routes/projects.js
// 项目资源 RESTful 接口：
//   GET    /api/projects       查询全部项目
//   GET    /api/projects/:id   按编号查询单个项目
//   POST   /api/projects       新增项目
//   PUT    /api/projects/:id   修改指定编号项目
//   DELETE /api/projects/:id   删除指定编号项目
// 统一返回 { code, message, data }；查询无结果返回 404，参数错误返回 400，异常返回 500。
import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// 数据库行（snake_case）→ 前端对象（camelCase）
function rowToProject(r) {
  return {
    id: r.id,
    title: r.title,
    role: r.role,
    status: r.status,
    startTime: r.start_time,
    endTime: r.end_time,
    desc: r.desc,
    isStar: !!r.is_star,
    techs: typeof r.techs === 'string' ? JSON.parse(r.techs || '[]') : (r.techs || []),
    detail: r.detail,
    stages: typeof r.stages === 'string' ? JSON.parse(r.stages || '[]') : (r.stages || [])
  }
}

/**
 * @api {get} /api/projects 查询全部项目
 * @apiName GetProjects
 * @apiGroup Project
 * @apiDescription 返回项目表中的全部项目列表，techs 与 stages 为 JSON 数组。
 * @apiSuccess {Number} code 状态码（0 表示成功）
 * @apiSuccess {String} message 提示信息
 * @apiSuccess {Object[]} data 项目数组
 * @apiSuccessExample {json} 成功响应:
 *   {
 *     "code": 0,
 *     "message": "ok",
 *     "data": [{ "id": 1, "title": "大学生积分管理系统", "role": "后端开发",
 *                "status": "已完成", "startTime": "2025-11", "endTime": "2026-01",
 *                "isStar": true, "techs": ["Vue3", "JavaScript"], "stages": [] }]
 *   }
 */

/**
 * @api {get} /api/projects/:id 按编号查询单个项目
 * @apiName GetProject
 * @apiGroup Project
 * @apiParam {Number} id 项目编号（路径参数）
 * @apiSuccess {Number} code 状态码（0 表示成功）
 * @apiSuccess {String} message 提示信息
 * @apiSuccess {Object} data 单个项目
 * @apiError (404) NotFound 项目不存在
 * @apiError (400) BadRequest 项目编号不合法
 */

/**
 * @api {post} /api/projects 新增项目
 * @apiName AddProject
 * @apiGroup Project
 * @apiBody {String} [title] 项目标题（必填）
 * @apiBody {String} [role] 项目角色
 * @apiBody {String} [status] 项目状态（默认"规划中"）
 * @apiBody {String} [startTime] 开始月份 YYYY-MM
 * @apiBody {String} [endTime] 结束月份 YYYY-MM
 * @apiBody {String} [desc] 项目描述
 * @apiBody {Boolean} [isStar] 是否代表作
 * @apiBody {String[]} [techs] 技术栈数组
 * @apiBody {String} [detail] 项目详情
 * @apiBody {Object[]} [stages] 项目进程阶段数组
 * @apiSuccess (201) {Number} code 状态码（0 表示成功）
 * @apiSuccess (201) {String} message 提示信息
 * @apiSuccess (201) {Object} data 新增后的项目
 * @apiError (400) BadRequest 项目标题为空
 */

/**
 * @api {put} /api/projects/:id 修改指定编号项目
 * @apiName UpdateProject
 * @apiGroup Project
 * @apiParam {Number} id 项目编号（路径参数）
 * @apiBody {String} [title] 项目标题（必填）
 * @apiBody {String} [role] 项目角色
 * @apiBody {String} [status] 项目状态
 * @apiBody {String} [startTime] 开始月份
 * @apiBody {String} [endTime] 结束月份
 * @apiBody {String} [desc] 项目描述
 * @apiBody {Boolean} [isStar] 是否代表作
 * @apiBody {String[]} [techs] 技术栈数组
 * @apiBody {String} [detail] 项目详情
 * @apiBody {Object[]} [stages] 项目进程阶段数组
 * @apiSuccess {Number} code 状态码（0 表示成功）
 * @apiSuccess {String} message 提示信息
 * @apiSuccess {Object} data 修改后的项目
 * @apiError (404) NotFound 项目不存在
 * @apiError (400) BadRequest 项目编号不合法或标题为空
 */

/**
 * @api {delete} /api/projects/:id 删除指定编号项目
 * @apiName DeleteProject
 * @apiGroup Project
 * @apiParam {Number} id 项目编号（路径参数）
 * @apiSuccess {Number} code 状态码（0 表示成功）
 * @apiSuccess {String} message 提示信息
 * @apiSuccess {Object} data { id }
 * @apiError (404) NotFound 项目不存在
 * @apiError (400) BadRequest 项目编号不合法
 */

// GET /api/projects
router.get('/', async (req, res, next) => {
  try {
    const rows = await query('SELECT * FROM projects ORDER BY id')
    res.json({ code: 0, message: 'ok', data: rows.map(rowToProject) })
  } catch (e) { next(e) }
})

// GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ code: 400, message: '项目编号不合法' })
    }
    const rows = await query('SELECT * FROM projects WHERE id = ?', [id])
    if (!rows.length) return res.status(404).json({ code: 404, message: '项目不存在' })
    res.json({ code: 0, message: 'ok', data: rowToProject(rows[0]) })
  } catch (e) { next(e) }
})

// POST /api/projects
router.post('/', async (req, res, next) => {
  try {
    const { title = '', role = '', status = '规划中', startTime = '', endTime = '',
            desc = '', isStar = false, techs = [], detail = '', stages = [] } = req.body || {}
    if (!String(title).trim()) {
      return res.status(400).json({ code: 400, message: '项目标题不能为空' })
    }
    const result = await query(
      `INSERT INTO projects (title, role, status, start_time, end_time, \`desc\`, is_star, techs, detail, stages)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, role, status, startTime, endTime, desc,
       isStar ? 1 : 0, JSON.stringify(techs), detail, JSON.stringify(stages)]
    )
    const newId = result.insertId
    const rows = await query('SELECT * FROM projects WHERE id = ?', [newId])
    res.status(201).json({ code: 0, message: '新增成功', data: rowToProject(rows[0]) })
  } catch (e) { next(e) }
})

// PUT /api/projects/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ code: 400, message: '项目编号不合法' })
    }
    const { title = '', role = '', status = '规划中', startTime = '', endTime = '',
            desc = '', isStar = false, techs = [], detail = '', stages = [] } = req.body || {}
    if (!String(title).trim()) {
      return res.status(400).json({ code: 400, message: '项目标题不能为空' })
    }
    const result = await query(
      `UPDATE projects SET title=?, role=?, status=?, start_time=?, end_time=?,
        \`desc\`=?, is_star=?, techs=?, detail=?, stages=? WHERE id=?`,
      [title, role, status, startTime, endTime, desc,
       isStar ? 1 : 0, JSON.stringify(techs), detail, JSON.stringify(stages), id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: '项目不存在或未修改' })
    }
    const rows = await query('SELECT * FROM projects WHERE id = ?', [id])
    res.json({ code: 0, message: '修改成功', data: rowToProject(rows[0]) })
  } catch (e) { next(e) }
})

// DELETE /api/projects/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ code: 400, message: '项目编号不合法' })
    }
    const result = await query('DELETE FROM projects WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: '项目不存在' })
    }
    res.json({ code: 0, message: '删除成功', data: { id } })
  } catch (e) { next(e) }
})

export default router
