<script setup>
// src/views/AboutPage.vue
// 第二次实验：个人信息页使用 el-card / el-descriptions / el-timeline / el-tag 重构，
// 并新增"个人成长时间线"。
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../stores/profile'

const profileStore = useProfileStore()
const { personInfo, skillList } = storeToRefs(profileStore)

// 个人成长时间线（数据与项目、班级等真实信息对应）
const timeline = [
  { time: '2024-09', title: '进入大学', desc: '就读计算机科学与技术24级2班，开启大学学习生活。' },
  { time: '2025-11 ~ 2026-01', title: '大学生积分管理系统', desc: '担任后端开发，完成活动发布、积分录入与统计展示等功能。' },
  { time: '2026-04 ~ 2026-06', title: '互联网专家服务平台', desc: '担任前端开发，搭建专家列表、服务介绍与预约入口等界面。' },
  { time: '2026-10', title: 'Vue3 个人主页项目', desc: '学习 Vue Router、Pinia 状态管理与 Element Plus 组件库，完成个人主页。' }
]
</script>

<template>
  <section class="about-page">
    <!-- 个人信息：el-card + el-descriptions -->
    <el-card shadow="hover" class="about-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">关于我</span>
          <el-tag effect="light" round>个人简介</el-tag>
        </div>
      </template>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="姓名">{{ personInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ personInfo.studentId }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ personInfo.majorClass }}</el-descriptions-item>
        <el-descriptions-item label="学历">{{ personInfo.education }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ personInfo.email }}</el-descriptions-item>
        <el-descriptions-item label="简介">{{ personInfo.brief }}</el-descriptions-item>
      </el-descriptions>

      <div class="skill-block">
        <h3 class="about-sub">技能栈</h3>
        <div class="skill-tags">
          <el-tag v-for="s in skillList" :key="s.id" effect="light" round>{{ s.name }}</el-tag>
        </div>
      </div>
    </el-card>

    <!-- 个人成长时间线：el-timeline -->
    <el-card shadow="hover" class="about-card timeline-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">个人成长时间线</span>
          <el-tag type="success" effect="light" round>成长经历</el-tag>
        </div>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="(t, i) in timeline"
          :key="i"
          :timestamp="t.time"
          placement="top"
          :type="i === timeline.length - 1 ? 'primary' : ''"
        >
          <div class="tl-title">{{ t.title }}</div>
          <div class="tl-desc">{{ t.desc }}</div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </section>
</template>

<style scoped>
.about-page { margin-top: 16px; }
.about-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  margin-bottom: 16px;
  --el-card-border-color: var(--border);
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-deep);
}
.about-brief {
  margin: 0 0 14px;
  color: var(--text);
  line-height: 1.7;
}
.skill-block { margin-top: 18px; }

/* 个人信息表格：融入粉色整体风格 */
.about-card :deep(.el-descriptions__label) {
  background: var(--primary-soft);
  color: var(--primary-deep);
  font-weight: 600;
}
.about-card :deep(.el-descriptions__content) {
  background: var(--card);
  color: var(--text);
}
.about-card :deep(.el-descriptions__cell) {
  border: 1px solid var(--border);
}
.about-sub {
  margin: 0 0 10px;
  font-size: 15px;
  color: var(--primary-deep);
}
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.timeline-card { margin-top: 0; }
.tl-title { font-weight: 600; color: var(--text); margin-bottom: 4px; }
.tl-desc { font-size: 13px; color: var(--text-light); line-height: 1.6; }
</style>
