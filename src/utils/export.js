// src/utils/export.js
// 数据导出工具（实验五拓展要求）：
//   1. downloadFile  将任意内容作为本地文件下载；
//   2. exportJSON    导出为 JSON 文件（保留嵌套结构，适合项目数据）；
//   3. exportCSV     导出为 CSV 文件（扁平表格，Excel 可直接打开，带 BOM 以正确显示中文）。
// 用法示例：
//   import { exportJSON, exportCSV } from '@/utils/export'
//   exportJSON(projectList, 'projects.json')
//   exportCSV(articleList, 'articles.csv')

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 导出为 JSON 文件
export function exportJSON(data, filename = 'data.json') {
  downloadFile(JSON.stringify(data, null, 2), filename, 'application/json;charset=utf-8')
}

// 导出为 CSV 文件（表头取第一行的键；带 \ufeff BOM，保证 Excel 打开中文不乱码）
export function exportCSV(rows, filename = 'data.csv') {
  if (!Array.isArray(rows) || !rows.length) return
  const headers = Object.keys(rows[0])
  const escape = (v) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const lines = [headers.join(',')]
  rows.forEach((r) => lines.push(headers.map((h) => escape(r[h])).join(',')))
  downloadFile('\ufeff' + lines.join('\r\n'), filename, 'text/csv;charset=utf-8;')
}
