const express = require("express");

const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      res.status(200);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.get("/products", async (req, res, next) => {
  try {
    const { sellerId } = req.body;
    const seller = User.findOne({ where: { id: sellerId } });
    const products = seller.getProducts();
    console.log(products);
    if (product) res.send(products);
  } catch (error) {
    console.error(error);
    next(error);
  }
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
