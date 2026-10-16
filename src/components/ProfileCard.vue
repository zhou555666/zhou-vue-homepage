<template>
  <el-card class="section-card section-profile">
    <div class="profile">
      <el-avatar :size="96" :src="personInfo.avatarUrl" class="avatar" />
      <div>
        <div class="profile-name">{{ personInfo.name }}</div>
        <div class="info-item">学号：{{ personInfo.studentId }}</div>
        <div class="info-item">学历：{{ personInfo.education }}</div>
        <div class="info-item">专业班级：{{ personInfo.majorClass }}</div>
        <div class="info-item brief">简介：{{ personInfo.brief }}</div>
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-header">
        <span class="sec-label">详细信息</span>
        <el-button size="small" plain round @click="isShowDetail = !isShowDetail">
          {{ isShowDetail ? '收起' : '展开' }}
        </el-button>
      </div>
      <div class="detail-box" v-show="isShowDetail">
        <div class="info-item">性别：{{ personInfo.gender }}</div>
        <div class="info-item">生日：{{ personInfo.birthday }}</div>
        <div class="info-item">邮箱：{{ personInfo.email }}</div>
      </div>
    </div>

    <div class="profile-section">
      <!-- 编辑入口：跳转到后台管理页（需登录） -->
      <el-button type="primary" round @click="$router.push({ name: 'manage-profile' })">编辑资料</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ personInfo: Object })

const isShowDetail = ref(false)
</script>

<style scoped>
.section-card {
  margin-top: 16px;
  padding: 18px 20px;
  background: linear-gradient(135deg, var(--primary-soft), #fff);
  --el-card-border-color: var(--primary-soft);
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.06);
}
.profile {
  display: flex;
  align-items: center;
  gap: 20px;
}
.avatar {
  flex-shrink: 0;
  border: 3px solid var(--card);
  box-shadow: 0 0 0 3px var(--primary);
  background: var(--primary-soft);
}
.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-deep);
  margin-bottom: 4px;
  letter-spacing: 1px;
}
.info-item {
  margin: 5px 0;
  font-size: 15px;
  line-height: 1.6;
}
.info-item.brief { color: var(--text-light); }
.profile-section {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed var(--border);
}
.profile-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.sec-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-light);
}
.detail-box {
  margin-top: 8px;
  padding: 14px 18px;
  background: var(--primary-soft);
  border-radius: 12px;
}
</style>
