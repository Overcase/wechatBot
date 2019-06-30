const fs = require('fs');

// 遍历目录得到文件信息
const walk = (path, callback) => {
  console.log('开始遍历')

  let files = fs.readdirSync(path);

  files.forEach((file, index) => {
    if (fs.statSync(path + '/' + file).isFile()) {
      callback(path, file, index)
    }
  })

}

// 修改文件名称
const rename = (oldPath, newPath) => {
  console.log('开始修改名字', oldPath, newPath);

  fs.rename(oldPath, newPath, function(err) {
      if (err) {
        throw err;
      }
  });
}

// 运行
walk('../assert/images', function (path, fileName, index) {
  const oldPath = `${path}/${fileName}`, // 源文件路径
        newPath = `${path}/linhf_${index}.png`; // 新路径

  rename(oldPath, newPath);
});

