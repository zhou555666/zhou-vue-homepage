<template>
  <section class="projects-page">
    <div class="projects-header">
      <h2 class="projects-title">项目展示</h2>
      <p class="projects-subtitle">数据来自「工作 / 项目经历」，在个人主页添加或删除后这里自动同步</p>
    </div>

    <div class="projects-grid" v-if="projects.length">
      <ProjectCard
        v-for="p in projects"
        :key="p.id"
        :project="p"
      >
        <!-- 具名插槽 header（作用域插槽）：代表作完全由用户自己选择，按钮放在项目名称下方（角色标签只在底部显示） -->
        <template #header="{ project }">
          <div class="card-head">
            <h3 class="card-title">{{ project.isStar ? '★ ' + project.title + '（代表作）' : project.title }}</h3>
            <div class="card-head-meta">
              <button v-if="project.isStar" class="star-btn" @click="$emit('set-star', null)">取消代表作</button>
              <button v-else class="star-btn" @click="$emit('set-star', project.id)">设为代表作</button>
            </div>
          </div>
        </template>

        <!-- 默认插槽（作用域插槽）：定制主体内容，使用子组件暴露的 project 数据 -->
        <template #default="{ project }">
          <p class="card-desc">{{ project.desc || '暂无描述' }}</p>
        </template>

        <!-- 具名插槽 actions（作用域插槽）：展示项目时间段 -->
        <template #actions="{ project }">
          <span class="card-time">{{ project.startTime || '未填' }} ~ {{ project.endTime || '至今' }}</span>
        </template>

        <!-- 具名插槽 footer（作用域插槽）：定制底部状态区，按真实进度显示 -->
        <template #footer="{ project }">
          <span class="card-tag">{{ project.role }}</span>
          <span class="card-status" :class="statusClass(project.status)">{{ project.status || '开发中' }}</span>
        </template>
      </ProjectCard>
    </div>

    <p class="empty-tip" v-else>暂无项目，请先在「个人主页」添加工作/项目经历～</p>
  </section>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'

// 与个人主页的工作/项目经历共用同一份数据（由父组件 App.vue 传入 workList）
defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})
// 用户选择代表作：通知父组件把该项目设为代表作
defineEmits(['set-star'])

// 状态 → CSS 类：已完成=绿、开发中=橙、规划中=灰
const statusClass = (s) => {
  if (s === '已完成') return 'done'
  if (s === '规划中') return 'plan'
  return 'doing'
}
</script>

<style scoped>
.projects-page {
  margin-top: 16px;
}
.projects-header {
  text-align: center;
  padding: 18px 0 6px;
}
.projects-title {
  margin: 0 0 6px;
  font-size: 20px;
  color: var(--primary-deep);
}
.projects-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--text-light);
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.empty-tip {
  margin-top: 20px;
  text-align: center;
  color: var(--text-light);
}
.card-title {
  margin: 0;
  font-size: 16px;
  color: var(--primary-deep);
}
.card-head {
  width: 100%;
  display: block;
}
.card-head-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.star-btn {
  border: 1px solid var(--primary);
  background: transparent;
  color: var(--primary);
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
}
.star-btn:hover {
  background: var(--primary);
  color: #fff;
}
.card-type {
  font-size: 12px;
  color: var(--primary);
  background: var(--primary-soft);
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.card-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-light);
}
.card-time {
  display: inline-block;
  font-size: 13px;
  color: var(--text-light);
  background: var(--primary-soft);
  padding: 5px 12px;
  border-radius: 999px;
}
.card-tag {
  font-size: 12px;
  color: var(--primary-deep);
  background: var(--primary-soft);
  padding: 3px 10px;
  border-radius: 999px;
}
.card-status {
  margin-left: auto;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
}
.card-status.done { color: #15803d; background: #dcfce7; }   /* 已完成：绿 */
.card-status.doing { color: #b45309; background: #fef3c7; }  /* 开发中：橙 */
.card-status.plan { color: #6b7280; background: #e5e7eb; }   /* 规划中：灰 */
</style>
