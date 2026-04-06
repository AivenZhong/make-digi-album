# AI电子学习单 - 制作数字相册

信息科技 三年级上册 第四单元 第13课

## 功能介绍

一个网页版的AI电子学习单，用于信息课课堂教学，包含以下模块：

1. **欢迎页** - 学生输入姓名和班级
2. **活动一** - 传统相册 vs 数字相册交互对比
3. **活动二** - 认识剪映软件，理解数字相册本质
4. **活动三** - 拖拽排序游戏 + 制作指南
5. **课堂小测试** - 5道选择题
6. **自我评价** - 5项星级评价
7. **AI评语** - 根据课堂表现生成个性化鼓励评语

## 部署方式一：Vercel（推荐，免费永久在线）

最简单的方式，不需要懂技术，5分钟搞定：

### 第一步：注册 Vercel

1. 打开 https://vercel.com ，用微信扫码或邮箱注册
2. 注册是免费的

### 第二步：导入项目

1. 登录 Vercel 后，点击 **"Add New" → "Project"**
2. 如果你的代码在 GitHub 上，选择 GitHub 导入
3. 如果没有 GitHub，可以选择 **上传本地文件夹**：
   - 点击 "Browse" 选择本项目文件夹
   - Vercel 会自动识别 Next.js 项目

### 第三步：配置环境变量（可选）

在部署页面的 "Environment Variables" 中添加（不配置也能用）：

```
OPENAI_API_KEY = 你的API密钥
OPENAI_BASE_URL = https://api.deepseek.com/v1
OPENAI_MODEL = deepseek-chat
```

### 第四步：点击 Deploy

等待1-2分钟，部署完成！你会得到一个永久链接，如：
`https://你的项目名.vercel.app`

把这个链接发给学生就可以用了！

---

## 部署方式二：本地电脑运行

### 环境准备

1. 安装 Node.js：https://nodejs.org/ （选LTS版本）
2. 安装 Bun：打开终端执行 `npm install -g bun`

### 运行项目

```bash
# 1. 进入项目文件夹
cd 你的项目文件夹路径

# 2. 安装依赖
bun install

# 3. 启动项目
bun run dev
```

打开浏览器访问 `http://localhost:3000`

---

## AI评语功能说明

本项目支持三种评语生成方式（自动按优先级选择）：

| 方式 | 说明 | 需要配置 |
|------|------|---------|
| z-ai-web-dev-sdk | 沙盒环境自动可用 | 不需要 |
| OpenAI兼容API | 支持DeepSeek、通义千问等 | 需要 API Key |
| 本地模板 | 内置多条评语模板，随机组合 | 不需要 |

**即使不配置任何API，AI评语功能也能正常使用**（使用内置模板）。

### 推荐的免费/低价 AI 服务

| 服务 | 免费额度 | 配置方法 |
|------|---------|---------|
| DeepSeek | 新用户送额度，之后约0.001元/条 | OPENAI_BASE_URL=https://api.deepseek.com/v1 |
| 硅基流动 SiliconFlow | 每天有免费调用次数 | OPENAI_BASE_URL=https://api.siliconflow.cn/v1 |

---

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- shadcn/ui 组件库
- Framer Motion 动画
- dnd-kit 拖拽排序
- Zustand 状态管理

## 目录结构

```
src/
├── app/
│   ├── api/ai-comment/    # AI评语接口
│   ├── layout.tsx
│   ├── page.tsx           # 主页面
│   └── globals.css
├── components/
│   ├── learning/          # 学习单各页面组件
│   │   ├── WelcomePage.tsx
│   │   ├── ActivityOne.tsx
│   │   ├── ActivityTwo.tsx
│   │   ├── ActivityThree.tsx
│   │   ├── Quiz.tsx
│   │   ├── SelfEvaluation.tsx
│   │   ├── AIComment.tsx
│   │   └── StepNav.tsx
│   └── ui/                # shadcn/ui 组件
└── lib/
    ├── store.ts           # Zustand状态管理
    └── utils.ts
```
