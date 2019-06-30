// 导入机器人
const { Wechaty, Friendship } = require('wechaty');

// 终端打印二维码插件
const qrcode = require('qrcode-terminal');

// 配置文件
const config = require('./config/index');

// 定时执行
const schedule = require('./schedule');

// 日期插件
const dayjs = require('dayjs');

// 获取信息
const superagent = require('./superagent/index')

// FileBox
const { FileBox } = require('file-box')

// FileBox 获取图片的方法
const getIMG = require('./util/getIMG')


// 延时函数
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

 //  二维码生成
function onScan(qrcode, status) {

  console.log(qrcode, 'qrcode')
  
  require('qrcode-terminal').generate(qrcode, {small: true}) // 在console端显示二维码

  // 打印二维码地址
  const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)

}

// 登录
async function onLogin(user) {
  console.log(`${user}登录了`)

  if (config.AUTOREPLY) {
    console.log(`已开启机器人自动聊天模式`)
  }

  // 登陆后创建定时任务
  await DayTask()

}

//登出
function onLogout(user) {
  console.log(`小助手${user} 已经登出`)
}


async function onMessage(msg) {
  const contact = msg.from() // 发消息人
  const content = msg.text() //消息内容
  const room = msg.room() //是否是群消息
  if (msg.self()) {
      return
  }
  
  if (room) { // 如果是群消息
    const topic = await room.topic()
    console.log(`群名: ${topic} 发消息人: ${contact.name()} 内容: ${content}`)
  } else { // 如果非群消息
      console.log(`发消息人: ${contact.name()} 消息内容: ${content}`)
      if (config.AUTOREPLY) { // 如果开启自动聊天
          let reply = await superagent.getReply(content)
          console.log('天行机器人回复：', reply)
          try {
              await delay(2000)
              await contact.say(reply) // 发送机器人回复

          } catch (e) {
              console.error(e)
          }
      }
  }
}

const bot = new Wechaty({name: 'LinhfBot'});

const DayTask = async () => {
  console.log('开始每日任务')
  schedule.setSchedule(config.SEND_DATE, async() => {
      console.log('你的贴心小助理开始工作啦！')
      let logMsg
      let contact = await bot.Contact.find({ name: config.NICKNAME }) || await bot.Contact.find({ alias: config.NAME }) // 获取你要发送的联系人

      let one = await superagent.getOne() //获取每日一句
      let weather = await superagent.getWeather() //获取天气信息

      let today = dayjs().format('YYYY-MM-DD') //获取今天的日期
      let memorialDay = dayjs().day(config.MEMORIAL_DAY) //获取纪念日天数

      let str = today + '<br>我们在一起的第' + memorialDay + '天<br>' + '<br>元气满满的一天开始啦,要开心噢^_^<br>' +
          '<br>今日天气<br>' + weather.weatherTips + '<br>' + weather.todayWeather + '<br>每日一句:<br>' + one + '<br><br>' + '————————最爱你的我'
      try {
          logMsg = str
          await delay(2000)
          await contact.say(str) // 发送消息
      } catch (e) {
          logMsg = e.message
      }
      console.log(logMsg)
  })  
} 

bot.on("scan", onScan)
bot.on("login", onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot
  .start()
  .then(() => console.log('开始登录微信'))
  .catch(e => console.error(e))

