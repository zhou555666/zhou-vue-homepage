// src/stores/project.js
// 项目 Store（实验五改造）：数据由后端 /api/projects RESTful 接口提供，
// 不再依赖 localStorage。state 保存项目列表，getters 做统计与状态推导，
// actions 通过 Axios 调用接口完成加载与增删改。
import { defineStore } from 'pinia'
import { getProjects, addProject, updateProject, deleteProject } from '../api/project'

// 从草稿对象中剔除前端标记字段，生成提交给后端的 payload
function toPayload(item) {
  const { __new, __key, id, ...rest } = item
  return rest
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    list: [],        // 从接口加载的项目列表
    loaded: false,   // 是否已从接口加载过
    error: ''        // 加载失败时的提示
  }),
  getters: {
    // 项目总数
    total: (state) => state.list.length,
    // 按时间段自动推导项目状态：
    //   开始时间晚于当前月 → 规划中；结束时间早于当前月 → 已完成；否则 → 开发中
    statusOf: (state) => (p) => {
      const now = new Date().toISOString().slice(0, 7) // 'YYYY-MM'
      if (p.startTime && p.startTime > now) return '规划中'
      if (p.endTime && p.endTime < now) return '已完成'
      return '开发中'
    },
    // 已完成数量（按结束时间是否已过推导）
    doneCount: (state) => state.list.filter(p => p.endTime && p.endTime < new Date().toISOString().slice(0, 7)).length,
    // 开发中数量（已开始且未结束）
    doingCount: (state) => state.list.filter(p => {
      const now = new Date().toISOString().slice(0, 7)
      return !(p.endTime && p.endTime < now) && !(p.startTime && p.startTime > now)
    }).length,
    // 代表作数量
    starCount: (state) => state.list.filter(p => p.isStar).length,
    // 按 id 查找项目（动态路由参数为字符串，需转换）
    findById: (state) => (id) => state.list.find(p => p.id === Number(id))
  },
  actions: {
    // 从接口加载项目列表
    async fetchAll() {
      try {
        this.list = await getProjects()
        this.loaded = true
        this.error = ''
      } catch (e) {
        console.warn('加载项目失败：', e.message)
        this.error = e.message
      }
    },
    // 若尚未加载则加载一次（供各页面挂载时调用）
    async ensureLoaded() {
      if (!this.loaded) await this.fetchAll()
    },
    // 新增项目（id 由后端自增生成）
    async addProject(project = {}) {
      await addProject(toPayload(project))
      await this.fetchAll()
    },
    // 删除项目
    async delProject(id) {
      await deleteProject(id)
      this.list = this.list.filter(p => p.id !== id)
    },
    // 更新项目
    async updateProject(updated) {
      await updateProject(updated.id, toPayload(updated))
      await this.fetchAll()
    },
    // 设置 / 取消代表作
    async setStar(id) {
      for (const p of this.list) {
        const shouldStar = id !== null && p.id === id
        if (p.isStar !== shouldStar) {
          await updateProject(p.id, toPayload({ ...p, isStar: shouldStar }))
        }
      }
      await this.fetchAll()
    },
    // 后台"保存"：对比草稿与当前列表，按差异调用新增/修改/删除接口，最后刷新
    async syncAll(draft) {
      for (const item of draft) {
        const isNew = item.__new === true || !item.id
        if (isNew) {
          await addProject(toPayload(item))
        } else {
          await updateProject(item.id, toPayload(item))
        }
      }
      // 数据库中有、但草稿中已删掉的项目 → 调用删除接口
      for (const p of this.list) {
        if (!draft.some(d => d.id === p.id)) {
          await deleteProject(p.id)
        }
      }
      await this.fetchAll()
    }
  }
})
