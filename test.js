const { FileBox } = require('file-box')

const IMG_PATH = '/assert/images/'

const fileBox1 = FileBox.fromUrl('https://chatie.io/wechaty/images/bot-qr-code.png')
const fileBox2 = FileBox.fromFile(`${IMG_PATH}linhf_0.png`)
  
// console.log(fileBox2)
console.log(global)
