# 更新日志

本文档记录了 dingtalk-notify-cli 项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- 无

### 变更
- 无

### 修复
- 无

### 移除
- 无

## [1.0.0] - 2024-01-15

### 新增
- 🎉 初始版本发布
- ✨ 支持通过命令行向钉钉群机器人发送消息
- 📝 支持文本消息发送
- ⚙️ 支持配置文件管理（JSON格式）
- 🔍 智能配置文件查找（当前目录及父目录）
- 📊 完整的日志记录功能
- 🛠️ 提供 Node.js 模块接口
- 📚 完整的文档和使用示例

### 功能特性
- **命令行工具**：全局安装后可直接使用 `dingtalk-notify` 命令
- **配置管理**：支持 `dingtalk-notify.json` 配置文件
- **文本消息**：支持发送纯文本消息（支持 @所有人 和 @指定用户）
- **日志功能**：自动记录发送历史到 `dingtalk-notify.log`
- **错误处理**：完善的错误提示和异常处理
- **模块化设计**：可作为 Node.js 模块在其他项目中使用

### 技术实现
- 基于 `commander.js` 的命令行界面
- 使用 `dingtalk-robot-sender` 处理钉钉 API 通信
- 采用 `find-config` 实现配置文件智能查找
- 模块化架构，易于扩展和维护

### 文件结构
```
dingtalk-notify-cli/
├── bin/
│   └── cli.js              # 命令行入口
├── lib/
│   ├── config.js           # 配置管理
│   ├── logger.js           # 日志功能
│   └── sendMessage.js      # 消息发送核心逻辑
├── index.js                # 模块主入口
├── package.json            # 项目配置
├── README.md               # 项目文档
├── LICENSE                 # MIT 许可证
├── CHANGELOG.md            # 更新日志
├── .gitignore              # Git 忽略文件
├── .npmignore              # NPM 发布忽略文件
├── dingtalk-notify.example.json  # 配置文件示例
└── TEST_GUIDE.md           # 测试指南
```

---

## 版本说明

- **[未发布]** - 开发中的功能
- **[1.0.0]** - 2024-01-15 - 初始稳定版本

## 贡献指南

如果您想为此项目做出贡献，请：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。