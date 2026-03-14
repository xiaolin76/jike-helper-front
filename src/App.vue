<template>
  <div class="app">
    <h1>Jike Helper 部署成功！🎉</h1>
    <button @click="testApi">测试接口</button>
    <p v-if="apiResult">{{ apiResult }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const apiResult = ref('')
async function testApi() {
  // 调用模拟接口
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await res.json()
  apiResult.value = `接口返回：${JSON.stringify(data)}`
}
</script>

<style scoped>
.app {
  text-align: center;
  padding: 50px;
}
button {
  padding: 8px 16px;
  margin: 20px 0;
  cursor: pointer;
}
</style>