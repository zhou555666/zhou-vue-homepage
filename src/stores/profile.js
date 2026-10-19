// src/stores/profile.js
// 资料 Store：集中管理个人简介、荣誉、技能与兴趣爱好等资料数据。
// 使用 state/getters/actions 组织，并在 actions 中同步写入 localStorage 实现持久化。
import { defineStore } from 'pinia'

const STORAGE_KEY = 'vueExpProfileData'

const defaultPerson = {
  avatarUrl: `${import.meta.env.BASE_URL}头像.png`,
  name: '周志欢',
  studentId: '249980949',
  education: '本科',
  majorClass: '计算机科学与技术24级2班',
  brief: '热爱学习，喜欢编程。',
  gender: '女',
  birthday: '2005-05-24',
  email: 'zhouzhihuan@example.com'
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      return {
        personInfo: { ...defaultPerson, ...(data.personInfo || {}) },
        honorList: Array.isArray(data.honorList) && data.honorList.length ? data.honorList : [],
        skillList: Array.isArray(data.skillList) && data.skillList.length ? data.skillList : [],
        hobbyList: Array.isArray(data.hobbyList) && data.hobbyList.length ? data.hobbyList : []
      }
    }
  } catch (e) {
    console.warn('读取资料数据失败：', e)
  }
  return {
    personInfo: { ...defaultPerson },
    honorList: [],
    skillList: [
      { id: 1, name: 'Vue3' },
      { id: 2, name: 'HTML' },
      { id: 3, name: 'CSS' },
      { id: 4, name: 'JavaScript' },
      { id: 5, name: 'MS Office' },
      { id: 6, name: 'PS' }
    ],
    hobbyList: [
      { id: 1, name: '阅读' },
      { id: 2, name: '绘画' },
      { id: 3, name: '摄影' }
    ]
  }
}

export const useProfileStore = defineStore('profile', {
  state: () => load(),
  getters: {
    // 派生：技能数量、爱好数量
    skillCount: (state) => state.skillList.length,
    hobbyCount: (state) => state.hobbyList.length
  },
  actions: {
    // 持久化：把 state 写入 localStorage
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          personInfo: this.personInfo,
          honorList: this.honorList,
          skillList: this.skillList,
          hobbyList: this.hobbyList
        }))
      } catch (e) { console.warn('保存资料数据失败：', e) }
    },
    updatePerson(newPerson) { this.personInfo = newPerson; this.persist() },
    addHonor(item) { this.honorList.push(item); this.persist() },
    delHonor(id) { this.honorList = this.honorList.filter(h => h.id !== id); this.persist() },
    addSkill(name) {
      const newId = this.skillList.length ? Math.max(...this.skillList.map(s => s.id)) + 1 : 1
      this.skillList.push({ id: newId, name })
      this.persist()
    },
    delSkill(id) { this.skillList = this.skillList.filter(s => s.id !== id); this.persist() },
    addHobby(name) {
      const newId = this.hobbyList.length ? Math.max(...this.hobbyList.map(h => h.id)) + 1 : 1
      this.hobbyList.push({ id: newId, name })
      this.persist()
    },
    delHobby(id) { this.hobbyList = this.hobbyList.filter(h => h.id !== id); this.persist() }
  }
})
