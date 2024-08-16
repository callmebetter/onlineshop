const router = require("express").Router();
const multer = require('multer');

const authenticated = require('../middlewares/authenticated');
const logger = require("../common/logger");

router.use(authenticated);
const root = process.cwd();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("upload", { title: "upload" });
});

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${root}/public/uploads/`); // 指定上传文件存储目录
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // 自定义文件名
  }
});
const upload = multer({ storage })

// 上传路由
router.post('/all', upload.single('myFile'), (req, res) => {
  logger.info(req.file);

  res.send('File uploaded successfully!');
});


module.exports = router;

