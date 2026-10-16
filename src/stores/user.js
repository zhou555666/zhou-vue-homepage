// src/stores/user.js
// 用户 Store：集中管理登录状态，供路由守卫与各组件共享。
// 说明：登录态为"会话级"——不写入 localStorage，页面刷新即失效；
// 离开后台管理区（/manage）时由路由守卫自动清除，下次进入需重新验证口令。
// state：登录状态（isOwner）；getters：isLogin 派生登录状态；
// actions：login（口令校验并置为登录）、logout（清除登录状态）。
import { defineStore } from 'pinia'

// 清理历史版本写入的持久化登录标记（登录态不再落盘）
try { localStorage.removeItem('isOwner') } catch (e) { /* 忽略 */ }

export const useUserStore = defineStore('user', {
  state: () => ({
    // 登录状态：仅存于内存，刷新或离开后台后即失效
    isOwner: false
  }),
  getters: {
    // 是否已登录（供路由守卫与页面判断）
    isLogin: (state) => state.isOwner
  },
  actions: {
    // 口令校验：正确则置为已登录（不持久化）
    login(code) {
      if (code === 'owner') {
        this.isOwner = true
        return true
      }
      return false
    },
    // 清除登录状态（由路由守卫在离开后台管理区时调用）
    logout() {
      this.isOwner = false
    }
  }
})
