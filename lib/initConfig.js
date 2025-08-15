const fs = require('fs');
const path = require('path');

// 配置文件名
const CONFIG_FILE = 'dingtalk-notify.json';
const EXAMPLE_CONFIG_FILE = 'dingtalk-notify.example.json';

// 默认配置内容
const defaultConfigContent = {
  "msgType": "text",
  "title": "系统通知",
  "addTimestamp": true,
  "addSource": false,
  "dingtalk": {
    "accessToken": "your_access_token_here",
    "secret": "your_secret_here_optional"
  }
};

/**
 * 初始化配置文件
 * @param {boolean} force 是否强制覆盖已存在的配置文件
 * @returns {Promise<boolean>} 是否成功创建配置文件
 */
async function initConfig(force = false) {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  const exampleConfigPath = path.join(__dirname, '..', EXAMPLE_CONFIG_FILE);
  
  try {
    // 检查配置文件是否已存在
    if (fs.existsSync(configPath) && !force) {
      console.log(`配置文件已存在: ${configPath}`);
      console.log('如需重新创建，请使用 --force 参数');
      return false;
    }
    
    let configContent;
    
    // 优先使用示例配置文件的内容
    if (fs.existsSync(exampleConfigPath)) {
      try {
        const exampleContent = fs.readFileSync(exampleConfigPath, 'utf8');
        configContent = exampleContent;
        console.log('使用示例配置文件模板创建配置');
      } catch (error) {
        console.warn('读取示例配置文件失败，使用默认配置:', error.message);
        configContent = JSON.stringify(defaultConfigContent, null, 2);
      }
    } else {
      // 如果示例配置文件不存在，使用默认配置
      configContent = JSON.stringify(defaultConfigContent, null, 2);
      console.log('使用默认配置模板创建配置');
    }
    
    // 写入配置文件
    fs.writeFileSync(configPath, configContent, 'utf8');
    
    console.log(`✅ 配置文件创建成功: ${configPath}`);
    console.log('');
    console.log('📝 请编辑配置文件，设置您的钉钉机器人信息:');
    console.log('   - accessToken: 钉钉机器人的 Webhook 地址中的 access_token 参数');
    console.log('   - secret: 钉钉机器人的加签密钥（可选，如果启用了加签验证）');
    console.log('');
    console.log('🚀 配置完成后，您可以使用以下命令发送消息:');
    console.log(`   dingtalk-notify "您的消息内容"`);
    
    return true;
  } catch (error) {
    console.error('❌ 创建配置文件失败:', error.message);
    
    // 提供更详细的错误信息
    if (error.code === 'EACCES') {
      console.error('   权限不足，请检查当前目录的写入权限');
    } else if (error.code === 'ENOSPC') {
      console.error('   磁盘空间不足');
    } else if (error.code === 'ENOTDIR') {
      console.error('   路径错误，请确保在正确的目录中执行命令');
    }
    
    return false;
  }
}

/**
 * 检查配置文件是否存在
 * @returns {boolean} 配置文件是否存在
 */
function configExists() {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  return fs.existsSync(configPath);
}

/**
 * 获取配置文件路径
 * @returns {string} 配置文件的完整路径
 */
function getConfigPath() {
  return path.join(process.cwd(), CONFIG_FILE);
}

module.exports = {
  initConfig,
  configExists,
  getConfigPath
};