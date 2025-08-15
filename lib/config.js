const fs = require('fs');
const findConfig = require('find-config');

// 默认配置
const defaultConfig = {
  // 消息类型，支持text, markdown等
  msgType: 'text',
  // 通知标题（用于markdown类型）
  title: '系统通知',
  // 是否在消息前添加时间戳
  addTimestamp: true,
  // 是否在消息中添加发送来源信息
  addSource: true,
  // 钉钉机器人配置
  dingtalk: {
    // 固定的 baseUrl
    baseUrl: 'https://oapi.dingtalk.com/robot/send',
    // 必需的 accessToken
    accessToken: null,
    // 可选的 secret（如果有则使用加签模式）
    secret: null
  }
};

// 查找并加载用户配置
function loadConfig() {
  // 查找用户配置文件
  const configPath = findConfig('dingtalk-notify.json');
  
  let userConfig = {};
  
  if (configPath) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      userConfig = JSON.parse(configContent);
      console.log(`已加载配置文件: ${configPath}`);
    } catch (error) {
      console.warn('配置文件解析错误，将使用默认配置:', error.message);
      userConfig = {};
    }
  } else {
    console.log('未找到配置文件，使用默认配置');
  }
  
  // 合并默认配置和用户配置
  const mergedConfig = { ...defaultConfig, ...userConfig };
  
  // 特别处理 dingtalk 配置的合并
  if (userConfig.dingtalk) {
    mergedConfig.dingtalk = { ...defaultConfig.dingtalk, ...userConfig.dingtalk };
  }
  
  return mergedConfig;
}

// 获取钉钉机器人配置
function getDingtalkConfig() {
  const config = loadConfig();
  
  if (!config.dingtalk.accessToken) {
    throw new Error('未找到钉钉机器人配置，请在 dingtalk-notify.json 配置文件中设置 dingtalk.accessToken');
  }
  
  return {
    baseUrl: config.dingtalk.baseUrl,
    accessToken: config.dingtalk.accessToken,
    secret: config.dingtalk.secret || undefined // 如果没有 secret 则为 undefined
  };
}

module.exports = {
  config: loadConfig(),
  getDingtalkConfig,
  get dingtalkConfig() {
    return getDingtalkConfig();
  }
};
    