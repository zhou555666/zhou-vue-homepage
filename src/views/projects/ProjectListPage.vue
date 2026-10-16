<script setup>
// src/views/projects/ProjectListPage.vue
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../../stores/project'
import ProjectCard from '../../components/ProjectCard.vue'

const projectStore = useProjectStore()
// storeToRefs：解构 state 保持响应式；actions/getters 直接从 Store 实例使用
const { list: workList } = storeToRefs(projectStore)
const { setStar, statusOf } = projectStore

function statusClass(s) {
  if (s === '已完成') return 'done'
  if (s === '规划中') return 'plan'
  return 'doing'
}
</script>

<template>
  <section class="project-list-page">
    <div class="projects-grid" v-if="workList.length">
      <ProjectCard v-for="p in workList" :key="p.id" :project="p">
        <template #header="{ project }">
          <div class="card-head">
            <h3 class="card-title">{{ project.isStar ? '★ ' + project.title + '（代表作）' : project.title }}</h3>
            <div class="card-head-meta">
              <button v-if="project.isStar" class="star-btn" @click="setStar(null)">取消代表作</button>
              <button v-else class="star-btn" @click="setStar(project.id)">设为代表作</button>
            </div>
          </div>
        </template>

        <template #default="{ project }">
          <p class="card-desc">{{ project.desc || '暂无描述' }}</p>
        </template>

        <template #actions="{ project }">
          <span class="card-time">{{ project.startTime || '未填' }} ~ {{ project.endTime || '至今' }}</span>
        </template>

        <template #footer="{ project }">
          <span class="card-tag">{{ project.role }}</span>
          <span class="card-status" :class="statusClass(statusOf(project))">{{ statusOf(project) }}</span>
          <!-- 跳转到项目详情页（动态路由参数 id） -->
          <RouterLink
            class="detail-link"
            :to="{ name: 'project-detail', params: { id: project.id } }"
          >查看详情 →</RouterLink>
        </template>
      </ProjectCard>
    </div>
    <p class="empty-tip" v-else>暂无项目</p>
  </section>
</template>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.card-head { width: 100%; display: block; }
.card-head-meta { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
.star-btn {
  border: 1px solid var(--primary);
  background: transparent;
  color: var(--primary);
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  cursor: pointer;
}
.star-btn:hover { background: var(--primary); color: #fff; }
.card-desc { margin: 0; font-size: 14px; line-height: 1.6; color: var(--text-light); }
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
.card-status.done { color: #15803d; background: #dcfce7; }
.card-status.doing { color: #b45309; background: #fef3c7; }
.card-status.plan { color: #6b7280; background: #e5e7eb; }
.detail-link {
  font-size: 12px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}
.detail-link:hover { text-decoration: underline; }
.empty-tip {
  margin-top: 20px;
  text-align: center;
  color: var(--text-light);
}
</style>
