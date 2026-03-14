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
    <div class="result-card" v-if="apiResult">
      <h3>接口返回结果：</h3>
      <pre class="result-text">{{ apiResult }}</pre>
    </div>
  </div>
</template>

<script setup>
// 导入Vue的响应式变量
import { ref } from 'vue'

// 响应式变量定义
const loading = ref(false) // 全局加载状态
const currentApi = ref('') // 当前请求的接口类型（todo/user）
const apiResult = ref('')  // 接口返回结果

/**
 * 测试待办接口：获取单条待办数据
 */
async function testTodoApi() {
  // 设置加载状态
  loading.value = true
  currentApi.value = 'todo'
  try {
    // 调用免费模拟接口
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    // 检查接口是否请求成功
    if (!response.ok) throw new Error(`请求失败：${response.status}`)
    const data = await response.json()
    // 格式化返回结果，更易读
    apiResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    // 捕获错误并提示
    apiResult.value = `❌ 待办接口请求失败：${error.message}`
  } finally {
    // 无论成功/失败，都关闭加载状态
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
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) throw new Error(`请求失败：${response.status}`)
    const data = await response.json()
    // 只取前3个用户，保留核心字段，格式化显示
    const simplifiedData = data.slice(0, 3).map(user => ({
      用户名: user.name,
      邮箱: user.email,
      城市: user.address.city,
      电话: user.phone
    }))
    apiResult.value = JSON.stringify(simplifiedData, null, 2)
  } catch (error) {
    apiResult.value = `❌ 用户接口请求失败：${error.message}`
  } finally {
    loading.value = false
    currentApi.value = ''
  }
}
</script>

<style scoped>
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