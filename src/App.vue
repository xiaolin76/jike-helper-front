<template>
  <!-- 主容器：响应式布局，适配电脑/手机 -->
  <div class="app-container">
    <header class="app-header">
      <h1>Jike Helper 🚀</h1>
      <p class="subtitle">基于 Vue + GitHub Pages 部署的测试项目</p>
    </header>

    <!-- 按钮区域：横向排列，响应式换行 -->
    <div class="btn-group">
      <button 
        class="api-btn" 
        @click="testTodoApi" 
        :disabled="loading"
      >
        {{ loading && currentApi === 'todo' ? '加载中...' : '测试待办接口' }}
      </button>
      <button 
        class="api-btn" 
        @click="testUserApi" 
        :disabled="loading"
      >
        {{ loading && currentApi === 'user' ? '加载中...' : '获取用户列表' }}
      </button>
    </div>

    <!-- 结果展示区域：卡片样式，有内容才显示 -->
<!-- 结果展示卡片：有数据/错误才显示 -->
<div class="result-card" v-if="apiResult || errorMsg || Object.keys(todoData).length || userData.length">
  <h3>接口返回结果：</h3>

  <!-- 错误状态：显示错误信息 + 重试按钮 -->
  <div v-if="errorMsg" class="error-state">
    ❌ {{ errorMsg }}
    <button class="retry-btn" @click="retryApi">重试</button>
  </div>

  <!-- 待办数据：表格展示 -->
  <div v-else-if="currentApi === 'todo' && Object.keys(todoData).length" class="table-container">
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

  <!-- 用户数据：表格展示 -->
  <div v-else-if="currentApi === 'user' && userData.length" class="table-container">
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

  <!-- 空状态：没数据时提示 -->
  <div v-else class="empty-state">
    📝 请点击上方按钮获取数据
  </div>
</div>
  </div>
</template>

<script setup>
// 重试接口请求
function retryApi() {
  if (currentApi === 'todo') {
    testTodoApi()
  } else if (currentApi === 'user') {
    testUserApi()
  }
}
// 导入Vue的响应式变量
import { ref } from 'vue'

// 响应式变量定义
const loading = ref(false) // 全局加载状态
const currentApi = ref('') // 当前请求的接口类型（todo/user）
const apiResult = ref('')  // 接口返回结果
const todoData = ref({})       // 存储待办单条数据
const userData = ref([])       // 存储用户列表数据
const errorMsg = ref('')       // 存储错误信息
/**
 * 测试待办接口：获取单条待办数据
 */
async function testTodoApi() {
  loading.value = true
  currentApi.value = 'todo'
  errorMsg.value = '' // 清空之前的错误
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    if (!response.ok) throw new Error(`请求失败：${response.status}`)
    const data = await response.json()
    todoData.value = data // 赋值给表格用的变量
    apiResult.value = JSON.stringify(data, null, 2) // 保留原变量，兼容判断
  } catch (error) {
    errorMsg.value = `待办接口请求失败：${error.message}`
    apiResult.value = '' // 清空原变量
  } finally {
    loading.value = false
    currentApi.value = ''
  }
}

/**
 * 测试用户接口：获取前3个用户列表
 */
async function testUserApi() {
  loading.value = true
  currentApi.value = 'user'
  errorMsg.value = '' // 清空之前的错误
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) throw new Error(`请求失败：${response.status}`)
    const data = await response.json()
    const simplifiedData = data.slice(0, 3).map(user => ({
      id: user.id, // 加id，用于v-for的key
      用户名: user.name,
      邮箱: user.email,
      城市: user.address.city,
      电话: user.phone
    }))
    userData.value = simplifiedData // 赋值给表格用的变量
    apiResult.value = JSON.stringify(simplifiedData, null, 2) // 保留原变量
  } catch (error) {
    errorMsg.value = `用户接口请求失败：${error.message}`
    apiResult.value = '' // 清空原变量
  } finally {
    loading.value = false
    currentApi.value = ''
  }
}
</script>

<style scoped>
/* 表格样式 */
.table-container {
  overflow-x: auto; /* 移动端横向滚动，防止表格溢出 */
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
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}
.data-table tr:hover {
  background-color: #f5f7fa; /* 行hover高亮 */
}
.completed {
  color: #52c41a; /* 已完成状态绿色 */
  font-weight: 600;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 1rem;
}

/* 错误状态样式 */
.error-state {
  padding: 20px;
  color: #f5222d; /* 错误红色 */
  font-size: 1rem;
  text-align: center;
}
.retry-btn {
  margin-left: 10px;
  padding: 6px 12px;
  background-color: #165DFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.retry-btn:hover {
  background-color: #0E48E5;
}
/* 全局样式重置 + 基础布局 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器：居中、响应式、背景色 */
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}

/* 头部样式：标题+副标题 */
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

/* 按钮组：横向排列，响应式换行 */
.btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
}
/* 按钮样式：美化+hover效果+禁用状态 */
.api-btn {
  padding: 12px 24px;
  background-color: #165DFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.api-btn:hover {
  background-color: #0E48E5;
  transform: translateY(-2px);
}
.api-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
  transform: none;
}

/* 结果卡片：白色背景+阴影+圆角 */
.result-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.result-card h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
}
/* 结果文本：格式化显示JSON，自动换行 */
.result-text {
  color: #333;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>