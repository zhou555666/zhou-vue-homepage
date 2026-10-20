<script setup>
// src/views/manage/ManageSkillsPage.vue
// 第二次实验：技能/爱好/荣誉管理使用 el-card / el-input / el-button / el-tag /
// el-select / el-option / el-date-picker / el-message 重构。
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useProfileStore } from '../../stores/profile'

const profileStore = useProfileStore()
const { skillList, hobbyList, honorList, timelineList } = storeToRefs(profileStore)
const { addSkill: addSkillAction, delSkill, addHobby: addHobbyAction, delHobby, addHonor: addHonorAction, delHonor, addTimeline: addTimelineAction, delTimeline } = profileStore

const newSkill = ref('')
const newHobby = ref('')
const newHonor = ref({ title: '', level: '', time: '', desc: '' })
// 荣誉级别：下拉选择，选"其他"时使用自定义输入
const honorLevelChoice = ref('')
const honorLevelCustom = ref('')
// 成长时间线
const newTimeline = ref({ time: '', title: '', desc: '' })

function addSkill() {
  const name = newSkill.value.trim()
  if (!name) return ElMessage.warning('请输入技能名称')
  if (skillList.value.some(s => s.name === name)) return ElMessage.warning('该技能已存在')
  addSkillAction(name)
  newSkill.value = ''
}

function addHobby() {
  const name = newHobby.value.trim()
  if (!name) return ElMessage.warning('请输入爱好名称')
  if (hobbyList.value.some(h => h.name === name)) return ElMessage.warning('该爱好已存在')
  addHobbyAction(name)
  newHobby.value = ''
}

function addHonor() {
  const title = newHonor.value.title.trim()
  if (!title) return ElMessage.warning('请输入荣誉名称')
  // 级别：选"其他"时用自定义输入，否则用下拉选中值
  let level = honorLevelChoice.value
  if (honorLevelChoice.value === '__other__') {
    level = honorLevelCustom.value.trim()
    if (!level) return ElMessage.warning('请填写自定义级别')
  }
  const newId = honorList.value.length ? Math.max(...honorList.value.map(h => h.id)) + 1 : 1
  addHonorAction({
    id: newId,
    title,
    level,
    time: newHonor.value.time,
    desc: newHonor.value.desc.trim()
  })
  newHonor.value = { title: '', level: '', time: '', desc: '' }
  honorLevelChoice.value = ''
  honorLevelCustom.value = ''
  ElMessage.success('荣誉已添加')
}

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
    <!-- 技能管理 -->
    <el-card shadow="hover" class="form-card">
      <template #header><span class="form-title">技能管理</span></template>
      <div class="add-row">
        <el-input v-model="newSkill" placeholder="新技能名称" clearable @keyup.enter="addSkill" />
        <el-button type="primary" @click="addSkill">+ 添加技能</el-button>
      </div>
      <div class="tag-list">
        <el-tag
          v-for="s in skillList"
          :key="s.id"
          effect="light"
          round
          closable
          @close="delSkill(s.id)"
        >{{ s.name }}</el-tag>
      </div>
    </el-card>

    <!-- 爱好管理 -->
    <el-card shadow="hover" class="form-card">
      <template #header><span class="form-title">兴趣爱好管理</span></template>
      <div class="add-row">
        <el-input v-model="newHobby" placeholder="新爱好名称" clearable @keyup.enter="addHobby" />
        <el-button type="primary" @click="addHobby">+ 添加爱好</el-button>
      </div>
      <div class="tag-list">
        <el-tag
          v-for="h in hobbyList"
          :key="h.id"
          type="warning"
          effect="light"
          round
          closable
          @close="delHobby(h.id)"
        >{{ h.name }}</el-tag>
      </div>
    </el-card>

    <!-- 荣誉管理 -->
    <el-card shadow="hover" class="form-card">
      <template #header><span class="form-title">荣誉 / 获奖经历管理</span></template>

      <div class="honor-form">
        <el-input v-model="newHonor.title" placeholder="荣誉名称（必填）" />
        <div class="honor-row">
          <el-select
            v-model="honorLevelChoice"
            placeholder="级别（选择）"
            class="level-select"
            style="width: 100%"
          >
            <el-option label="院级" value="院级" />
            <el-option label="校级" value="校级" />
            <el-option label="市级" value="市级" />
            <el-option label="省级" value="省级" />
            <el-option label="国家级" value="国家级" />
            <el-option label="其他（自定义）" value="__other__" />
          </el-select>
          <el-input
            v-if="honorLevelChoice === '__other__'"
            v-model="honorLevelCustom"
            placeholder="输入级别"
          />
          <el-date-picker
            v-model="newHonor.time"
            type="month"
            value-format="YYYY-MM"
            placeholder="获奖时间"
            style="width: 100%"
          />
        </div>
        <el-input v-model="newHonor.desc" type="textarea" :rows="2" placeholder="荣誉说明（选填）" />
        <el-button type="primary" class="add-honor-btn" @click="addHonor">+ 添加荣誉</el-button>
      </div>

      <div class="honor-list">
        <div class="honor-item" v-for="h in honorList" :key="h.id">
          <div class="honor-main">
            <span class="honor-title">{{ h.title }}</span>
            <el-tag size="small" effect="light" round>{{ h.level || '未填级别' }}</el-tag>
            <span class="honor-time">{{ h.time }}</span>
            <el-button type="danger" link @click="delHonor(h.id)">删除</el-button>
          </div>
          <p class="honor-desc" v-if="h.desc">{{ h.desc }}</p>
        </div>
        <el-empty v-if="!honorList.length" description="暂无荣誉，可在上方添加。" :image-size="60" />
      </div>
    </el-card>

    <!-- 成长时间线管理 -->
    <el-card shadow="hover" class="form-card">
      <template #header><span class="form-title">个人成长时间线管理</span></template>

      <div class="honor-form">
        <el-input v-model="newTimeline.title" placeholder="经历标题（必填），如：进入大学" />
        <el-input v-model="newTimeline.time" placeholder="时间，如：2024-09 或 2025-11 ~ 2026-01" />
        <el-input v-model="newTimeline.desc" type="textarea" :rows="2" placeholder="经历说明（选填）" />
        <el-button type="primary" class="add-honor-btn" @click="addTimeline">+ 添加经历</el-button>
      </div>

      <div class="honor-list">
        <div class="honor-item" v-for="t in timelineList" :key="t.id">
          <div class="honor-main">
            <span class="honor-time">{{ t.time }}</span>
            <span class="honor-title">{{ t.title }}</span>
            <el-button type="danger" link @click="delTimeline(t.id)">删除</el-button>
          </div>
          <p class="honor-desc" v-if="t.desc">{{ t.desc }}</p>
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
.add-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
/* 荣誉管理 */
.honor-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.honor-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.honor-row .level-select { flex: 1.2; min-width: 150px; }
.honor-row .el-input, .honor-row .el-date-editor { flex: 1; min-width: 150px; }
.add-honor-btn { align-self: flex-start; }
.honor-list .honor-item {
  padding: 10px 12px;
  margin-bottom: 8px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
}
.honor-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
}
.honor-title { font-weight: 600; color: var(--text); }
.honor-time { color: var(--text-light); font-size: 13px; margin-left: auto; }
.honor-desc { font-size: 13px; color: var(--text-light); margin: 6px 0 0; }
</style>
