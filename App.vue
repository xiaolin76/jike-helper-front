<template>
  <!-- 主容器：毕设级专业风格 -->
  <div class="app-container">
    <!-- 顶部导航栏：课程选择 + 标题 -->
    <header class="app-header">
      <h1>计科学习助手 📚</h1>
      <div class="course-select">
        <label>选择课程：</label>
        <select v-model="selectedCourse" @change="resetModule">
          <option value="dataStructure">数据结构</option>
          <option value="computerOrg">计算机组成原理</option>
          <option value="os">操作系统</option>
          <option value="network">计算机网络</option>
        </select>
      </div>
    </header>

    <!-- 功能标签页：切换不同模块 -->
    <div class="tab-nav">
      <button 
        class="tab-btn" 
        :class="{ active: currentModule === 'knowledge' }"
        @click="currentModule = 'knowledge'"
      >
        知识点问答
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: currentModule === 'code' }"
        @click="currentModule = 'code'"
      >
        代码讲解
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: currentModule === 'wrongQuestion' }"
        @click="currentModule = 'wrongQuestion'"
      >
        错题分析
      </button>
    </div>

    <!-- 内容展示区：根据模块切换 -->
    <div class="content-card">
      <!-- 1. 知识点问答模块 -->
      <div v-if="currentModule === 'knowledge'" class="module-content">
        <h3>{{ courseConfig[selectedCourse].name }} - 核心知识点</h3>
        <!-- 知识点搜索框 -->
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索知识点（如：链表、中断、进程）"
            @input="filterKnowledge"
          >
        </div>
        <!-- 知识点列表 -->
        <div class="knowledge-list">
          <div 
            class="knowledge-item" 
            v-for="item in filteredKnowledge" 
            :key="item.id"
            @click="selectKnowledge(item)"
          >
            <h4>{{ item.title }}</h4>
            <p class="preview">{{ item.content.slice(0, 50) }}...</p>
          </div>
          <div v-if="filteredKnowledge.length === 0" class="empty-tip">
            ❌ 未找到相关知识点
          </div>
        </div>
        <!-- 知识点详情 -->
        <div class="knowledge-detail" v-if="selectedKnowledge">
          <h4>📖 {{ selectedKnowledge.title }}</h4>
          <div class="detail-content" v-html="selectedKnowledge.content"></div>
        </div>
      </div>

      <!-- 2. 代码讲解模块 -->
      <div v-if="currentModule === 'code'" class="module-content">
        <h3>{{ courseConfig[selectedCourse].name }} - 经典代码讲解</h3>
        <div class="code-list">
          <div 
            class="code-item" 
            v-for="item in courseConfig[selectedCourse].codeCases" 
            :key="item.id"
            @click="selectCode(item)"
          >
            <h4>{{ item.title }}</h4>
            <p class="preview">难度：{{ item.level }}</p>
          </div>
        </div>
        <!-- 代码详情 -->
        <div class="code-detail" v-if="selectedCode">
          <h4>💻 {{ selectedCode.title }}</h4>
          <p class="code-desc">{{ selectedCode.description }}</p>
          <pre class="code-block"><code>{{ selectedCode.code }}</code></pre>
          <div class="code-analysis">
            <h5>代码解析：</h5>
            <p>{{ selectedCode.analysis }}</p>
          </div>
        </div>
      </div>

      <!-- 3. 错题分析模块 -->
      <div v-if="currentModule === 'wrongQuestion'" class="module-content">
        <h3>{{ courseConfig[selectedCourse].name }} - 高频错题分析</h3>
        <div class="wrong-list">
          <div 
            class="wrong-item" 
            v-for="item in courseConfig[selectedCourse].wrongQuestions" 
            :key="item.id"
            @click="selectWrongQuestion(item)"
          >
            <h4>{{ item.question.slice(0, 60) }}...</h4>
            <p class="preview">错误率：{{ item.errorRate }}</p>
          </div>
        </div>
        <!-- 错题详情 -->
        <div class="wrong-detail" v-if="selectedWrongQuestion">
          <h4>❓ 题目：{{ selectedWrongQuestion.question }}</h4>
          <div class="wrong-option">
            <h5>选项：</h5>
            <ul>
              <li v-for="(opt, idx) in selectedWrongQuestion.options" :key="idx">
                {{ String.fromCharCode(65 + idx) }}. {{ opt }}
              </li>
            </ul>
          </div>
          <div class="wrong-answer">
            <h5>正确答案：{{ selectedWrongQuestion.correctAnswer }}</h5>
          </div>
          <div class="wrong-reason">
            <h5>错误原因分析：</h5>
            <p>{{ selectedWrongQuestion.errorReason }}</p>
          </div>
          <div class="wrong-summary">
            <h5>知识点总结：</h5>
            <p>{{ selectedWrongQuestion.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 1. 核心响应式变量
const selectedCourse = ref('dataStructure') // 默认选中数据结构
const currentModule = ref('knowledge')      // 默认显示知识点问答
const searchKeyword = ref('')               // 知识点搜索关键词
const selectedKnowledge = ref(null)        // 选中的知识点
const selectedCode = ref(null)              // 选中的代码案例
const selectedWrongQuestion = ref(null)     // 选中的错题

// 2. 课程配置：模拟毕设所需的核心数据（后续可对接后端数据库）
const courseConfig = {
  // 数据结构
  dataStructure: {
    name: '数据结构',
    knowledge: [
      {
        id: 1,
        title: '单链表的基本操作',
        content: `
          <p>单链表是一种线性表，元素通过指针连接，特点是：</p>
          <ol>
            <li>无需连续内存空间，动态扩展</li>
            <li>查找效率O(n)，插入/删除效率O(1)（已知节点）</li>
            <li>核心操作：创建、插入、删除、遍历、反转</li>
          </ol>
          <p>适用场景：频繁插入删除、内存碎片化场景</p>
        `
      },
      {
        id: 2,
        title: '快速排序的原理与复杂度',
        content: `
          <p>快速排序基于分治思想，步骤：</p>
          <ol>
            <li>选择基准元素（pivot）</li>
            <li>分区：小于基准放左边，大于放右边</li>
            <li>递归处理左右子数组</li>
          </ol>
          <p>时间复杂度：平均O(nlogn)，最坏O(n²)（有序数组）</p>
          <p>空间复杂度：O(logn)（递归栈）</p>
        `
      },
      {
        id: 3,
        title: '二叉树的遍历方式',
        content: `
          <p>二叉树核心遍历方式：</p>
          <ul>
            <li>前序遍历：根 → 左 → 右</li>
            <li>中序遍历：左 → 根 → 右（二叉搜索树可得到有序序列）</li>
            <li>后序遍历：左 → 右 → 根</li>
            <li>层序遍历：按层次从上到下、从左到右</li>
          </ul>
        `
      }
    ],
    codeCases: [
      {
        id: 1,
        title: '单链表反转（Java实现）',
        level: '中等',
        description: '实现单链表的反转，要求空间复杂度O(1)，时间复杂度O(n)',
        code: `
// 定义链表节点
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

// 反转链表核心方法
public class ReverseList {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null; // 前驱节点
        ListNode curr = head; // 当前节点
        while (curr != null) {
            ListNode nextTemp = curr.next; // 保存后继节点
            curr.next = prev; // 反转指针
            prev = curr;      // 前驱节点后移
            curr = nextTemp;  // 当前节点后移
        }
        return prev; // 新的头节点
    }
    
    // 测试
    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        ReverseList solution = new ReverseList();
        ListNode newHead = solution.reverseList(head);
        // 输出：3 → 2 → 1
        while (newHead != null) {
            System.out.print(newHead.val + " → ");
            newHead = newHead.next;
        }
    }
}
        `,
        analysis: '核心思路是通过三个指针（prev、curr、nextTemp）完成反转：1. 保存当前节点的后继节点，避免断链；2. 将当前节点的next指向前驱节点；3. 前驱和当前节点后移，直到遍历完成。该方法是原地反转，空间复杂度O(1)，时间复杂度O(n)，是最优解法。'
      },
      {
        id: 2,
        title: '二分查找（Python实现）',
        level: '简单',
        description: '有序数组中查找目标值，时间复杂度O(logn)',
        code: `
def binary_search(nums, target):
    left = 0
    right = len(nums) - 1
    while left <= right:
        mid = (left + right) // 2  # 防止溢出可写：left + (right - left) // 2
        if nums[mid] == target:
            return mid  # 找到目标值，返回索引
        elif nums[mid] < target:
            left = mid + 1  # 目标值在右半区
        else:
            right = mid - 1 # 目标值在左半区
    return -1  # 未找到

# 测试
nums = [1,3,5,7,9,11]
target = 7
print(binary_search(nums, target)) # 输出：3
        `,
        analysis: '二分查找的前提是数组有序，核心是不断缩小查找范围：1. 计算中间索引mid；2. 比较mid值与目标值，确定查找区间；3. 直到找到目标或区间为空。注意边界条件（left <= right），否则会遗漏最后一个元素。'
      }
    ],
    wrongQuestions: [
      {
        id: 1,
        question: '以下关于单链表和数组的说法，错误的是？',
        options: [
          'A. 数组随机访问效率O(1)，单链表O(n)',
          'B. 数组插入删除效率O(n)，单链表O(1)',
          'C. 数组需要连续内存，单链表不需要',
          'D. 单链表的空间利用率一定高于数组'
        ],
        correctAnswer: 'D',
        errorRate: '68%',
        errorReason: '错误原因：单链表每个节点除了存储数据，还需要存储指针，当数据量较小时，指针的额外开销会导致空间利用率低于数组；只有当数据量较大且频繁插入删除时，单链表的空间灵活性才体现优势。',
        summary: '核心知识点：数组和链表的时空复杂度对比，需结合场景分析，而非绝对判断。'
      },
      {
        id: 2,
        question: '快速排序的最坏时间复杂度是？',
        options: [
          'A. O(n)',
          'B. O(nlogn)',
          'C. O(n²)',
          'D. O(logn)'
        ],
        correctAnswer: 'C',
        errorRate: '45%',
        errorReason: '错误原因：多数同学误以为快速排序时间复杂度都是O(nlogn)，但当数组已有序（如升序/降序），且选择第一个/最后一个元素作为基准时，分区会变成n-1和0个元素，递归深度n，时间复杂度退化为O(n²)。优化方式：随机选择基准、三数取中法。',
        summary: '核心知识点：快速排序的时间复杂度与基准选择相关，需掌握最坏情况的成因和优化方法。'
      }
    ]
  },
  // 计算机组成原理
  computerOrg: {
    name: '计算机组成原理',
    knowledge: [
      {
        id: 1,
        title: '冯·诺依曼体系结构',
        content: `
          <p>冯·诺依曼体系核心特点：</p>
          <ol>
            <li>存储程序：程序和数据以二进制形式存储在存储器中</li>
            <li>五大部件：运算器、控制器、存储器、输入设备、输出设备</li>
            <li>指令执行：取指 → 译码 → 执行 → 访存 → 写回</li>
          </ol>
        `
      },
      {
        id: 2,
        title: '中断的原理与作用',
        content: `
          <p>中断是CPU响应外部事件的机制：</p>
          <ul>
            <li>作用：解决CPU与外设速度不匹配问题，实现并行处理</li>
            <li>类型：硬中断（外设触发）、软中断（指令触发，如系统调用）</li>
            <li>处理流程：中断请求 → 中断响应 → 保护现场 → 执行中断服务程序 → 恢复现场 → 中断返回</li>
          </ul>
        `
      }
    ],
    codeCases: [
      {
        id: 1,
        title: '简单ALU运算模拟（C语言）',
        level: '中等',
        description: '模拟算术逻辑单元（ALU）的加减运算',
        code: `
#include <stdio.h>

// ALU模拟：支持加法和减法
int alu(int a, int b, char op) {
    switch(op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        default:
            printf("不支持的操作符\\n");
            return -1;
    }
}

int main() {
    int num1 = 10, num2 = 5;
    printf("10 + 5 = %d\\n", alu(num1, num2, '+')); // 输出15
    printf("10 - 5 = %d\\n", alu(num1, num2, '-')); // 输出5
    return 0;
}
        `,
        analysis: 'ALU是运算器核心，负责算术和逻辑运算。该代码模拟了ALU的基本功能，实际硬件中ALU由门电路实现，通过控制信号选择运算类型，输出结果和标志位（如进位、零标志）。'
      }
    ],
    wrongQuestions: [
      {
        id: 1,
        question: '冯·诺依曼体系的核心思想是？',
        options: [
          'A. 采用二进制',
          'B. 存储程序',
          'C. 五大部件分离',
          'D. 并行处理'
        ],
        correctAnswer: 'B',
        errorRate: '52%',
        errorReason: '错误原因：多数同学混淆了“二进制”和“存储程序”，二进制是冯·诺依曼体系的表现形式，而“存储程序”（程序和数据统一存储在存储器中，CPU按地址执行指令）是其核心思想，也是区别于早期计算机的关键。',
        summary: '核心知识点：冯·诺依曼体系的核心是存储程序，二进制、五大部件是实现该思想的基础。'
      }
    ]
  },
  // 操作系统
  os: {
    name: '操作系统',
    knowledge: [
      {
        id: 1,
        title: '进程与线程的区别',
        content: `
          <p>进程是资源分配的基本单位，线程是调度的基本单位：</p>
          <table border="1" cellpadding="8" cellspacing="0">
            <tr>
              <th>维度</th>
              <th>进程</th>
              <th>线程</th>
            </tr>
            <tr>
              <td>资源分配</td>
              <td>拥有独立地址空间、文件描述符等</td>
              <td>共享进程资源</td>
            </tr>
            <tr>
              <td>调度切换</td>
              <td>开销大（切换地址空间）</td>
              <td>开销小（仅切换寄存器）</td>
            </tr>
            <tr>
              <td>并发性</td>
              <td>进程间并发</td>
              <td>线程间并发（更高效）</td>
            </tr>
          </table>
        `
      },
      {
        id: 2,
        title: '页面置换算法（FIFO）',
        content: `
          <p>FIFO（先进先出）置换算法：</p>
          <ol>
            <li>原理：按照页面调入内存的顺序，淘汰最先调入的页面</li>
            <li>实现：用队列记录页面调入顺序</li>
            <li>缺点：Belady异常（增加帧数，缺页率反而升高）</li>
          </ol>
        `
      }
    ],
    codeCases: [
      {
        id: 1,
        title: 'FIFO页面置换算法模拟（Python）',
        level: '较难',
        description: '模拟操作系统FIFO页面置换，计算缺页次数',
        code: `
def fifo_page_replacement(pages, frame_num):
    frames = []  # 内存帧
    page_fault = 0  # 缺页次数
    for page in pages:
        if page not in frames:
            page_fault += 1
            if len(frames) < frame_num:
                frames.append(page)
            else:
                frames.pop(0)  # 淘汰最先进入的页面
                frames.append(page)
        print(f"页面{page} → 内存帧：{frames}")
    return page_fault

# 测试
pages = [1,2,3,4,1,2,5,1,2,3,4,5]
frame_num = 3
faults = fifo_page_replacement(pages, frame_num)
print(f"总缺页次数：{faults}") # 输出：9
        `,
        analysis: 'FIFO置换算法是最基础的页面置换算法，核心是维护一个队列记录页面调入顺序。该代码模拟了算法执行过程，缺页时若内存未满则直接调入，满则淘汰队首页面。Belady异常是FIFO的典型问题，比如该案例中帧数从3增加到4，缺页次数反而从9变成10。'
      }
    ],
    wrongQuestions: [
      {
        id: 1,
        question: '以下关于进程和线程的说法，正确的是？',
        options: [
          'A. 线程是资源分配的基本单位',
          'B. 进程切换开销小于线程',
          'C. 线程共享进程的地址空间',
          'D. 一个进程只能有一个线程'
        ],
        correctAnswer: 'C',
        errorRate: '65%',
        errorReason: '错误原因：核心混淆点是“资源分配”和“调度”的主体——进程是资源分配基本单位，线程是调度基本单位；线程切换仅需保存寄存器状态，开销远小于进程（需切换地址空间）；一个进程可包含多个线程（如多线程程序）。',
        summary: '核心知识点：进程和线程的核心区别在于资源分配和调度，需牢记“进程管资源，线程管执行”。'
      }
    ]
  },
  // 计算机网络
  network: {
    name: '计算机网络',
    knowledge: [
      {
        id: 1,
        title: 'TCP三次握手原理',
        content: `
          <p>TCP三次握手建立连接：</p>
          <ol>
            <li>第一次：客户端 → 服务端，发送SYN包（同步序列号），客户端进入SYN_SENT状态</li>
            <li>第二次：服务端 → 客户端，发送SYN+ACK包，服务端进入SYN_RCVD状态</li>
            <li>第三次：客户端 → 服务端，发送ACK包，双方进入ESTABLISHED状态</li>
          </ol>
          <p>目的：确保双方收发能力正常，避免无效连接。</p>
        `
      }
    ],
    codeCases: [
      {
        id: 1,
        title: '简单TCP客户端（Python）',
        level: '中等',
        description: '模拟TCP客户端与服务端建立连接并发送数据',
        code: `
import socket

# 创建TCP客户端
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# 连接服务端（本地测试）
client_socket.connect(('127.0.0.1', 8080))
# 发送数据
client_socket.send(b'Hello Server!')
# 接收响应
response = client_socket.recv(1024)
print(f"服务端响应：{response.decode()}")
# 关闭连接
client_socket.close()
        `,
        analysis: '该代码模拟TCP客户端的核心流程：创建套接字→连接服务端→发送数据→接收响应→关闭连接。TCP套接字（SOCK_STREAM）保证可靠传输，底层通过三次握手建立连接，四次挥手关闭连接。'
      }
    ],
    wrongQuestions: [
      {
        id: 1,
        question: 'TCP三次握手的第三次握手的作用是？',
        options: [
          'A. 客户端确认服务端的SYN包',
          'B. 服务端确认客户端的SYN包',
          'C. 客户端确认服务端的ACK包',
          'D. 服务端确认客户端的ACK包'
        ],
        correctAnswer: 'A',
        errorRate: '70%',
        errorReason: '错误原因：多数同学混淆了三次握手的报文类型——第二次握手服务端发送SYN+ACK（SYN响应客户端，ACK确认客户端的SYN），第三次握手客户端发送ACK，目的是确认服务端的SYN包，确保服务端能收到客户端的响应，避免服务端一直等待。',
        summary: '核心知识点：三次握手的每一步都有明确目的，第三次握手是客户端对服务端SYN的确认，保证双向通信正常。'
      }
    ]
  }
}

// 3. 筛选知识点（搜索功能）
const filteredKnowledge = computed(() => {
  if (!searchKeyword.value) {
    return courseConfig[selectedCourse.value].knowledge
  }
  return courseConfig[selectedCourse.value].knowledge.filter(item => 
    item.title.includes(searchKeyword.value) || item.content.includes(searchKeyword.value)
  )
})

// 4. 辅助方法：切换课程时重置选中状态
const resetModule = () => {
  selectedKnowledge.value = null
  selectedCode.value = null
  selectedWrongQuestion.value = null
  searchKeyword.value = ''
}

// 5. 辅助方法：选中知识点/代码/错题
const selectKnowledge = (item) => {
  selectedKnowledge.value = item
}
const selectCode = (item) => {
  selectedCode.value = item
}
const selectWrongQuestion = (item) => {
  selectedWrongQuestion.value = item
}
</script>

<style scoped>
/* 全局样式：毕设级专业风格 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: "Microsoft YaHei", "Segoe UI", Arial, sans-serif;
  color: #333;
}

/* 顶部导航 */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e6ed;
}
.app-header h1 {
  color: #2563eb;
  font-size: 2rem;
}
.course-select {
  display: flex;
  align-items: center;
  gap: 10px;
}
.course-select select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

/* 标签页导航 */
.tab-nav {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e6ed;
}
.tab-btn {
  padding: 12px 24px;
  background-color: #fff;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.tab-btn.active {
  border-bottom-color: #2563eb;
  color: #2563eb;
  font-weight: 600;
}
.tab-btn:hover:not(.active) {
  color: #2563eb;
  background-color: #f0f7ff;
}

/* 内容卡片 */
.content-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.module-content h3 {
  color: #1e40af;
  margin-bottom: 20px;
  font-size: 1.3rem;
  border-left: 4px solid #2563eb;
  padding-left: 10px;
}

/* 搜索框 */
.search-box {
  margin-bottom: 20px;
}
.search-box input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
}
.search-box input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* 知识点列表 */
.knowledge-list, .code-list, .wrong-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}
.knowledge-item, .code-item, .wrong-item {
  padding: 20px;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.knowledge-item:hover, .code-item:hover, .wrong-item:hover {
  border-color: #2563eb;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  transform: translateY(-2px);
}
.knowledge-item h4, .code-item h4, .wrong-item h4 {
  color: #1e40af;
  margin-bottom: 10px;
}
.preview {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
}
.empty-tip {
  text-align: center;
  color: #94a3b8;
  padding: 30px 0;
  grid-column: 1 / -1;
}

/* 知识点详情 */
.knowledge-detail, .code-detail, .wrong-detail {
  padding: 20px;
  border-top: 1px solid #e0e6ed;
  margin-top: 20px;
}
.knowledge-detail h4, .code-detail h4, .wrong-detail h4 {
  color: #1e40af;
  margin-bottom: 15px;
  font-size: 1.2rem;
}
.detail-content {
  line-height: 1.8;
  color: #334155;
}
.detail-content ol, .detail-content ul {
  margin-left: 20px;
  margin-bottom: 10px;
}
.detail-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}
.detail-content table th, .detail-content table td {
  padding: 10px;
  border: 1px solid #e0e6ed;
}

/* 代码详情 */
.code-desc {
  color: #64748b;
  margin-bottom: 15px;
  line-height: 1.5;
}
.code-block {
  background-color: #1e293b;
  color: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: "Consolas", "Monaco", monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
}
.code-analysis h5, .wrong-detail h5 {
  color: #1e40af;
  margin: 10px 0 5px 0;
  font-size: 1rem;
}
.code-analysis p {
  line-height: 1.8;
  color: #334155;
}

/* 错题详情 */
.wrong-option ul {
  margin-left: 20px;
  margin-bottom: 15px;
  line-height: 1.8;
}
.wrong-answer, .wrong-reason, .wrong-summary {
  margin-bottom: 15px;
  line-height: 1.8;
  color: #334155;
}
.wrong-answer h5 + p, .wrong-reason h5 + p, .wrong-summary h5 + p {
  margin-top: 5px;
}
</style>