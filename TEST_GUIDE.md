# 钉钉机器人消息工具测试方案

## 测试前准备

### 1. 安装依赖
```bash
npm install
```

### 2. 配置钉钉机器人

#### 方式一：使用配置文件（推荐）
1. 复制示例配置文件：
```bash
cp dingtalk-notify.example.json dingtalk-notify.json
```

2. 编辑 `dingtalk-notify.json`，填入真实的钉钉机器人信息：
```json
{
  "msgType": "text",
  "title": "测试通知",
  "addTimestamp": true,
  "addSource": true,
  "dingtalk": {
    "accessToken": "你的真实access_token",
    "secret": "你的真实secret（可选）"
  }
}
```

**注意：**
- `accessToken` 是必需的，从钉钉机器人设置中获取
- `secret` 是可选的，如果钉钉机器人启用了加签验证则需要填写
- `baseUrl` 已固定为 `https://oapi.dingtalk.com/robot/send`，无需配置

### 3. 获取钉钉机器人配置信息

1. 在钉钉群中添加自定义机器人
2. 选择安全设置：
   - **加签方式**：会得到 `access_token` 和 `secret`
   - **关键词方式**：只会得到 `access_token`
3. 复制相应的配置信息到 `dingtalk-notify.json`

## 测试用例

### 测试用例 1：基本文本消息发送
```bash
node bin/cli.js "这是一条测试消息"
```

**预期结果：**
- 控制台显示 "消息发送成功"
- 显示响应信息（JSON 格式）
- 钉钉群收到消息
- 生成日志文件 `dingtalk-notify.log`

### 测试用例 2：带时间戳和来源的消息
确保 `dingtalk-notify.json` 中 `addTimestamp` 和 `addSource` 为 `true`：
```bash
node bin/cli.js "测试带时间戳和来源的消息"
```

**预期结果：**
- 钉钉群收到的消息格式类似：`[2024-01-01 12:00:00] 测试带时间戳和来源的消息\n(来自: your-hostname)`

### 测试用例 3：Markdown 消息
修改 `dingtalk-notify.json` 中的 `msgType` 为 `"markdown"`：
```bash
node bin/cli.js "## 测试标题\n这是**粗体**文本\n- 列表项1\n- 列表项2"
```

**预期结果：**
- 钉钉群收到格式化的 Markdown 消息

### 测试用例 4：错误处理测试

#### 4.1 测试空消息
```bash
node bin/cli.js ""
```
**预期结果：** 显示错误信息 "消息内容不能为空"

#### 4.2 测试错误的 accessToken
临时修改 `dingtalk-notify.json` 中的 `accessToken` 为无效值，然后：
```bash
node bin/cli.js "测试错误token"
```
**预期结果：** 显示钉钉API错误信息，并记录到日志文件

### 测试用例 5：日志功能测试

1. 发送几条测试消息：
```bash
node bin/cli.js "日志测试消息1"
node bin/cli.js "日志测试消息2"
node bin/cli.js "日志测试消息3"
```

2. 查看日志文件：
```bash
type dingtalk-notify.log  # Windows
# 或
cat dingtalk-notify.log   # Linux/Mac
```

**预期结果：**
- 日志文件包含所有发送记录
- 每条日志包含时间戳、级别、消息内容、响应数据
- 成功的消息标记为 `[INFO]`，失败的标记为 `[ERROR]`

### 测试用例 6：日志行数限制测试

创建一个脚本发送大量消息来测试日志行数限制：
```bash
# 创建测试脚本
echo 'for i in {1..600}; do node bin/cli.js "测试消息 $i"; done' > test_logs.sh
# 运行测试（Linux/Mac）
bash test_logs.sh

# Windows PowerShell
for ($i=1; $i -le 600; $i++) { node bin/cli.js "测试消息 $i" }
```

**预期结果：**
- 日志文件行数不超过 500 行
- 保留最新的日志记录

## 验证清单

- [ ] 基本消息发送功能正常
- [ ] 时间戳和来源信息正确添加
- [ ] Markdown 消息格式正确
- [ ] 错误处理机制有效
- [ ] 日志记录功能完整
- [ ] 日志行数限制生效
- [ ] 加签模式（如果使用）正常工作
- [ ] 配置文件正确读取
- [ ] CLI 工具响应信息完整

## 故障排除

### 常见问题

1. **"未找到钉钉机器人配置"错误**
   - 确保 `dingtalk-notify.json` 文件存在
   - 确保文件中包含有效的 `accessToken`

2. **"钉钉API返回错误"**
   - 检查 `accessToken` 是否正确
   - 检查 `secret` 配置（如果使用加签模式）
   - 确认机器人在目标群中

3. **消息发送成功但群里收不到**
   - 检查机器人是否被移除
   - 检查安全设置（关键词、IP白名单等）

4. **日志文件权限错误**
   - 确保当前用户有写入权限
   - 检查磁盘空间是否充足

## 性能测试

### 并发测试
```bash
# 测试并发发送（谨慎使用，避免触发钉钉限流）
for i in {1..10}; do
  node bin/cli.js "并发测试消息 $i" &
done
wait
```

**注意：** 钉钉机器人有频率限制，建议控制发送频率。

## 清理

测试完成后，可以删除测试产生的文件：
```bash
rm dingtalk-notify.log
rm dingtalk-notify.json
rm test_logs.sh  # 如果创建了测试脚本
```