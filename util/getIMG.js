const { FileBox } = require('file-box')
const path = require('path')

// 图片路径
const IMG_PATH = '/assert/images/';
// 图片总数
const IMG_NUM = 28;
// 起始下标
let I = 0;

const getIMG = () => {
  const img_path = `${IMG_PATH}linhf_${I++ % IMG_NUM}.png`
  return FileBox.fromFile(img_path)
}

console.log(getIMG())

module.exports = getIMG