<script setup>
// src/views/manage/ManageTimelinePage.vue
// 个人成长时间线管理：独立页面，支持新增、删除时间线条目。
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useProfileStore } from '../../stores/profile'

const profileStore = useProfileStore()
const { timelineList } = storeToRefs(profileStore)
const { addTimeline: addTimelineAction, delTimeline } = profileStore

const newTimeline = ref({ time: '', title: '', desc: '' })

function addTimeline() {
  const title = newTimeline.value.title.trim()
  if (!title) return ElMessage.warning('请输入经历标题')
  const newId = timelineList.value.length ? Math.max(...timelineList.value.map(t => t.id)) + 1 : 1
  addTimelineAction({
    id: newId,
    time: newTimeline.value.time.trim(),
    title,
    desc: newTimeline.value.desc.trim()
  })
  newTimeline.value = { time: '', title: '', desc: '' }
  ElMessage.success('成长经历已添加')
}
</script>

<template>
  <section class="manage-page">
    <el-card shadow="hover" class="form-card">
      <template #header><span class="form-title">个人成长时间线管理</span></template>

      <div class="tl-form">
        <el-input v-model="newTimeline.title" placeholder="经历标题（必填），如：进入大学" />
        <el-input v-model="newTimeline.time" placeholder="时间，如：2024-09 或 2025-11 ~ 2026-01" />
        <el-input v-model="newTimeline.desc" type="textarea" :rows="2" placeholder="经历说明（选填）" />
        <el-button type="primary" class="add-btn" @click="addTimeline">+ 添加经历</el-button>
      </div>

      <div class="tl-list">
        <div class="tl-item" v-for="t in timelineList" :key="t.id">
          <div class="tl-main">
            <span class="tl-time">{{ t.time }}</span>
            <span class="tl-title">{{ t.title }}</span>
            <el-button type="danger" link @click="delTimeline(t.id)">删除</el-button>
          </div>
          <p class="tl-desc" v-if="t.desc">{{ t.desc }}</p>
        </div>
        <el-empty v-if="!timelineList.length" description="暂无成长经历，可在上方添加。" :image-size="60" />
      </div>
    </el-card>
  </section>
</template>

<style scoped>
.manage-page { margin-top: 16px; }
.form-card {
  margin-bottom: 16px;
  --el-card-border-color: var(--border);
  background: var(--card);
  border-radius: 14px;
}
.form-title { font-size: 16px; font-weight: 700; color: var(--primary-deep); }
.tl-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.add-btn { align-self: flex-start; }
.tl-list .tl-item {
  padding: 10px 12px;
  margin-bottom: 8px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
}
.tl-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
}
.tl-time { color: var(--text-light); font-size: 13px; }
.tl-title { font-weight: 600; color: var(--text); }
.tl-main .el-button { margin-left: auto; }
.tl-desc { font-size: 13px; color: var(--text-light); margin: 6px 0 0; }
</style>
