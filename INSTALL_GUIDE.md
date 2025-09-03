# Prompt Optimizer 安装和运行手册

## 📋 目录
- [系统要求](#系统要求)
- [安装步骤](#安装步骤)
- [配置Ollama模型](#配置ollama模型)
- [启动和运行](#启动和运行)
- [常见问题](#常见问题)
- [功能介绍](#功能介绍)

---

## 🖥️ 系统要求

### 基础环境
- **操作系统**: Linux、macOS 或 Windows
- **Node.js**: 版本 18.0+ 或 20.0+ (推荐 20.x)
- **内存**: 至少 4GB RAM
- **存储**: 至少 2GB 可用空间

### 必需工具
- **Git**: 用于克隆项目
- **pnpm**: 包管理工具 (版本 10+)

---

## 🚀 安装步骤

### 1. 安装 Node.js 和 pnpm

#### 方法一：使用 fnm (推荐)
```bash
# 安装 fnm (Node.js 版本管理器)
curl -fsSL https://fnm.vercel.app/install | bash

# 重新加载终端配置
source ~/.bashrc

# 安装 Node.js 20
fnm install 20
fnm use 20

# 安装 pnpm
npm install -g pnpm
```

#### 方法二：直接安装
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
npm install -g pnpm
```

### 2. 克隆项目
```bash
git clone https://github.com/linshenkx/prompt-optimizer.git
cd prompt-optimizer
```

### 3. 安装依赖
```bash
# 安装项目依赖
pnpm install
```

### 4. 启动本地代理服务器
```bash
# 在新终端窗口中启动代理服务器
cd /path/to/prompt-optimizer/node-proxy
node server.js

# 保持此终端运行，代理服务器监听在 127.0.0.1:3001
```

### 5. 启动开发服务器
```bash
# 在主项目目录中启动开发服务器
cd /path/to/prompt-optimizer
pnpm dev

# 服务器将在 http://localhost:18181 或 http://localhost:18182 启动
```

---

## 🤖 配置Ollama模型

### 前提条件
确保你的 Ollama 服务正在运行，并且可以从当前机器访问。

### 配置步骤

1. **打开应用**
   - 在浏览器中访问 `http://localhost:18181` 或 `http://localhost:18182`

2. **打开模型管理器**
   - 点击右上角的 ⚙️ (模型管理) 按钮

3. **添加新模型**
   - 点击 "添加" 按钮
   - 填写以下信息：
     ```
     显示名称: Local Ollama
     API地址: http://192.168.100.242:11434/v1  (替换为你的Ollama服务器IP)
     API密钥: dummy-key  (任意值，Ollama不验证密钥)
     ```

4. **启用代理 (重要！)**
   - ✅ 勾选 "使用Vercel代理" 选项
   - 这是解决跨域问题的关键步骤

5. **获取模型列表**
   - 点击 "获取模型列表" 按钮
   - 系统会显示可用的模型

6. **选择模型**
   - 从下拉列表中选择一个模型，例如：
     - `qwen3:4b-instruct-2507-q8_0` (推荐)
     - `gemma3:4b`
     - 或其他已安装的模型

7. **保存配置**
   - 点击 "保存" 按钮完成配置

---

## 🎯 启动和运行

### 完整启动流程

1. **启动代理服务器**
   ```bash
   # 终端1: 启动代理服务器
   cd /path/to/prompt-optimizer/node-proxy
   node server.js
   ```

2. **启动开发服务器**
   ```bash
   # 终端2: 启动主应用
   cd /path/to/prompt-optimizer
   pnpm dev
   ```

3. **访问应用**
   - 打开浏览器访问显示的地址 (通常是 `http://localhost:18181` 或 `http://localhost:18182`)

### 验证安装

1. **测试代理状态**
   ```bash
   curl -s http://localhost:18182/api/vercel-status
   # 应该返回: {"status":"available","environment":"development","proxySupport":true,"version":"1.0.0"}
   ```

2. **测试Ollama连接**
   ```bash
   curl -s http://192.168.100.242:11434/api/tags
   # 应该返回模型列表JSON
   ```

---

## 🔧 常见问题

### Q1: 端口被占用
**问题**: `Port 18181 is in use`
**解决**: 应用会自动使用下一个可用端口，如 18182

### Q2: 代理服务器启动失败
**问题**: `Error: listen EADDRINUSE :::3001`
**解决**: 
```bash
# 杀死占用端口的进程
pkill -f "node.*server.js"
# 或使用不同端口
PORT=3002 node server.js
```

### Q3: 无法获取模型列表
**问题**: 显示 "跨域连接失败"
**解决**: 
1. 确认已勾选 "使用Vercel代理"
2. 确认代理服务器正在运行
3. 确认Ollama服务器地址正确

### Q4: Ollama服务器连接问题
**解决**: 在Ollama服务器上设置CORS:
```bash
export OLLAMA_ORIGINS="*"
export OLLAMA_HOST="0.0.0.0:11434"
ollama serve
```

---

## 🎨 功能介绍

### 主界面布局

```
┌─────────────────────────────────────────────────────────────┐
│                        顶部导航栏                            │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│      原始提示词       │         测试内容                     │
│    (左侧输入区域)     │       (右侧输入区域)                 │
│                      │                                      │
├──────────────────────┼──────────────────────────────────────┤
│                      │                                      │
│    优化后提示词       │       对比测试结果                   │
│    (左侧结果区域)     │       (右侧结果区域)                 │
│                      │                                      │
└──────────────────────┴──────────────────────────────────────┘
```

### 使用流程

1. **输入原始提示词** (左上角)
   - 在文本框中输入你想优化的提示词
   - 例如: "帮我总结这篇文章"

2. **选择优化模式**
   - **系统提示词优化**: 优化AI的角色设定
   - **用户提示词优化**: 优化用户的提问方式

3. **点击优化** 
   - 系统会生成改进后的提示词 (左下角显示)

4. **输入测试内容** (右上角)
   - 输入要处理的具体内容进行测试

5. **对比效果** 
   - 点击 "开始对比" 查看优化前后的效果差异

### 实际应用示例

**原始提示词**:
```
帮我总结这篇文章
```

**优化后提示词**:
```
请作为专业文本分析师，仔细阅读以下文章内容，提供一个结构化的总结，包括：
1. 主要观点和核心论据
2. 关键数据和重要信息
3. 实用建议或行动要点
总结应简洁明了，字数控制在300字以内，突出文章的核心价值。
```

---

## 🎉 完成安装

恭喜！你已经成功安装并配置了 Prompt Optimizer。现在你可以：

1. ✅ 使用本地Ollama模型进行提示词优化
2. ✅ 对比优化前后的效果
3. ✅ 提升AI对话的质量和准确性

### 下一步建议

- 尝试不同类型的提示词优化
- 测试不同的AI模型效果
- 查看历史记录和模板功能
- 探索高级参数配置

---

## 📞 获取帮助

如果遇到问题，可以：
- 查看项目的 [GitHub Issues](https://github.com/linshenkx/prompt-optimizer/issues)
- 参考 [开发文档](dev.md)
- 检查 [常见问题解答](README.md#常见问题)

**祝你使用愉快！🚀**