<script setup>
// src/views/manage/ManageProjectsPage.vue
// 实验五改造：项目信息管理页。仍采用"本地草稿 + 点保存才写回"逻辑，
// 但保存时不再写 localStorage，而是通过 Store 的 syncAll 对比草稿与数据库，
// 按差异调用新增/修改/删除 RESTful 接口写入 MySQL。
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '../../stores/project'
import { exportJSON } from '../../utils/export'

const projectStore = useProjectStore()
const { list: workList } = storeToRefs(projectStore)
const { syncAll, statusOf } = projectStore

// 本地草稿副本：深拷贝，编辑只改草稿
const draft = ref([])

// 进入页面时先从接口加载，再以数据库内容初始化草稿
onMounted(async () => {
  await projectStore.ensureLoaded()
  draft.value = JSON.parse(JSON.stringify(workList.value))
})

// 新增：临时 id 置空并加 __new / __key 标记，保存时才写入数据库
function addProject() {
  draft.value.push({
    id: null, __new: true, __key: 'new-' + Date.now() + '-' + draft.value.length,
    title: '', role: '', status: '规划中', startTime: '',
    endTime: '', desc: '', isStar: false, techs: [], detail: '', stages: []
  })
}

function delProject(p) {
  draft.value = draft.value.filter(x => x !== p)
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

async function save() {
  const emptyTitles = draft.value.filter(p => !p.title.trim())
  if (emptyTitles.length) {
    ElMessage.warning('有项目标题为空，请填写完整后再保存')
    return
  }
  try {
    await syncAll(JSON.parse(JSON.stringify(draft.value)))
    draft.value = JSON.parse(JSON.stringify(workList.value))
    ElMessage.success('已保存到数据库')
  } catch (e) {
    ElMessage.error('保存失败：' + e.message)
  }
}

function cancel() {
  draft.value = JSON.parse(JSON.stringify(workList.value))
  ElMessage.info('已取消修改，恢复为已保存的内容')
}

// 导出项目数据为 JSON 文件（拓展要求：数据导出）
function exportData() {
  if (!workList.value.length) {
    ElMessage.warning('当前没有可导出的项目数据')
    return
  }
  exportJSON(workList.value, 'projects.json')
  ElMessage.success('已导出项目数据到 projects.json')
}
</script>

<template>
  <section class="manage-page">
    <el-card shadow="hover" class="form-card">
      <template #header>
        <span class="form-title">编辑项目信息</span>
      </template>

      <div class="proj-item" v-for="p in draft" :key="p.__key || p.id">
        <div class="proj-head">
          <el-input v-model="p.title" placeholder="项目标题（必填）" class="proj-title-input" />
          <!-- 状态由时间段自动推导，不手动选择 -->
          <el-tag :type="statusType(statusOf(p))" effect="light" round>{{ statusOf(p) }}</el-tag>
          <el-button type="danger" link @click="delProject(p)">删除</el-button>
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
        <el-button type="success" plain @click="exportData">导出项目数据</el-button>
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
