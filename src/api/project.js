// src/api/project.js
// 项目资源的接口函数：调用后端 /api/projects RESTful 接口。
import request from './request'

// 查询全部项目
export const getProjects = () => request.get('/projects')

// 按编号查询单个项目
export const getProject = (id) => request.get(`/projects/${id}`)

// 新增项目
export const addProject = (data) => request.post('/projects', data)

// 修改指定编号项目
export const updateProject = (id, data) => request.put(`/projects/${id}`, data)

// 删除指定编号项目
export const deleteProject = (id) => request.delete(`/projects/${id}`)
