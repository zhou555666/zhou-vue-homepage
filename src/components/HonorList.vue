<template>
<div class="section-card">
  <div class="section-header">
    <h3 class="section-title">荣誉 / 获奖经历</h3>
  </div>
  <ul class="exp-list" v-if="honorList.length">
    <li v-for="h in honorList" :key="h.id" class="exp-item">
      <div class="exp-main">
        <span class="exp-title">{{h.title}}</span>
        <span class="exp-level">{{h.level}}</span>
        <span class="exp-time">{{h.time}}</span>
      </div>
      <p class="exp-desc" v-if="h.desc">{{h.desc}}</p>
    </li>
  </ul>
  <p class="empty-tip" v-else>暂无荣誉。</p>
</div>
</template>

<script setup>
defineProps({ honorList: Array })
</script>

<style scoped>
.section-card{position:relative;padding:18px 20px;margin-top:16px;background:var(--card);border:1px solid var(--border);border-radius:14px;}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.section-title{margin:0;font-size:16px;color:var(--primary-deep);}
.exp-list{list-style:none;margin-top:12px;padding:0;}
.exp-item{padding:10px 12px;margin-bottom:8px;background:var(--card);border:1px solid var(--border);border-radius:10px;}
.exp-main{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:14px;}
.exp-title{font-weight:600;color:var(--text);}
.exp-level{color:var(--primary);font-size:13px;}
.exp-time{color:var(--text-light);font-size:13px;margin-left:auto;}
.exp-desc{font-size:13px;color:var(--text-light);margin:6px 0 0;}
.empty-tip{margin-top:10px;color:var(--text-light);}
</style>
