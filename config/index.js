'use strict';
// 配置文件
module.exports = {
  // 基础定时发送功能配置项 （必填项）
  NAME: '詹晓东',
  NICKNAME: '小占', //女朋友昵称
  AGE: '21',
  MEMORAL_DAY: '2019/03/03',
  CITY: 'zhejiang',
  LOCATION: 'xihu-district', //女朋友所在区（可以访问墨迹天气网站后，查询区的英文拼写）
  SEND_DATE: '10 * * * * *', //定时发送时间 每天8点0分0秒发送，规则见 /schedule/index.js
  ONE: 'http://wufazhuce.com/', //ONE的web版网站
  MOJI_HOST: 'https://tianqi.moji.com/weather/china/', //中国墨迹天气url
  AUTOREPLY: true, // 是否自动聊天
  //天行机器人API 注册地址https://www.tianapi.com/signup.html?source=474284281
  AIBOTAPI: 'http://api.tianapi.com/txapi/robot/',
  APIKEY: '23ee06d0c699e350f78a08ca9d374169', //天行机器人apikey
};
