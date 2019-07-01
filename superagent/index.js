'use strict';

const superagent = require('../config/superagent');
const config = require('../config/index');
const cheerio = require('cheerio');

// 缓存页面
let res = null;
// 拥有 Jquery 能力的页面
let $ = null;
// 获取到的列表
let todayOneList = null;
// 页面 总item
const ITEMS = 7;
// 循环 ID
let num = 0;

// 获取每日一句
// async 返回一个 promise  - await 可以对 promise 使用
const getOne = async() => {

  if (!res || !$ || todayOneList) {
    res = await superagent.req(config.ONE, 'GET');
    $ = cheerio.load(res.text);
    todayOneList = $('#carousel-one .carousel-inner .item');
  }

  // 按调用的次数 选择其中的一个
  const itemNum = num++ % ITEMS;
  console.log(itemNum, 'itemNum');

  const todayOne = $(todayOneList[itemNum]).find('.fp-one-cita').text().replace(/(^\s*)|(\s*$)/g, '');

  return todayOne;

};

async function getWeather() {

  const url = config.MOJI_HOST + config.CITY + '/' + config.LOCATION;
  const res = await superagent.req(url, 'GET');

  const $ = cheerio.load(res.text);
  const weatherTips = $('.wea_tips em').text();

  const today = $('.forecast .days').first().find('li');

  const todayInfo = {
    Day: $(today[0]).text().replace(/(^\s*)|(\s*$)/g, ''),
    WeatherText: $(today[1]).text().replace(/(^\s*)|(\s*$)/g, ''),
    Temp: $(today[2]).text().replace(/(^\s*)|(\s*$)/g, ''),
    Wind: $(today[3]).find('em').text().replace(/(^\s*)|(\s*$)/g, ''),
    WindLevel: $(today[3]).find('b').text().replace(/(^\s*)|(\s*$)/g, ''),
    PollutionLevel: $(today[4]).find('strong').text().replace(/(^\s*)|(\s*$)/g, '')
  };

  const obj = {
    weatherTips: weatherTips,
    todayWeather: todayInfo.Day + ':' + todayInfo.WeatherText + '<br>' + '温度:' + todayInfo.Temp + '<br>' +
        todayInfo.Wind + todayInfo.WindLevel + '<br>' + '空气:' + todayInfo.PollutionLevel + '<br>'
  };

  return obj;

}

async function getReply(word) {
  const url = config.AIBOTAPI;

  const res = await superagent.req(url, 'GET', {
    key: config.APIKEY,
    question: word,
    mode: 1,
    datatype: 0
  });

  const content = JSON.parse(res.text);

  if (content.code === 200) {

    let response = '';

    if (content.datatype === 'text') {
      response = content.newslist[0].reply.replace('{robotname}', '小助手').replace('{appellation}', '小主');

      return response;
    }

    if (content.datatype === 'view') {
      response = '虽然我不太懂你说的是什么，但是感觉很高级的样子，因此我也查找了类似的文章去学习，你觉得有用吗<br>' + '《' + content.newslist[0].title + '》' + content.newslist[0].url;

      return response;
    }

    response = '你太厉害了，说的话把我难倒了，我要去学习了，不然没法回答你的问题';

    return response;

  }

  return '我好像迷失在无边的网络中了，你能找回我么';

}

module.exports = {
  getOne,
  getWeather,
  getReply
};
