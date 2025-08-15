# 钉钉通知 CLI 工具

一个简单易用的命令行工具，用于向钉钉群机器人发送消息通知。

## 特性

- 🚀 简单易用的命令行界面
- 📝 支持文本和 Markdown 格式消息
- ⚙️ 灵活的配置文件支持
- 📊 完整的日志记录功能
- 🔒 支持加签安全验证
- 🕒 可选的时间戳和来源标识

## 安装

### 全局安装（推荐）

从 npm 仓库安装：

```bash
# 全局安装
npm install -g dingtalk-notify-cli

# 验证安装
dingtalk-notify --version
```

从 GitHub 源码安装：

```bash
# 克隆仓库
git clone https://github.com/linzowo/dingtalk-notify-cli.git
cd dingtalk-notify-cli

# 安装依赖
npm install

# 全局链接
npm link
```

### 本地项目安装

```bash
npm install dingtalk-notify-cli
```

### 验证安装

```bash
# 查看版本
dingtalk-notify --version

# 查看帮助
dingtalk-notify --help
```

## 快速开始

### 1. 创建钉钉机器人

1. 在钉钉群中添加「自定义机器人」
2. 获取 Webhook 地址中的 `access_token`
3. 如需要，可以设置加签密钥

### 2. 初始化配置

使用 `init` 命令快速创建配置文件：

```bash
# 创建默认配置文件
dingtalk-notify init

# 强制覆盖已存在的配置文件
dingtalk-notify init --force
```

或者手动在项目根目录创建 `dingtalk-notify.json` 配置文件：

```json
{
  "msgType": "text",
  "title": "系统通知",
  "addTimestamp": true,
  "addSource": true,
  "dingtalk": {
    "accessToken": "your_access_token_here",
    "secret": "your_secret_here"
  }
}
```

### 3. 发送消息

```bash
# 发送简单文本消息
dingtalk-notify "Hello, World!"

# 发送带标题的消息
dingtalk-notify "部署完成" --title "系统通知"

# 发送 Markdown 消息
dingtalk-notify "**重要通知**\n\n系统将于今晚维护" --type markdown
```

## 命令行选项

### 发送消息

```bash
dingtalk-notify <message>
```

**参数：**
- `<message>` - 要发送的消息内容（必需）

### 初始化配置

```bash
dingtalk-notify init [options]
```

**选项：**
- `-f, --force` - 强制覆盖已存在的配置文件

### 查看日志

```bash
dingtalk-notify logs [count]
```

**参数：**
- `[count]` - 显示的日志条数，不指定则显示全部日志

### 全局选项

- `-h, --help` - 显示帮助信息
- `-v, --version` - 显示版本号

## 配置文件

配置文件支持以下选项：

```json
{
  "msgType": "text",           // 消息类型：text 或 markdown
  "title": "系统通知",          // 默认消息标题
  "addTimestamp": true,        // 是否添加时间戳
  "addSource": true,           // 是否添加来源信息
  "logMaxLines": 1000,         // 日志文件最大行数
  "dingtalk": {
    "accessToken": "...",      // 钉钉机器人 access token（必需）
    "secret": "..."            // 钉钉机器人加签密钥（可选）
  }
}
```

### 配置文件查找顺序

工具会按以下顺序查找配置文件：

1. 命令行指定的配置文件路径
2. 当前目录的 `dingtalk-notify.json`
3. 用户主目录的 `.dingtalk-notify.json`
4. 全局配置目录的 `dingtalk-notify.json`

## 使用示例

### 初始化和配置

```bash
# 创建配置文件
dingtalk-notify init

# 编辑配置文件，设置 accessToken 和 secret
# 然后测试发送消息
dingtalk-notify "配置测试消息"
```

### 基本消息发送

```bash
# 发送简单消息
dingtalk-notify "服务器重启完成"

# 发送系统通知
dingtalk-notify "数据库备份已完成"
```

### 日志管理

```bash
# 查看所有发送日志
dingtalk-notify logs

# 查看最新 10 条日志
dingtalk-notify logs 10

# 查看最新 5 条日志
dingtalk-notify logs 5
```

### 在脚本中使用

```bash
#!/bin/bash

# 部署脚本
echo "开始部署..."
dingtalk-notify "开始部署应用" --title "部署通知"

# 执行部署命令
if npm run build && npm run deploy; then
    dingtalk-notify "✅ 部署成功" --title "部署完成"
else
    dingtalk-notify "❌ 部署失败，请检查日志" --title "部署失败"
    exit 1
fi
```

### 在 CI/CD 中使用

```yaml
# GitHub Actions 示例
- name: 通知部署开始
  run: dingtalk-notify "开始部署到生产环境" --title "CI/CD 通知"

- name: 部署应用
  run: npm run deploy

- name: 通知部署结果
  if: always()
  run: |
    if [ ${{ job.status }} == 'success' ]; then
      dingtalk-notify "✅ 生产环境部署成功" --title "部署完成"
    else
      dingtalk-notify "❌ 生产环境部署失败" --title "部署失败"
    fi
```

## 日志功能

工具会自动记录所有发送的消息到 `dingtalk-notify.log` 文件中，包括：

- 发送时间
- 消息内容
- 发送状态（成功/失败）
- 钉钉 API 响应信息

日志文件会自动轮转，当超过配置的最大行数时，会保留最新的日志记录。

## 作为 Node.js 模块使用

```javascript
const sendMessage = require('dingtalk-notify-cli');

// 发送消息
try {
  const result = await sendMessage('Hello from Node.js!');
  console.log('消息发送成功:', result);
} catch (error) {
  console.error('消息发送失败:', error.message);
}
```

## 故障排除

### 常见问题

**1. "消息发送失败: Lack for arguments!"**

- 检查配置文件中的 `accessToken` 是否正确设置
- 确保配置文件格式正确

**2. "钉钉API返回错误: 310000"**

- 检查 `accessToken` 是否有效
- 确认机器人是否被正确添加到群中

**3. "sign not match"**

- 检查加签密钥 `secret` 是否正确
- 确认时间同步是否正常

**4. 配置文件找不到**

- 使用 `-c` 选项指定配置文件路径
- 检查配置文件是否存在且格式正确

### 调试模式

查看详细的日志信息：

```bash
# 查看最近的日志
tail -f dingtalk-notify.log

# 查看完整日志
cat dingtalk-notify.log
```

## 开发

### 本地开发

```bash
# 克隆项目
git clone https://github.com/linzowo/dingtalk-notify-cli.git
cd dingtalk-notify-cli

# 安装依赖
npm install

# 本地测试
node bin/cli.js --help

# 全局链接（用于本地测试）
npm link
```

### 发布到 npm

```bash
# 更新版本号
npm version patch  # 或 minor, major

# 发布到 npm
npm publish
```

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 作者

**linzowo** - [GitHub](https://github.com/linzowo)

- 📧 Email: linzowo@outlook.com
- 🐛 Issues: [GitHub Issues](https://github.com/linzowo/dingtalk-notify-cli/issues)

## 更新日志

### v1.0.0

- ✨ 初始版本发布
- 🚀 支持基本消息发送功能
- ⚙️ 配置文件初始化命令
- 📊 日志查看功能
- 🔒 支持加签安全验证

---

如果这个工具对你有帮助，请给个 ⭐️ Star 支持一下！
npm install

# 本地测试
node bin/cli.js "测试消息"
```

### 测试

```bash
# 运行测试
npm test
```

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

[MIT](LICENSE) © [linzowo]

## 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新历史。