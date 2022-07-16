const express = require("express");

const { isLoggedIn } = require("./middlewares");
const Product = require("../models/product");
const router = express.Router();
const upload = require("../src/multers");

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

router.post("/images", upload.array("productImgs", 10), async (req, res) => {
  const images = req.files;
  if (images) {
    const locations = images.map((img) => img.location);
    console.log(locations);
    return res.status(201).send(locations);
  }
  res.status(400).send("이미지가 없습니다.");
});

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { productName, content, category, price, imgUrls } = req.body;

    const product = await Product.create({
      sellerId: user.req.id,
      productName: productName,
      content: content,
      category: category,
      price: price,
    });
    if (imgUrls) {
      await imgUrls.map((url) => product.createProductImg({ imgUrl: url }));
    }
    return res.status(201).send("상품 등록 완료");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get(
  "/management",
  isLoggedIn,
  upload.array("productImgs", 10, async (req, res, next) => {
    try {
      const limit = Number(req.query.limit);
      const pageNumber = req.query.page;
      const offset = 0 + limit * (pageNumber - 1);
      const sellerId = req.user.id;
      const products = await Product.findAll({
        where: { sellerId: sellerId },
        attributes: ["productName", "status", "price", "updatedAt"],
        offset: offset,
        limit: limit,
      });
      if (products) res.send(products);
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
);

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
