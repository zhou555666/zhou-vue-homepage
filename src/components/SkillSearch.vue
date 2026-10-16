<template>
<div class="section-card">
  <h3 class="section-title">技能 / 兴趣</h3>
  <div>
    <span class="skill-tag" v-for="s in skillList" :key="s.id">{{ s.name }}</span>
  </div>
</div>
</template>

<script setup>
defineProps({ skillList: Array })
</script>

<style scoped>
.section-card{position:relative;padding:18px 20px;margin-top:16px;background:var(--card);border:1px solid var(--border);border-radius:14px;}
.section-title{margin:0 0 12px;font-size:16px;color:var(--primary-deep);}
.skill-tag{display:inline-block;margin:5px 6px 5px 0;padding:6px 14px;font-size:14px;background:var(--primary-soft);color:var(--primary-deep);border-radius:999px;}
</style>
