// server/db.js
// 使用 mysql2/promise 创建连接池，封装统一的查询方法。
// 使用 ? 占位符 + 参数数组传值，由驱动完成转义，避免 SQL 注入。
import mysql from 'mysql2/promise'
import { DB_CONFIG } from './config.js'

export const pool = mysql.createPool(DB_CONFIG)

/**
 * 统一查询方法：执行一条参数化 SQL，返回查询到的行数组。
 * @param {string} sql    SQL 语句（使用 ? 占位符）
 * @param {Array}  params 占位符对应参数
 * @returns {Promise<Array>} 查询结果行数组
 */
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

/**
 * 检查数据库连接是否成功（启动服务器时调用）。
 */
export async function testConnection() {
  const conn = await pool.getConnection()
  try {
    await conn.ping()
  } finally {
    conn.release()
  }
}
