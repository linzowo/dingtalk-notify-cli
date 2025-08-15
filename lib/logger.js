const fs = require('fs');
const path = require('path');

// 日志文件路径
const LOG_FILE = path.join(process.cwd(), 'dingtalk-notify.log');
const MAX_LOG_LINES = 500;

/**
 * 记录日志
 * @param {string} level 日志级别
 * @param {string} message 日志消息
 * @param {object} data 附加数据
 */
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  let logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (data) {
    logEntry += ` | Data: ${JSON.stringify(data)}`;
  }
  
  logEntry += '\n';
  
  try {
    // 追加日志到文件
    fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
    
    // 检查并控制日志行数
    trimLogFile();
  } catch (error) {
    console.error('写入日志文件失败:', error.message);
  }
}

/**
 * 控制日志文件行数不超过最大限制
 */
function trimLogFile() {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return;
    }
    
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length > MAX_LOG_LINES) {
      // 保留最新的 MAX_LOG_LINES 行
      const trimmedLines = lines.slice(-MAX_LOG_LINES);
      const trimmedContent = trimmedLines.join('\n') + '\n';
      fs.writeFileSync(LOG_FILE, trimmedContent, 'utf8');
    }
  } catch (error) {
    console.error('清理日志文件失败:', error.message);
  }
}

/**
 * 记录消息发送日志
 * @param {string} messageContent 消息内容
 * @param {object} response 响应对象
 * @param {boolean} success 是否发送成功
 */
function logMessageSend(messageContent, response, success) {
  const logData = {
    messageContent,
    responseData: response,
    success,
    status: success ? 200 : (response.errcode || 'unknown')
  };
  
  const level = success ? 'info' : 'error';
  const message = success ? '消息发送成功' : '消息发送失败';
  
  log(level, message, logData);
}

/**
 * 读取日志文件内容
 * @param {number} count 返回的日志条数，如果不指定则返回所有日志
 * @returns {Array<string>} 日志行数组
 */
function readLogs(count = null) {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return [];
    }
    
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    if (count === null || count <= 0) {
      // 返回所有日志
      return lines;
    } else {
      // 返回最新的 count 条日志
      return lines.slice(-count);
    }
  } catch (error) {
    console.error('读取日志文件失败:', error.message);
    return [];
  }
}

/**
 * 显示日志内容
 * @param {number} count 显示的日志条数，如果不指定则显示所有日志
 */
function showLogs(count = null) {
  const logs = readLogs(count);
  
  if (logs.length === 0) {
    console.log('📝 暂无日志记录');
    console.log('💡 发送一条消息后将会产生日志记录');
    return;
  }
  
  const totalLogs = readLogs().length;
  
  if (count && count < totalLogs) {
    console.log(`📋 显示最新 ${logs.length} 条日志 (共 ${totalLogs} 条):`);
  } else {
    console.log(`📋 显示全部 ${logs.length} 条日志:`);
  }
  
  console.log(''.padEnd(80, '-'));
  
  logs.forEach((line, index) => {
    // 解析日志行，提取时间戳、级别和消息
    const match = line.match(/^\[(.*?)\] \[(.*?)\] (.*)$/);
    if (match) {
      const [, timestamp, level, message] = match;
      const date = new Date(timestamp);
      const formattedTime = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // 根据日志级别添加不同的标识
      let levelIcon = '';
      switch (level.toLowerCase()) {
        case 'info':
          levelIcon = '✅';
          break;
        case 'error':
          levelIcon = '❌';
          break;
        case 'warn':
          levelIcon = '⚠️';
          break;
        default:
          levelIcon = '📝';
      }
      
      console.log(`${levelIcon} [${formattedTime}] ${message}`);
    } else {
      // 如果无法解析，直接显示原始行
      console.log(`📝 ${line}`);
    }
  });
  
  console.log(''.padEnd(80, '-'));
  
  if (count && count < totalLogs) {
    console.log(`💡 使用 'dingtalk-notify logs' 查看全部日志`);
  }
}

module.exports = {
  log,
  logMessageSend,
  readLogs,
  showLogs
};