<template>
  <article class="project-card">
    <!-- 具名插槽 header（作用域插槽）：标题区，把项目数据暴露给父组件（用于判断代表作等） -->
    <div class="card-header">
      <slot name="header" :project="project">
        <h3 class="card-title">{{ project.isStar ? '★ ' + project.title + '（代表作）' : project.title }}</h3>
        <span class="card-type">{{ project.role }}</span>
      </slot>
    </div>

    <!-- 默认插槽（带作用域）：主体内容，默认显示项目描述，并把项目数据暴露给父组件 -->
    <div class="card-body">
      <slot :project="project">{{ project.desc || '暂无描述' }}</slot>

      <!-- 技术栈标签：用户在个人主页编辑经历时从技能中勾选 -->
      <div class="card-techs" v-if="project.techs && project.techs.length">
        <span class="tech-tag" v-for="t in project.techs" :key="t">{{ t }}</span>
      </div>
    </div>

    <!-- 具名插槽 actions（作用域插槽）：操作/信息区，把项目数据暴露给父组件定制 -->
    <div class="card-actions">
      <slot name="actions" :project="project">
        <span class="card-time">{{ project.startTime || '未填' }} ~ {{ project.endTime || '至今' }}</span>
      </slot>
    </div>

    <!-- 具名插槽 footer（作用域插槽）：底部区，把项目数据暴露给父组件，默认展示角色标签 -->
    <div class="card-footer">
      <slot name="footer" :project="project">
        <span class="card-tag">{{ project.role }}</span>
      </slot>
    </div>

    <!-- 详情内容已由独立的项目详情页展示，卡片内不再展开 -->
  </article>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.project-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(236, 72, 153, 0.16);
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.card-title {
  margin: 0;
  font-size: 16px;
  color: var(--primary-deep);
}
.card-type {
  font-size: 12px;
  color: var(--primary);
  background: var(--primary-soft);
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.card-body {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-light);
  margin-bottom: 12px;
}
.card-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.tech-tag {
  font-size: 12px;
  color: var(--primary-deep);
  background: var(--primary-soft);
  padding: 3px 10px;
  border-radius: 999px;
}
.card-actions {
  margin-bottom: 10px;
}
.card-time {
  display: inline-block;
  font-size: 13px;
  color: var(--text-light);
  background: var(--primary-soft);
  padding: 5px 12px;
  border-radius: 999px;
}
.card-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border-top: 1px dashed var(--border);
  padding-top: 10px;
}
.card-tag {
  font-size: 12px;
  color: var(--primary-deep);
  background: var(--primary-soft);
  padding: 3px 10px;
  border-radius: 999px;
}
</style>
