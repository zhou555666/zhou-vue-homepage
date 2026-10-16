<script setup>
// src/views/manage/ManageProjectsPage.vue
// 第二次实验：使用 el-card / el-input / el-tag / el-date-picker / el-button / el-message 重构。
// 保留"本地草稿 + 点保存才写回"的核心逻辑：不点保存不会影响公开页，也不会写入 localStorage；
// 点"取消"则丢弃草稿恢复为已保存内容。
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '../../stores/project'

const projectStore = useProjectStore()
const { list: workList } = storeToRefs(projectStore)
const { replaceAll, statusOf } = projectStore

// 本地草稿副本：深拷贝，编辑只改草稿
const draft = ref(JSON.parse(JSON.stringify(workList.value)))

function addProject() {
  const newId = draft.value.length ? Math.max(...draft.value.map(p => p.id)) + 1 : 1
  draft.value.push({
    id: newId, title: '', role: '', status: '规划中', startTime: '',
    endTime: '', desc: '', isStar: false, techs: [], detail: '', stages: []
  })
}

function delProject(id) {
  draft.value = draft.value.filter(p => p.id !== id)
}

function addStage(p) {
  p.stages.push({ name: '第' + (p.stages.length + 1) + '阶段', start: '', duration: '' })
}

// 状态 → el-tag 类型（状态由时间段自动推导）
function statusType(s) {
  if (s === '已完成') return 'success'
  if (s === '规划中') return 'info'
  return 'warning'
}

function save() {
  const emptyTitles = draft.value.filter(p => !p.title.trim())
  if (emptyTitles.length) {
    ElMessage.warning('有项目标题为空，请填写完整后再保存')
    return
  }
  replaceAll(JSON.parse(JSON.stringify(draft.value)))
  ElMessage.success('已保存')
}

function cancel() {
  draft.value = JSON.parse(JSON.stringify(workList.value))
  ElMessage.info('已取消修改，恢复为已保存的内容')
}
</script>

<template>
  <section class="manage-page">
    <el-card shadow="hover" class="form-card">
      <template #header>
        <span class="form-title">编辑项目信息</span>
      </template>

      <div class="proj-item" v-for="p in draft" :key="p.id">
        <div class="proj-head">
          <el-input v-model="p.title" placeholder="项目标题（必填）" class="proj-title-input" />
          <!-- 状态由时间段自动推导，不手动选择 -->
          <el-tag :type="statusType(statusOf(p))" effect="light" round>{{ statusOf(p) }}</el-tag>
          <el-button type="danger" link @click="delProject(p.id)">删除</el-button>
        </div>

        <el-form label-position="top">
          <el-form-item label="角色">
            <el-input v-model="p.role" placeholder="如：前端开发" />
          </el-form-item>
          <el-form-item label="时间段">
            <div class="time-row">
              <el-date-picker
                v-model="p.startTime"
                type="month"
                value-format="YYYY-MM"
                placeholder="开始月份"
                style="width: 100%"
              />
              <span class="tilde">~</span>
              <el-date-picker
                v-model="p.endTime"
                type="month"
                value-format="YYYY-MM"
                placeholder="结束月份"
                style="width: 100%"
              />
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="p.desc" type="textarea" :rows="2" placeholder="项目描述" />
          </el-form-item>

          <!-- 项目进程编辑 -->
          <el-form-item label="项目进程">
            <div class="stage-row" v-for="(st, i) in p.stages" :key="i">
              <el-input v-model="st.name" placeholder="阶段名称" class="stage-name" />
              <el-date-picker
                v-model="st.start"
                type="month"
                value-format="YYYY-MM"
                placeholder="开始月份"
                class="stage-start"
              />
              <el-input v-model="st.duration" placeholder="预计时长" class="stage-dur" />
              <el-button type="danger" link @click="p.stages.splice(i, 1)">删除</el-button>
            </div>
            <el-button size="small" plain @click="addStage(p)">+ 添加阶段</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="btn-row">
        <el-button @click="addProject">+ 新增项目</el-button>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消修改</el-button>
      </div>
    </el-card>
  </section>
</template>

<style scoped>
.manage-page { margin-top: 16px; }
.form-card {
  --el-card-border-color: var(--border);
  background: var(--card);
  border-radius: 14px;
}
.form-title { font-size: 16px; font-weight: 700; color: var(--primary-deep); }
.proj-item {
  padding: 14px 0;
  border-bottom: 1px dashed var(--border);
}
.proj-item:last-of-type { border-bottom: none; }
.proj-head {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}
.proj-title-input { flex: 1; }
.time-row {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}
.tilde { color: var(--text-light); }
.stage-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
  flex-wrap: wrap;
}
.stage-name { width: 150px; }
.stage-start { width: 150px; }
.stage-dur { width: 120px; }
.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
</style>
