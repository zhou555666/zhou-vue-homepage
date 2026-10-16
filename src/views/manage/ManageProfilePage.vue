<script setup>
// src/views/manage/ManageProfilePage.vue
// 第二次实验：使用 el-card / el-form / el-input / el-button / el-message 重构。
// 保留"点保存才写回 Store"的行为，避免边改边存。
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useProfileStore } from '../../stores/profile'

const profileStore = useProfileStore()
const { personInfo } = storeToRefs(profileStore)
const { updatePerson } = profileStore

const formRef = ref(null)
const form = reactive({ ...personInfo.value })

function save() {
  updatePerson({ ...form })
  ElMessage.success('已保存')
}

function cancel() {
  Object.assign(form, personInfo.value)
  ElMessage.info('已取消修改，恢复为已保存的内容')
}
</script>

<template>
  <section class="manage-page">
    <el-card shadow="hover" class="form-card">
      <template #header>
        <span class="form-title">编辑个人简介</span>
      </template>
      <el-form ref="formRef" :model="form" label-width="90px">
        <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="学号"><el-input v-model="form.studentId" /></el-form-item>
        <el-form-item label="班级"><el-input v-model="form.majorClass" /></el-form-item>
        <el-form-item label="学历"><el-input v-model="form.education" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="form.brief" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消修改</el-button>
        </el-form-item>
      </el-form>
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
.form-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-deep);
}
</style>
