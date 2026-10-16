<template>
  <section class="not-found">
    <div class="nf-card">
      <h2 class="nf-code">404</h2>
      <p class="nf-text">你访问的页面不存在</p>
      <RouterLink :to="{ name: 'home' }" class="nf-link">返回首页</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
.nf-card { text-align: center; }
.nf-code {
  margin: 0;
  font-size: 64px;
  color: var(--primary);
}
.nf-text {
  margin: 8px 0 18px;
  color: var(--text-light);
}
.nf-link {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 999px;
  background: var(--primary);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
}
</style>
