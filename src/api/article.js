// src/api/article.js
// 文章资源的接口函数：调用后端 /api/articles RESTful 接口。
import request from './request'

// 查询全部文章
export const getArticles = () => request.get('/articles')

// 按编号查询单篇文章
export const getArticle = (id) => request.get(`/articles/${id}`)

// 新增文章
export const addArticle = (data) => request.post('/articles', data)

// 修改指定编号文章
export const updateArticle = (id, data) => request.put(`/articles/${id}`, data)

// 删除指定编号文章
export const deleteArticle = (id) => request.delete(`/articles/${id}`)
