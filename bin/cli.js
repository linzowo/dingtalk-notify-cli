#!/usr/bin/env node

const { program } = require('commander');
const sendMessage = require('../lib/sendMessage');
const { initConfig } = require('../lib/initConfig');
const { showLogs } = require('../lib/logger');
const packageJson = require('../package.json');

// 设置程序基本信息
program
  .name('dingtalk-notify')
  .version(packageJson.version, '-v, --version', '显示版本号')
  .description('向钉钉群机器人发送消息的命令行工具');

// 默认命令：发送消息（保持向后兼容）
program
  .argument('[message]', '要发送的消息内容')
  .action(async (message) => {
    // 如果没有提供消息参数，显示帮助信息
    if (!message) {
      program.help();
      return;
    }
    
    try {
      await sendMessage(message);
      console.log('✅ 消息发送成功');
    } catch (error) {
      console.error('❌ 消息发送失败:', error.message);
      process.exit(1);
    }
  });

// init 命令：初始化配置文件
program
  .command('init')
  .description('创建默认配置文件')
  .option('-f, --force', '强制覆盖已存在的配置文件')
  .action(async (options) => {
    try {
      const success = await initConfig(options.force);
      if (!success && !options.force) {
        console.log('💡 提示: 使用 --force 参数可以强制覆盖现有配置文件');
      }
    } catch (error) {
      console.error('❌ 初始化配置文件失败:', error.message);
      process.exit(1);
    }
  });

// logs 命令：查看日志
program
  .command('logs')
  .description('查看发送日志')
  .argument('[count]', '显示的日志条数，不指定则显示全部日志')
  .action((count) => {
    try {
      const logCount = count ? parseInt(count, 10) : null;
      
      if (count && (isNaN(logCount) || logCount <= 0)) {
        console.error('❌ 日志条数必须是正整数');
        process.exit(1);
      }
      
      showLogs(logCount);
    } catch (error) {
      console.error('❌ 查看日志失败:', error.message);
      process.exit(1);
    }
  });

// 添加使用示例到帮助信息
program.on('--help', () => {
  console.log('');
  console.log('使用示例:');
  console.log('  $ dingtalk-notify "Hello, World!"          # 发送消息');
  console.log('  $ dingtalk-notify init                     # 创建配置文件');
  console.log('  $ dingtalk-notify init --force             # 强制重新创建配置文件');
  console.log('  $ dingtalk-notify logs                     # 查看所有日志');
  console.log('  $ dingtalk-notify logs 10                  # 查看最新10条日志');
  console.log('');
  console.log('配置文件:');
  console.log('  程序会在当前目录及其父目录中查找 dingtalk-notify.json 配置文件');
  console.log('  使用 init 命令可以在当前目录创建默认配置文件');
});

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供任何参数，显示帮助信息
if (process.argv.length === 2) {
  program.help();
}
    