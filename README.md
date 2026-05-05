# MedAI Pro - 医学科研AI平台

基于 Next.js 14 + Tailwind CSS + Prisma + OpenAI 构建的医学科研AI辅助平台。

## 功能模块

- **假说图生成** — 输入研究假说，AI生成科学机制图（gpt-image-2, 4K）
- **技术路线图** — 输入研究内容，AI生成研究路线图（gpt-image-2, 4K竖版）
- **自定义出图** — 用户自定义提示词生成图片，支持保存/复用
- **扩展工具** — 10个科研工具（科研绘图、统计分析、论文辅助等）
- **会员系统** — 微信扫码登录 + 会员订阅 + 额度管理
- **后台管理** — 提示词/Skill管理、统计分析、会员管理、订单管理

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14 (App Router) + Tailwind CSS |
| 后端 | Next.js API Routes + Prisma ORM |
| 数据库 | PostgreSQL 14+ |
| 认证 | WeChat OAuth + JWT (jose) |
| 文本AI | GPT-4o (kuaipao.ai) |
| 图片AI | gpt-image-2 (kuaipao.ai) |
| 状态管理 | Zustand |
| 图表 | Recharts |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入实际值

# 3. 初始化数据库
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# 4. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

## 环境变量

参见 `.env.local.example`，主要配置项：

- `DATABASE_URL` — PostgreSQL 连接串
- `WECHAT_APP_ID` / `WECHAT_APP_SECRET` — 微信开放平台
- `OPENAI_API_KEY` — kuaipao.ai API Key
- `OPENAI_BASE_URL` — https://kuaipao.ai/v1
- `DALL_E_MODEL` — gpt-image-2

## 部署

详见 `docs/部署与对接完整指南.md`

## License

MIT
