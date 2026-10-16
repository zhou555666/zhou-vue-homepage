<script setup>
// src/views/projects/ProjectStatsPage.vue
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../../stores/project'

const projectStore = useProjectStore()
// 使用项目 Store 的 getters（派生计算值，带缓存），通过 storeToRefs 解构保持响应式
const { total, doneCount: done, doingCount: doing, starCount: star } = storeToRefs(projectStore)
</script>

<template>
  <section class="stats-page">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-num">{{ total }}</div>
        <div class="stat-label">项目总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{{ done }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{{ doing }}</div>
        <div class="stat-label">开发中</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{{ star }}</div>
        <div class="stat-label">代表作</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-page {
  margin-top: 16px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 12px;
  text-align: center;
}
.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-deep);
}
.stat-label {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-light);
}
@media (max-width: 600px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
