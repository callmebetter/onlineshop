const router = require("express").Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const root = process.cwd();

/* GET home page. */
router.get("/", function (req, res, next) {
  const dir = path.join(root, 'public', 'uploads');
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading directory');
      return;
    }
    res.render("download", { files: files });
  });
});


// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 指定上传文件存储目录
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // 自定义文件名
  }
});
const upload = multer({ storage })

// 上传路由
router.post('/upload', upload.single('myFile'), (req, res) => {
  console.log(req.file); // 访问上传的文件信息
  res.send('File uploaded successfully!');
});

// 下载路由
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(root, 'public', 'uploads', filename); // 替换为你的文件存储路径

  // 检查文件是否存在
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // 设置响应头
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
});

module.exports = router;

