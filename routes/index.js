const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/memo-api/activity/1.0/game/luckyDraw", function (req, res, next) {
  console.log(req);
});

router.get("/foo", function (req, res, next) {
  console.log(req)
  res.send({
    code: 200,
    msg: "OK",
  });
});

module.exports = router;
