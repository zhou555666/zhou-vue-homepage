<script setup>
// src/views/HomePage.vue
// 第二次实验：技能/爱好板块改用 el-card + el-tag 重构。
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../stores/profile'
import { useProjectStore } from '../stores/project'
import ProfileCard from '../components/ProfileCard.vue'
import HonorList from '../components/HonorList.vue'
import WorkProjectList from '../components/WorkProjectList.vue'

const profileStore = useProfileStore()
const projectStore = useProjectStore()
const { personInfo, honorList, skillList, hobbyList } = storeToRefs(profileStore)
const { list: workList } = storeToRefs(projectStore)
</script>

<template>
  <section class="home-page">
    <ProfileCard :person-info="personInfo" />
    <HonorList :honor-list="honorList" />
    <WorkProjectList :work-list="workList" :skill-list="skillList" />

    <!-- 技能板块 -->
    <el-card shadow="hover" class="section-card">
      <template #header>
        <span class="section-title">技能</span>
      </template>
      <div class="tag-wrap">
        <el-tag v-for="s in skillList" :key="s.id" effect="light" round>{{ s.name }}</el-tag>
      </div>
    </el-card>

    <!-- 爱好板块 -->
    <el-card shadow="hover" class="section-card">
      <template #header>
        <span class="section-title">兴趣爱好</span>
      </template>
      <div class="tag-wrap">
        <el-tag v-for="h in hobbyList" :key="h.id" type="warning" effect="light" round>{{ h.name }}</el-tag>
      </div>
    </el-card>
  </section>
</template>

<style scoped>
.home-page { margin-top: 16px; }
.section-card {
  margin-top: 16px;
  --el-card-border-color: var(--border);
  background: var(--card);
  border-radius: 14px;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-deep);
}
.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
