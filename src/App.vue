<!-- src/App.vue 最简版（无接口依赖，可直接构建） -->
<template>
  <div class="app">
    <h1>Jike Helper 部署成功！🎉</h1>
    <p>国内访问正常啦～</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const apiResult = ref('')
async function testApi() {
  // 调用模拟接口（替换成你的真实接口）
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await res.json()
  apiResult.value = `接口返回：${JSON.stringify(data)}`
}
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