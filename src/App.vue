<!-- src/App.vue 最简版（无接口依赖，可直接构建） -->
<template>
  <div class="app">
    <h1>Jike Helper 部署成功！🎉</h1>
    <p>国内访问正常啦～</p>
  </div>
</template>

<script setup>
// 暂时清空脚本，移除所有api相关导入
</script>

<style scoped>
.app {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}
h1 {
  color: #42b983; /* Vue 主题色 */
}
</style>