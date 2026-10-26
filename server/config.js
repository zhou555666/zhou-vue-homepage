// server/config.js
// 服务器与数据库连接配置。
// 【重要】把下面的 password 改成你自己 MySQL 的密码后，实验才能连库成功。

export const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  // 在这里填入你 MySQL root 账号的密码：
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'vue_homepage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

// 服务器监听端口
export const PORT = Number(process.env.PORT || 3000)
