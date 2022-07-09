const express = require("express");

const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    console.log(req.params);
    if (user) {
      res.status(200);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/", (req, res) => {
  var user_info = null;
  if (!req.user) {
    user_info = [];
  } else {
    user_info = JSON.parse(JSON.stringify(req.user));
  }
  res.json(user_info);
});

// 지갑 정보 등록
router.post("/account", isLoggedIn, async (req, res, next) => {
  try {
    const { wallet_address, privatekey } = req.body;
    await User.update(
      { wallet_address: wallet_address, privatekey: privatekey },
      { where: { id: req.user.id } }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
