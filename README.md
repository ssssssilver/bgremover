# 🎨 RemoveBG Mini

> 移除图片背景工具 - 纯前端实现，保护隐私

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange.svg)

## 功能特性

- ✅ 拖拽上传图片
- ✅ 一键移除背景
- ✅ 透明图预览对比
- ✅ 一键下载结果
- 🔒 纯前端处理，图片不经过服务器
- 📱 响应式设计，支持移动端

## 技术栈

- React 18 + Vite
- Tailwind CSS
- remove.bg API

## 本地开发

```bash
# 克隆项目
git clone https://github.com/ssssssilver/bgremover.git
cd bgremover

# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env
# 编辑 .env，填入你的 remove.bg API Key

# 启动开发服务器
npm run dev
```

## 获取 API Key

1. 访问 [remove.bg API](https://www.remove.bg/api) 注册
2. 免费额度：50张/月
3. 在 `.env` 文件中设置 `VITE_REMOVEBG_API_KEY`

## 构建部署

```bash
# 构建生产版本
npm run build

# 部署到 Cloudflare Pages
# 1. Push 到 GitHub
# 2. 在 Cloudflare Dashboard 连接 GitHub 仓库
# 3. 设置构建命令: npm run build
# 4. 设置输出目录: dist
# 5. 添加环境变量: VITE_REMOVEBG_API_KEY
```

## 项目结构

```
bgremover/
├── src/
│   ├── App.jsx      # 主组件
│   ├── main.jsx     # 入口文件
│   └── index.css    # 全局样式
├── public/
├── .env.example     # 环境变量示例
├── tailwind.config.js
└── vite.config.js
```

## License

MIT
