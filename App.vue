<template>
  <!-- 主容器：响应式布局，适配电脑/手机 -->
  <div class="app-container">
    <!-- 页面头部 -->
    <header class="app-header">
      <h1>吉克助手 🚀</h1>
      <p class="subtitle">基于 Vue + GitHub Pages 部署的测试项目</p>
    </header>

    <!-- 功能按钮区域 -->
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

    <!-- 结果展示卡片 -->
    <div class="result-card">
      <h3>接口返回结果：</h3>
      
      <!-- 空状态：未点击任何按钮时显示 -->
      <div v-if="!currentApi && !todoData && !userData && !errorMsg" class="empty-state">
        📝 请点击上方按钮获取数据
      </div>

      <!-- 错误状态：请求失败时显示 -->
      <div v-else-if="errorMsg" class="error-state">
        ❌ {{ errorMsg }}
      </div>

      <!-- 待办数据表格：稳定显示，不自动消失 -->
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

      <!-- 用户数据表格：稳定显示，不自动消失 -->
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
// 导入Vue响应式核心
import { ref } from 'vue'

// 响应式变量定义
const loading = ref(false)        // 全局加载状态
const currentApi = ref('')        // 当前请求的接口类型（todo/user，关键：不再清空）
const todoData = ref(null)        // 存储待办接口数据
const userData = ref(null)        // 存储用户接口数据
const errorMsg = ref('')          // 存储请求错误信息

/**
 * 测试待办接口：获取单条待办数据
 * 核心修复：请求结束后不清空 currentApi，保证表格持续渲染
 */
async function testTodoApi() {
  loading.value = true
  currentApi.value = 'todo'       // 标记当前是待办接口
  errorMsg.value = ''             // 清空之前的错误信息
  todoData.value = null           // 清空旧的待办数据

  try {
    // 调用免费模拟接口
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    // 检查接口请求状态
    if (!response.ok) throw new Error(`请求失败：${response.status}`)
    const data = await response.json()
    todoData.value = data         // 赋值待办数据，触发表格渲染
  } catch (error) {
    // 捕获错误并存储提示信息
    errorMsg.value = `待办接口请求失败：${error.message}`
    todoData.value = null
  } finally {
    loading.value = false         // 关闭加载状态（关键：不清空 currentApi）
  }
}

/**
 * 获取用户列表接口：获取前3个用户数据
 * 核心修复：请求结束后不清空 currentApi，保证表格持续渲染
 */
async function testUserApi() {
  loading.value = true
  currentApi.value = 'user'       // 标记当前是用户接口
  errorMsg.value = ''             // 清空之前的错误信息
  userData.value = null           // 清空旧的用户数据

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) throw new Error(`请求失败：${response.status}`)
    const data = await response.json()
    // 精简用户数据，只保留前3条核心信息
    userData.value = data.slice(0, 3).map(user => ({
      id: user.id,
      用户名: user.name,
      邮箱: user.email,
      城市: user.address.city,
      电话: user.phone
    }))
  } catch (error) {
    errorMsg.value = `用户接口请求失败：${error.message}`
    userData.value = null
  } finally {
    loading.value = false         // 关闭加载状态（关键：不清空 currentApi）
  }
}
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器样式 */
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}

/* 头部样式 */
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

/* 按钮组样式 */
.btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

/* 功能按钮样式 */
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

/* 加载动画样式 */
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

/* 结果卡片样式 */
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

/* 空状态样式 */
.empty-state {
  text-align: center;
  color: #666;
  padding: 30px 0;
  font-size: 1rem;
}

/* 错误状态样式 */
.error-state {
  text-align: center;
  color: #ff4d4f;
  padding: 30px 0;
  font-size: 1rem;
}

/* 表格容器：适配移动端横向滚动 */
.table-container {
  overflow-x: auto;
  margin-top: 15px;
}

/* 数据表格样式 */
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
  background-color: #f5f7fa;
}

/* 完成状态文字样式 */
.completed {
  color: #52c41a;
  font-weight: 600;
}
</style>