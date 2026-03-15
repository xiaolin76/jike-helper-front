<template>
  <div class="app-container">
    <header class="app-header">
      <h1>吉克助手 🚀</h1>
      <p class="subtitle">基于 Vue + GitHub Pages 部署的测试项目</p>
    </header>

    <div class="btn-group">
      <button 
        class="api-btn" 
        @click="testTodoApi" 
        :disabled="loading"
      >
        <span v-if="loading && currentApi === 'todo'" class="loading-icon"></span>
        {{ loading && currentApi === 'todo' ? '加载中...' : '测试待办接口' }}
      </button>
      <button 
        class="api-btn" 
        @click="testUserApi" 
        :disabled="loading"
      >
        <span v-if="loading && currentApi === 'user'" class="loading-icon"></span>
        {{ loading && currentApi === 'user' ? '加载中...' : '获取用户列表' }}
      </button>
    </div>

    <div class="result-card">
      <h3>接口返回结果：</h3>
      
      <!-- 空状态：只有从未点击过任何按钮时才显示 -->
      <div v-if="!currentApi && !todoData && !userData && !errorMsg" class="empty-state">
        📝 请点击上方按钮获取数据
      </div>

      <!-- 错误状态：请求失败时显示 -->
      <div v-else-if="errorMsg" class="error-state">
        ❌ {{ errorMsg }}
      </div>

      <!-- 待办数据表格：只要 currentApi 是 todo 且有数据，就一直显示 -->
      <div v-else-if="currentApi === 'todo' && todoData" class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>待办ID</th>
              <th>用户ID</th>
              <th>待办标题</th>
              <th>完成状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ todoData.id }}</td>
              <td>{{ todoData.userId }}</td>
              <td>{{ todoData.title }}</td>
              <td :class="{ completed: todoData.completed }">
                {{ todoData.completed ? '✅ 已完成' : '⏳ 未完成' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 用户数据表格：只要 currentApi 是 user 且有数据，就一直显示 -->
      <div v-else-if="currentApi === 'user' && userData" class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>邮箱</th>
              <th>城市</th>
              <th>电话</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userData" :key="user.id">
              <td>{{ user.用户名 }}</td>
              <td>{{ user.邮箱 }}</td>
              <td>{{ user.城市 }}</td>
              <td>{{ user.电话 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const currentApi = ref('') // 关键：这个变量永远不会被手动清空！
const todoData = ref(null)
const userData = ref(null)
const errorMsg = ref('')

async function testTodoApi() {
  loading.value = true
  currentApi.value = 'todo' // 标记当前是待办接口
  errorMsg.value = ''
  todoData.value = null
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    if (!res.ok) throw new Error(`请求失败：${res.status}`)
    const data = await res.json()
    todoData.value = data
  } catch (err) {
    errorMsg.value = `待办接口错误：${err.message}`
    todoData.value = null
  } finally {
    loading.value = false
    // ✅ 绝对不要写 currentApi.value = ''！这是导致自动返回空状态的元凶！
  }
}

async function testUserApi() {
  loading.value = true
  currentApi.value = 'user' // 标记当前是用户接口
  errorMsg.value = ''
  userData.value = null
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!res.ok) throw new Error(`请求失败：${res.status}`)
    const data = await res.json()
    userData.value = data.slice(0, 3).map(user => ({
      id: user.id,
      用户名: user.name,
      邮箱: user.email,
      城市: user.address.city,
      电话: user.phone
    }))
  } catch (err) {
    errorMsg.value = `用户接口错误：${err.message}`
    userData.value = null
  } finally {
    loading.value = false
    // ✅ 同样，绝对不要清空 currentApi！
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  background: #f0f2f5;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}
.app-header {
  text-align: center;
  margin-bottom: 40px;
}
.app-header h1 {
  color: #165DFF;
  font-size: 2.2rem;
  margin-bottom: 10px;
}
.subtitle {
  color: #666;
  font-size: 1rem;
}
.btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
}
.api-btn {
  padding: 12px 24px;
  background: #165DFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}
.api-btn:hover {
  background: #0E48E5;
  transform: translateY(-2px);
}
.api-btn:disabled {
  background: #999;
  cursor: not-allowed;
  transform: none;
}
.loading-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 6px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.result-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.result-card h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
}
.empty-state {
  text-align: center;
  color: #666;
  padding: 30px 0;
}
.error-state {
  text-align: center;
  color: #ff4d4f;
  padding: 30px 0;
}
.table-container {
  overflow-x: auto;
  margin-top: 15px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.data-table th, .data-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}
.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}
.data-table tr:hover {
  background: #f5f7fa;
}
.completed {
  color: #52c41a;
  font-weight: 600;
}
</style>