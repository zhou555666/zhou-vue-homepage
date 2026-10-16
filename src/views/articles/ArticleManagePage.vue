<script setup>
// src/views/articles/ArticleManagePage.vue
// 第二次实验：文章管理页使用 Element Plus 重构——
// el-button 新增、el-dialog + el-form 实现新增/编辑、el-table 展示文章列表、
// el-message / el-message-box 做操作反馈、el-date-picker 选择日期。
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useArticleStore } from '../../stores/article'

const articleStore = useArticleStore()
const { list } = storeToRefs(articleStore)

// 对话框可见性 & 表单
const dialogVisible = ref(false)
const formRef = ref(null)
const form = ref({ id: null, title: '', category: '随笔', summary: '', content: '', date: '' })
const editingId = ref(null)

// 表单校验规则
const rules = {
  title: [{ required: true, message: '请填写文章标题', trigger: 'blur' }]
}

function startAdd() {
  editingId.value = null
  form.value = { id: null, title: '', category: '随笔', summary: '', content: '', date: '' }
  dialogVisible.value = true
}

function startEdit(row) {
  editingId.value = row.id
  form.value = { id: row.id, title: row.title, category: row.category, summary: row.summary, content: row.content, date: row.date }
  dialogVisible.value = true
}

function save() {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (editingId.value === null) {
      articleStore.addArticle({ ...form.value })
      ElMessage.success('文章已新增')
    } else {
      articleStore.updateArticle({ ...form.value })
      ElMessage.success('文章已保存')
    }
    dialogVisible.value = false
    startAdd()
  })
}

function remove(row) {
  ElMessageBox.confirm('确定删除该文章吗？', '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  }).then(() => {
    articleStore.delArticle(row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}
</script>

<template>
  <section class="manage-page">
    <div class="toolbar">
      <h3 class="form-title">文章管理（共 {{ list.length }} 篇）</h3>
      <el-button type="primary" round @click="startAdd">新增文章</el-button>
    </div>

    <!-- 文章列表：el-table -->
    <el-card shadow="hover" class="table-card">
      <el-table :data="list" stripe empty-text="暂无文章">
        <el-table-column prop="title" label="标题" min-width="160" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag effect="light" round>{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="summary" label="摘要" min-width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="startEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框：el-dialog + el-form -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingId === null ? '新增文章' : '编辑文章'"
      width="520px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="文章标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category" placeholder="如：学习笔记、技术分享" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="文章摘要" />
        </el-form-item>
        <el-form-item label="正文">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="文章正文" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">{{ editingId === null ? '新增' : '保存' }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.manage-page { margin-top: 16px; }
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.form-title { margin: 0; color: var(--primary-deep); }
.table-card {
  --el-card-border-color: var(--border);
  background: var(--card);
  border-radius: 14px;
}
</style>
