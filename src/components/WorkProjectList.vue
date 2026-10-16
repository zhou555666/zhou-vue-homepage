<template>
<div class="section-card">
  <div class="section-header">
    <h3 class="section-title">工作 / 项目经历</h3>
    <RouterLink :to="{ name: 'manage-projects' }" class="btn ghost btn-mini">管理项目</RouterLink>
  </div>

  <ul class="exp-list" v-if="workList.length">
    <li v-for="w in workList" :key="w.id" class="exp-item">
      <div class="exp-main">
        <span class="exp-title">{{ w.title }}</span>
        <span class="exp-star" v-if="w.isStar">★ 代表作</span>
        <span class="exp-level">{{w.role}}</span>
        <span class="exp-time">{{w.startTime}} ~ {{w.endTime}}</span>
      </div>
      <p class="exp-desc" v-if="w.desc">{{w.desc}}</p>
    </li>
  </ul>
  <p class="empty-tip" v-else>暂无工作/项目经历～</p>
</div>
</template>

<script setup>
defineProps({
  workList: Array,
  skillList: Array
})
</script>

<style scoped>
.section-card{position:relative;padding:18px 20px;margin-top:16px;background:var(--card);border:1px solid var(--border);border-radius:14px;}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.section-title{margin:0;font-size:16px;color:var(--primary-deep);}
.btn{padding:8px 18px;font-size:14px;border:none;border-radius:999px;background:var(--primary);color:#fff;cursor:pointer;text-decoration:none;display:inline-block;}
.btn.ghost{background:transparent;color:var(--primary);border:1.5px solid var(--primary);}
.btn-mini{padding:4px 12px;font-size:12px;}
.exp-list{list-style:none;margin-top:12px;padding:0;}
.exp-item{padding:10px 12px;margin-bottom:8px;background:var(--card);border:1px solid var(--border);border-radius:10px;}
.exp-main{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:14px;}
.exp-title{font-weight:600;color:var(--text);}
.exp-star{font-size:12px;color:#b45309;background:#fef3c7;padding:2px 8px;border-radius:999px;}
.exp-level{color:var(--primary);font-size:13px;}
.exp-time{color:var(--text-light);font-size:13px;margin-left:auto;}
.exp-desc{font-size:13px;color:var(--text-light);margin:6px 0 0;}
.empty-tip{margin-top:10px;color:var(--text-light);}
</style>
