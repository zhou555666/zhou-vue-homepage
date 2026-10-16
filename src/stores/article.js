// src/stores/article.js
// 文章 Store：集中管理文章列表数据，提供增删改查 actions，并在 actions 中
// 同步 localStorage 实现持久化（配合文章列表页与后台文章管理页）。
import { defineStore } from 'pinia'

const STORAGE_KEY = 'vueExpArticleData'

const defaultList = [
  {
    id: 1,
    title: '我的第一个 Vue 项目',
    category: '学习笔记',
    date: '2026-10-01',
    summary: '记录从搭建 Vite 脚手架到完成个人主页与路由配置的过程。',
    content: '通过本次实验，我完成了个人主页的搭建，掌握了 Vue 单文件组件、路由配置与组件通信的基本用法。'
  },
  {
    id: 2,
    title: '理解 Vue Router 路由体系',
    category: '技术分享',
    date: '2026-10-08',
    summary: '梳理基础路由、嵌套路由与动态路由的区别与使用场景。',
    content: '本文整理了 Vue Router 中 path、name、component、children、meta 等配置项，以及 RouterView 作为路由出口的渲染机制。'
  }
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) return data
    }
  } catch (e) {
    console.warn('读取文章数据失败：', e)
  }
  return defaultList.map(a => ({ ...a }))
}

export const useArticleStore = defineStore('article', {
  state: () => ({
    list: load()
  }),
  getters: {
    // 文章总数
    total: (state) => state.list.length,
    // 按 id 查找文章
    findById: (state) => (id) => state.list.find(a => a.id === Number(id))
  },
  actions: {
    // 持久化
    persist() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list)) } catch (e) { console.warn('保存文章数据失败：', e) }
    },
    // 新增文章（id 由 Store 自动生成，忽略表单传入的 id）
    addArticle(article = {}) {
      const { id: _ignored, ...rest } = article
      const newId = this.list.length ? Math.max(...this.list.map(a => a.id)) + 1 : 1
      const today = new Date().toISOString().slice(0, 10)
      this.list.unshift({
        id: newId, title: '', category: '随笔', date: today, summary: '', content: '',
        ...rest
      })
      this.persist()
    },
    // 删除文章
    delArticle(id) {
      this.list = this.list.filter(a => a.id !== id)
      this.persist()
    },
    // 更新文章
    updateArticle(updated) {
      this.list = this.list.map(a => a.id === updated.id ? updated : a)
      this.persist()
    }
  }
})
