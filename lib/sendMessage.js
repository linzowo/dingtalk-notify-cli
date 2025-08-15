const ChatBot = require('dingtalk-robot-sender');
const { config, getDingtalkConfig } = require('./config');
const { logMessageSend } = require('./logger');

/**
 * 创建钉钉机器人实例
 * @returns {ChatBot} 钉钉机器人实例
 */
function createChatBot() {
  const dingtalkConfig = getDingtalkConfig();
  const botConfig = {
    baseUrl: dingtalkConfig.baseUrl,
    accessToken: dingtalkConfig.accessToken
  };
  
  // 如果有 secret，则添加到配置中
  if (dingtalkConfig.secret) {
    botConfig.secret = dingtalkConfig.secret;
  }
  
  return new ChatBot(botConfig);
}

/**
 * 格式化消息内容
 * @param {string} message 原始消息内容
 * @returns {string} 格式化后的消息
 */
function formatMessage(message) {
  let formatted = message;
  
  // 如果配置了添加时间戳
  if (config.addTimestamp) {
    const timestamp = new Date().toLocaleString();
    formatted = `[${timestamp}] ${formatted}`;
  }
  
  // 如果配置了添加来源信息
  if (config.addSource) {
    const source = process.env.HOSTNAME || 'unknown-host';
    formatted = `${formatted}\n(来自: ${source})`;
  }
  
  return formatted;
}

/**
 * 构建消息体
 * @param {string} message 消息内容
 * @returns {object} 符合钉钉机器人API要求的消息体
 */
function buildMessagePayload(message) {
  const formattedMessage = formatMessage(message);
  
  switch (config.msgType) {
    case 'markdown':
      return {
        msgtype: 'markdown',
        markdown: {
          title: config.title,
          text: formattedMessage
        }
      };
      
    case 'text':
    default:
      return {
        msgtype: 'text',
        text: {
          content: formattedMessage
        }
      };
  }
}

/**
 * 发送消息到钉钉机器人
 * @param {string} message 要发送的消息内容
 */
async function sendMessage(message) {
  if (!message || message.trim() === '') {
    throw new Error('消息内容不能为空');
  }
  
  const payload = buildMessagePayload(message);
  const robot = createChatBot();
  
  try {
    const response = await robot.send(payload);
    
    // 提取响应的关键信息，避免循环引用
    const responseData = {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    };
    
    if (response.status !== 200) {
      // 记录发送失败日志
      logMessageSend(message, responseData, false);
      throw new Error(`钉钉API返回错误: ${response.status} ${response.statusText}`);
    }
    
    // 记录发送成功日志
    logMessageSend(message, responseData, true);
    
    return responseData;
  } catch (error) {
    // 如果是网络错误或其他异常，也记录日志
    if (!error.message.includes('钉钉API返回错误')) {
      logMessageSend(message, { error: error.message }, false);
    }
    throw new Error(`发送消息时出错: ${error.message}`);
  }
}

module.exports = sendMessage;
    