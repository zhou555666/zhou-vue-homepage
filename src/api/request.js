// src/api/request.js
// Axios 请求封装：
//   1. 创建统一实例，配置 baseURL 与超时；
//   2. 响应拦截器统一处理后端 { code, message, data } 结构——
//      成功（code===0）直接返回 data；业务失败（code!==0）抛出带提示的 Error。
import axios from 'axios'

// baseURL 默认 /api（开发时由 vite 代理到 http://localhost:3000/api）。
// 可通过环境变量 VITE_API_BASE 覆盖（例如部署到其它后端时）。
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10000
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const body = response.data
    // 后端统一返回 { code, message, data }
    if (body && typeof body.code === 'number' && body.code !== 0) {
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return body ? body.data : body
  },
  (error) => {
    // 网络错误 / HTTP 状态码错误（4xx/5xx）
    const msg =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      '网络请求失败'
    return Promise.reject(new Error(msg))
  }
)

export default request
