const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/api", (req, res, next) => {
  res.send("api");
   
});

router.post("/remainCount", (req, res, next) => {
   res.json(require("../aaa.js").remainCount_data);
});

module.exports = router;
