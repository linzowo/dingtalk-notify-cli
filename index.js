/**
 * 钉钉通知 CLI 工具 - 主入口文件
 * 提供核心功能的模块化导出，供其他 Node.js 项目使用
 */

const sendMessage = require('./lib/sendMessage');
const { loadConfig, getDingtalkConfig } = require('./lib/config');
const { logMessageSend } = require('./lib/logger');

/**
 * 发送钉钉消息
 * @param {string} message - 要发送的消息内容
 * @param {Object} options - 可选配置
 * @param {boolean} options.addTimestamp - 是否添加时间戳
 * @param {boolean} options.addSource - 是否添加来源信息
 * @returns {Promise<Object>} 发送结果
 */
async function notify(message, options = {}) {
  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw new Error('消息内容不能为空');
  }

  // 临时设置配置选项（如果提供）
  const originalConfig = loadConfig();
  if (options.addTimestamp !== undefined) {
    originalConfig.addTimestamp = options.addTimestamp;
  }
  if (options.addSource !== undefined) {
    originalConfig.addSource = options.addSource;
  }

  return await sendMessage(message);
}

/**
 * 获取当前配置
 * @returns {Object} 当前配置对象
 */
function getConfig() {
  return loadConfig();
}

/**
 * 获取钉钉配置
 * @returns {Object} 钉钉配置对象
 */
function getDingtalkConfiguration() {
  return getDingtalkConfig();
}

/**
 * 记录消息发送日志
 * @param {string} message - 消息内容
 * @param {Object} response - 响应对象
 * @param {boolean} success - 是否成功
 */
function logMessage(message, response, success) {
  return logMessageSend(message, response, success);
}

// 导出主要功能
module.exports = {
  // 主要功能
  notify,
  sendMessage,
  
  // 配置相关
  getConfig,
  getDingtalkConfig: getDingtalkConfiguration,
  
  // 日志功能
  logMessage,
  
  // 向后兼容
  default: notify
};

// 支持 ES6 默认导出
module.exports.default = notify;