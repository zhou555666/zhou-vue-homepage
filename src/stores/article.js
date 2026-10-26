// src/stores/article.js
// 文章 Store（实验五改造）：数据由后端 /api/articles RESTful 接口提供，
// 不再依赖 localStorage。增删改通过 Axios 调用接口并刷新列表。
import { defineStore } from 'pinia'
import { getArticles, addArticle, updateArticle, deleteArticle } from '../api/article'

export const useArticleStore = defineStore('article', {
  state: () => ({
    list: [],       // 从接口加载的文章列表
    loaded: false,  // 是否已加载
    error: ''       // 加载失败提示
  }),
  getters: {
    // 文章总数
    total: (state) => state.list.length,
    // 按 id 查找文章
    findById: (state) => (id) => state.list.find(a => a.id === Number(id))
  },
  actions: {
    // 从接口加载文章列表
    async fetchAll() {
      try {
        this.list = await getArticles()
        this.loaded = true
        this.error = ''
      } catch (e) {
        console.warn('加载文章失败：', e.message)
        this.error = e.message
      }
    },
    async ensureLoaded() {
      if (!this.loaded) await this.fetchAll()
    },
    // 新增文章（id 由后端自增生成，忽略表单传入的 id）
    async addArticle(article = {}) {
      const { id: _ignored, ...rest } = article
      await addArticle(rest)
      await this.fetchAll()
    },
    // 删除文章
    async delArticle(id) {
      await deleteArticle(id)
      this.list = this.list.filter(a => a.id !== id)
    },
    // 更新文章
    async updateArticle(updated) {
      await updateArticle(updated.id, updated)
      await this.fetchAll()
    }
  }
})
