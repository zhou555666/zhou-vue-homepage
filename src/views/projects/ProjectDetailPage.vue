<script setup>
// src/views/projects/ProjectDetailPage.vue
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../../stores/project'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

// 使用项目 Store 的 findById getter 读取动态参数 id（内部做 Number() 转换）后查找项目
const project = computed(() => projectStore.findById(route.params.id))

// 状态由时间段自动推导
const statusOf = projectStore.statusOf

// 编程式导航
function goBack() { router.go(-1) }              // 返回上一页
function goList() { router.push({ name: 'project-list' }) }  // 返回项目列表

// 状态 → CSS 类
function statusClass(s) {
  if (s === '已完成') return 'done'
  if (s === '规划中') return 'plan'
  return 'doing'
}

// 项目不存在时，用 replace 离开无效详情地址（不写入历史记录）
watchEffect(() => {
  if (!project.value) {
    router.replace({ name: 'project-list' })
  }
})
</script>

<template>
  <section class="detail-page" v-if="project">
    <div class="detail-card">
      <button class="back-btn" @click="goBack">← 返回上一页</button>
      <h2 class="detail-title">{{ project.title }}</h2>
      <div class="detail-meta">
        <span class="meta-tag">{{ project.role }}</span>
        <span class="meta-tag" :class="statusClass(statusOf(project))">{{ statusOf(project) }}</span>
        <span class="meta-time">{{ project.startTime || '未填' }} ~ {{ project.endTime || '至今' }}</span>
      </div>
      <p class="detail-desc">{{ project.desc || '暂无描述' }}</p>
      <div class="detail-techs" v-if="project.techs && project.techs.length">
        <span class="tech-tag" v-for="t in project.techs" :key="t">{{ t }}</span>
      </div>
      <div class="detail-extra" v-if="project.detail">
        <h3>项目详情</h3>
        <p>{{ project.detail }}</p>
      </div>
      <div class="detail-stages" v-if="project.stages && project.stages.length">
        <h3>项目进程</h3>
        <div class="stage-item" v-for="(st, i) in project.stages" :key="i">
          <span>{{ st.name || '第' + (i + 1) + '阶段' }}</span>
          <span>{{ st.start || '未填开始时间' }}</span>
          <span>预计 {{ st.duration || '未填时长' }}</span>
        </div>
      </div>
      <button class="list-btn" @click="goList">返回项目列表</button>
    </div>
  </section>
</template>

<style scoped>
.detail-page {
  margin-top: 16px;
}
.detail-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.08);
}
.back-btn {
  border: none;
  background: transparent;
  color: var(--primary);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
}
.back-btn:hover { text-decoration: underline; }
.detail-title {
  margin: 0 0 10px;
  font-size: 20px;
  color: var(--primary-deep);
}
.detail-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.meta-tag {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary-deep);
}
.meta-tag.done { color: #15803d; background: #dcfce7; }
.meta-tag.doing { color: #b45309; background: #fef3c7; }
.meta-tag.plan { color: #6b7280; background: #e5e7eb; }
.meta-time {
  font-size: 12px;
  color: var(--text-light);
  align-self: center;
}
.detail-desc {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text);
}
.detail-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}
.tech-tag {
  font-size: 12px;
  color: var(--primary-deep);
  background: var(--primary-soft);
  padding: 3px 10px;
  border-radius: 999px;
}
.detail-extra, .detail-stages {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
}
.detail-extra h3, .detail-stages h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: var(--primary-deep);
}
.detail-extra p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text);
  white-space: pre-wrap;
}
.stage-item {
  display: flex;
  gap: 14px;
  font-size: 13px;
  padding: 4px 0;
  color: var(--text);
}
.list-btn {
  margin-top: 18px;
  border: 1.5px solid var(--primary);
  background: transparent;
  color: var(--primary);
  font-size: 13px;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
}
.list-btn:hover {
  background: var(--primary);
  color: #fff;
}
</style>
