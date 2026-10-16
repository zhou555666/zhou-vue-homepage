// src/stores/project.js
// 项目 Store：集中管理项目经历数据，提供 getters（统计、按 id 查找）与增删改查 actions，
// 并在 actions 中同步 localStorage 实现持久化。
import { defineStore } from 'pinia'

const STORAGE_KEY = 'vueExpProjectData'

const defaultList = [
  {
    id: 1,
    title: '大学生积分管理系统',
    role: '后端开发',
    status: '已完成',
    startTime: '2025-11',
    endTime: '2026-01',
    desc: '面向大学生社团活动的积分记录与排行系统，实现活动发布、积分录入与统计展示。',
    isStar: true,
    techs: ['Vue3', 'JavaScript', 'HTML', 'CSS'],
    detail: '负责积分记录模块的接口对接与页面展示，实现了按活动、按成员的积分汇总。',
    stages: [{ name: '第一阶段', start: '2025-11', duration: '2个月' }]
  },
  {
    id: 2,
    title: '互联网专家服务平台',
    role: '前端开发',
    status: '开发中',
    startTime: '2026-04',
    endTime: '2026-06',
    desc: '面向专家的在线咨询服务门户，包含专家列表、服务介绍与预约入口。',
    isStar: false,
    techs: ['JavaScript', 'CSS'],
    detail: '负责专家展示页与预约流程的前端实现。',
    stages: []
  }
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data) && data.length) {
        return data.map(p => ({ status: '开发中', isStar: false, techs: [], detail: '', stages: [], ...p }))
      }
    }
  } catch (e) {
    console.warn('读取项目数据失败：', e)
  }
  return defaultList.map(p => ({ ...p }))
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    list: load()
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
    // 持久化
    persist() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list)) } catch (e) { console.warn('保存项目数据失败：', e) }
    },
    // 整体写回（后台"保存"时用草稿替换整个列表并持久化）
    replaceAll(list) {
      this.list = list
      this.persist()
    },
    // 新增项目（id 由 Store 自动生成，忽略传入的 id）
    addProject(project = {}) {
      const { id: _ignored, ...rest } = project
      const newId = this.list.length ? Math.max(...this.list.map(p => p.id)) + 1 : 1
      this.list.push({
        id: newId, title: '', role: '', status: '规划中', startTime: '',
        endTime: '', desc: '', isStar: false, techs: [], detail: '', stages: [],
        ...rest
      })
      this.persist()
    },
    // 删除项目
    delProject(id) {
      this.list = this.list.filter(p => p.id !== id)
      this.persist()
    },
    // 更新项目
    updateProject(updated) {
      this.list = this.list.map(p => p.id === updated.id ? updated : p)
      this.persist()
    },
    // 添加项目进程阶段
    addStage(project) {
      project.stages.push({ name: '第' + (project.stages.length + 1) + '阶段', start: '', duration: '' })
      this.persist()
    },
    // 设置 / 取消代表作
    setStar(id) {
      this.list = this.list.map(p => ({ ...p, isStar: id !== null && p.id === id }))
      this.persist()
    }
  }
})
