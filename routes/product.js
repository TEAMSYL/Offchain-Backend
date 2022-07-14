const express = require("express");

const { isLoggedIn } = require("./middlewares");
const Product = require("../models/product");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await Product.findAll({});
    if (products) res.send(products);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/detail", async (req, res, next) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    if (product) res.send(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", isLoggedIn, async (req, res, next) => {
  const { productName, content, category, price } = req.body;
  Product.create({
    sellerId: req.user.id,
    productName: productName,
    content: content,
    category: category,
    price: price,
  });
  res.status(200).send("완료");
});
router.get("/management", isLoggedIn, async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.findAll({
      where: { sellerId: sellerId },
      attributes: ["productName", "status", "price", "updatedAt"],
    });
    if (products) res.send(products);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const sellerInfo = await Product.findOne({
      attributes: ["sellerId"],
      where: { id: req.params.id },
    });
    if (sellerInfo) {
      if (sellerInfo.getSellerId() == req.user.id) {
        await Product.destroy({ where: { id: req.params.id } });
        res.status(200).send("완료");
      }
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
