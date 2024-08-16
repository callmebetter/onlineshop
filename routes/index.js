const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.cookie("cookie", "cookie", { maxAge: 900000 });
  console.log('Cookies: ', req.cookies)
  res.render("index", { title: "Express" });
});


router.get("/login", function (req, res, next) {
  res.render("login", { title: "login" });
});

// 登录接口
router.post('/login', function(req, res, next){
  const username = req.body.username;
  const password = req.body.password;
  const user = {
    name: username,
    password: password
  };
  // var user = findUser(req.body.name, req.body.password);

  if (user) {
    req.session.regenerate(function (err) {
      if (err) {
        return res.json({ code: 2, msg: "登录失败" });
      }

      req.session.loginUser = user.name;
      // Check if there's a returnTo URL in the session
      if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.json({ code: 1, msg: "账号或密码错误" });
  }   
});

module.exports = router;
