<script setup>
// src/views/articles/ArticleListPage.vue
// 第二次实验：文章列表页使用 el-card / el-tag / el-button / el-empty 重构。
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores/article'

const articleStore = useArticleStore()
const { list, total } = storeToRefs(articleStore)
</script>

<template>
  <section class="article-list-page">
    <div class="al-header">
      <h2 class="al-title">文章列表</h2>
      <p class="al-subtitle">共 {{ total }} 篇文章</p>
      <el-button size="small" round @click="$router.push({ name: 'manage-articles' })">管理文章</el-button>
    </div>

    <div class="article-grid" v-if="list.length">
      <el-card
        v-for="a in list"
        :key="a.id"
        shadow="hover"
        class="article-card"
      >
        <template #header>
          <div class="a-head">
            <span class="a-title">{{ a.title }}</span>
            <el-tag effect="light" round size="small">{{ a.category }}</el-tag>
          </div>
        </template>
        <div class="a-meta">
          <span class="a-date">{{ a.date }}</span>
        </div>
        <p class="a-summary">{{ a.summary || '暂无摘要' }}</p>
      </el-card>
    </div>

    <el-empty v-else description="暂无文章～" />
  </section>
</template>

<style scoped>
.article-list-page { margin-top: 16px; }
.al-header { text-align: center; padding: 18px 0 6px; }
.al-title { margin: 0 0 6px; font-size: 20px; color: var(--primary-deep); }
.al-subtitle { margin: 0 0 12px; font-size: 13px; color: var(--text-light); }
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.article-card {
  --el-card-border-color: var(--border);
  background: var(--card);
  border-radius: 14px;
}
.a-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.a-title { font-size: 16px; font-weight: 700; color: var(--primary-deep); }
.a-meta { margin-bottom: 8px; }
.a-date { font-size: 12px; color: var(--text-light); }
.a-summary { margin: 0; font-size: 14px; line-height: 1.6; color: var(--text-light); }
</style>
