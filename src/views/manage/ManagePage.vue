<template>
  <section class="manage-center">
    <div class="mc-header">
      <h2 class="mc-title">内容管理</h2>
      <p class="mc-subtitle">仅所有者可访问，修改后自动保存到本地</p>
    </div>

    <nav class="mc-tabs">
      <RouterLink :to="{ name: 'manage-profile' }" class="tab-link">个人简介</RouterLink>
      <RouterLink :to="{ name: 'manage-projects' }" class="tab-link">项目信息</RouterLink>
      <RouterLink :to="{ name: 'manage-skills' }" class="tab-link">技能爱好</RouterLink>
      <RouterLink :to="{ name: 'manage-articles' }" class="tab-link">文章管理</RouterLink>
    </nav>

    <RouterView />
  </section>
</template>

<style scoped>
.manage-center { margin-top: 16px; }
.mc-header { text-align: center; padding: 18px 0 6px; }
.mc-title { margin: 0 0 6px; font-size: 20px; color: var(--primary-deep); }
.mc-subtitle { margin: 0; font-size: 13px; color: var(--text-light); }
.mc-tabs {
  display: flex;
  justify-content: center;
  gap: 6px;
  background: var(--primary-soft);
  padding: 4px;
  border-radius: 999px;
  width: fit-content;
  margin: 14px auto;
}
.tab-link {
  border: none;
  background: transparent;
  color: var(--text-light);
  font-size: 13px;
  padding: 6px 18px;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.tab-link.router-link-exact-active {
  background: var(--primary);
  color: #fff;
}
</style>
