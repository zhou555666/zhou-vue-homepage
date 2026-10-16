<template>
  <footer class="page-footer">
    <p>©2026 Vue实验 个人主页 ·
      <RouterLink :to="{ name: 'owner' }" class="footer-link">内容管理</RouterLink>
    </p>
  </footer>
</template>

<style scoped>
.page-footer {
  text-align: center;
  padding: 24px 0;
  color: var(--text-light);
}
.footer-link {
  color: var(--text-light);
  text-decoration: none;
}
.footer-link:hover {
  color: var(--primary);
  text-decoration: underline;
}
</style>
