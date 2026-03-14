import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
// 导入Vue核心创建函数
import { createApp } from 'vue'
// 导入全局样式
import './style.css'
// 导入根组件
import App from './App.vue'
// 导入Element Plus组件库
import ElementPlus from 'element-plus'
// 导入Element Plus样式
import 'element-plus/dist/index.css'
// 导入axios用于接口请求
import axios from 'axios'

// 创建Vue应用实例
const app = createApp(App)

// 全局注册Element Plus
app.use(ElementPlus)

// 配置axios全局请求地址（已替换为你的腾讯云函数URL）
// 核心修改点：把本地地址换成了你的公网后端地址
axios.defaults.baseURL = 'https://1411379967-fq7o7kqg1h.ap-guangzhou.tencentscf.com'
// 配置请求超时时间（防止大模型响应慢导致超时）
axios.defaults.timeout = 30000

// 把axios挂载到Vue全局，方便组件内调用
app.config.globalProperties.$axios = axios

// 挂载应用到页面根节点
app.mount('#app')
