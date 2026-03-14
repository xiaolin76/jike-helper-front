<template>
  <div id="app" class="container">
    <!-- 页面标题 -->
    <el-page-header content="计科专业学习助手" class="page-header" />

    <!-- 核心功能标签页 -->
    <el-tabs v-model="activeTab" type="card" class="tabs-container">
      <!-- 1. 知识点问答模块 -->
      <el-tab-pane label="知识点问答" name="knowledge">
        <el-card shadow="hover" class="func-card">
          <el-form :model="knowledgeForm" label-width="80px">
            <el-form-item label="提问内容">
              <el-input
                v-model="knowledgeForm.question"
                type="textarea"
                :rows="5"
                placeholder="请输入你想提问的计科知识点，例如：什么是链表？快速排序的原理是什么？"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitKnowledge"
                :loading="knowledgeLoading"
              >
                提交提问
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 回答结果展示 -->
          <div v-if="knowledgeResult" class="result-container">
            <el-divider content-position="left">回答结果</el-divider>
            <el-card class="result-card">
              <div v-html="knowledgeResult"></div>
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 2. 代码讲解模块 -->
      <el-tab-pane label="代码讲解" name="code">
        <el-card shadow="hover" class="func-card">
          <el-form :model="codeForm" label-width="80px">
            <el-form-item label="代码内容">
              <el-input
                v-model="codeForm.code"
                type="textarea"
                :rows="8"
                placeholder="请粘贴你需要讲解的代码，例如：Python/Java/C++ 代码片段"
              />
            </el-form-item>
            <el-form-item label="讲解需求">
              <el-input
                v-model="codeForm.requirement"
                placeholder="例如：解释这段代码的逻辑、分析时间复杂度、指出优化点"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitCode"
                :loading="codeLoading"
              >
                解析代码
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 讲解结果展示 -->
          <div v-if="codeResult" class="result-container">
            <el-divider content-position="left">讲解结果</el-divider>
            <el-card class="result-card">
              <div v-html="codeResult"></div>
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 3. 错题分析模块 -->
      <el-tab-pane label="错题分析" name="error">
        <el-card shadow="hover" class="func-card">
          <el-form :model="errorForm" label-width="80px">
            <el-form-item label="错题内容">
              <el-input
                v-model="errorForm.question"
                type="textarea"
                :rows="5"
                placeholder="请输入错题题目，例如：写出冒泡排序的代码并分析错误点"
              />
            </el-form-item>
            <el-form-item label="你的答案">
              <el-input
                v-model="errorForm.yourAnswer"
                type="textarea"
                :rows="3"
                placeholder="请粘贴你作答的内容/代码"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitError"
                :loading="errorLoading"
              >
                分析错题
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 分析结果展示 -->
          <div v-if="errorResult" class="result-container">
            <el-divider content-position="left">分析结果</el-divider>
            <el-card class="result-card">
              <div v-html="errorResult"></div>
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
// 导入Element Plus的消息提示组件
import { ElMessage } from 'element-plus'
// Vue3组合式API
import { ref } from 'vue'
// 获取全局挂载的axios
const app = getCurrentInstance()
const axios = app.appContext.config.globalProperties.$axios

// ********** 状态管理 **********
// 激活的标签页
const activeTab = ref('knowledge')

// 知识点问答相关
const knowledgeForm = ref({ question: '' })
const knowledgeLoading = ref(false)
const knowledgeResult = ref('')

// 代码讲解相关
const codeForm = ref({ code: '', requirement: '' })
const codeLoading = ref(false)
const codeResult = ref('')

// 错题分析相关
const errorForm = ref({ question: '', yourAnswer: '' })
const errorLoading = ref(false)
const errorResult = ref('')

// ********** 接口调用函数 **********
// 1. 提交知识点问答
const submitKnowledge = async () => {
  if (!knowledgeForm.value.question.trim()) {
    ElMessage.warning('请输入提问内容！')
    return
  }
  knowledgeLoading.value = true
  try {
    // 调用后端知识点问答接口
    const res = await axios.post('/api/knowledge/qa', {
      question: knowledgeForm.value.question
    })
    knowledgeResult.value = res.data.answer || '未获取到回答，请重试！'
    ElMessage.success('提问成功！')
  } catch (error) {
    ElMessage.error('提问失败：' + (error.message || '网络异常'))
    knowledgeResult.value = ''
  } finally {
    knowledgeLoading.value = false
  }
}

// 2. 提交代码讲解
const submitCode = async () => {
  if (!codeForm.value.code.trim()) {
    ElMessage.warning('请粘贴需要讲解的代码！')
    return
  }
  codeLoading.value = true
  try {
    // 调用后端代码讲解接口
    const res = await axios.post('/api/code/explain', {
      code: codeForm.value.code,
      requirement: codeForm.value.requirement
    })
    codeResult.value = res.data.explanation || '未获取到讲解内容，请重试！'
    ElMessage.success('代码解析成功！')
  } catch (error) {
    ElMessage.error('解析失败：' + (error.message || '网络异常'))
    codeResult.value = ''
  } finally {
    codeLoading.value = false
  }
}

// 3. 提交错题分析
const submitError = async () => {
  if (!errorForm.value.question.trim()) {
    ElMessage.warning('请输入错题内容！')
    return
  }
  errorLoading.value = true
  try {
    // 调用后端错题分析接口
    const res = await axios.post('/api/error/analyze', {
      question: errorForm.value.question,
      yourAnswer: errorForm.value.yourAnswer
    })
    errorResult.value = res.data.analysis || '未获取到分析内容，请重试！'
    ElMessage.success('错题分析成功！')
  } catch (error) {
    ElMessage.error('分析失败：' + (error.message || '网络异常'))
    errorResult.value = ''
  } finally {
    errorLoading.value = false
  }
}
</script>

<style scoped>
/* 页面整体样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面标题 */
.page-header {
  margin-bottom: 20px;
}

/* 标签页容器 */
.tabs-container {
  margin-bottom: 20px;
}

/* 功能卡片 */
.func-card {
  margin-bottom: 20px;
}

/* 结果展示区域 */
.result-container {
  margin-top: 20px;
}

.result-card {
  padding: 15px;
  line-height: 1.8;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
</style>
<template>
  <div>
    <h1>极客助手前端页面</h1>
    <p>部署测试成功！</p>
  </div>
</template>

<script setup>
// 暂时空脚本，仅用于测试部署
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>