<script setup>
// src/views/OwnerPage.vue
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const code = ref('')
const message = ref('')

function verify() {
  // 调用用户 Store 的 login action：校验口令并持久化登录状态
  if (userStore.login(code.value)) {
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect) {
      router.replace(redirect)
    } else {
      router.replace({ name: 'manage-profile' })
    }
  } else {
    message.value = '口令不正确，请重新输入'
  }
}
</script>

<template>
  <section class="owner-page">
    <div class="owner-card">
      <h2 class="owner-title">内容管理入口</h2>
      <p class="owner-tip">公开页面无需验证，修改内容时才需要确认所有者身份。</p>
      <input
        v-model="code"
        type="password"
        class="owner-input"
        placeholder="课堂演示口令：owner"
        @keyup.enter="verify"
      />
      <p class="owner-error">{{ message }}</p>
      <button class="owner-btn" @click="verify">进入内容管理</button>
    </div>
  </section>
</template>

<style scoped>
.owner-page {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
.owner-card {
  width: 100%;
  max-width: 420px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 28px;
  text-align: center;
}
.owner-title {
  margin: 0 0 8px;
  color: var(--primary-deep);
}
.owner-tip {
  margin: 0 0 18px;
  font-size: 13px;
  color: var(--text-light);
}
.owner-input {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  box-sizing: border-box;
}
.owner-input:focus {
  outline: none;
  border-color: var(--primary);
}
.owner-error {
  margin: 8px 0 0;
  font-size: 13px;
  color: #dc2626;
  min-height: 18px;
}
.owner-btn {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 999px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.owner-btn:hover { background: var(--primary-deep); }
</style>
