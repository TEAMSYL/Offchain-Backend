const express = require("express");

const { isLoggedIn } = require("./middlewares");
const Product = require("../models/product");
const ProductImg = require("../models/productImg");
const router = express.Router();
const upload = require("../src/multers");

router.get("/", async (req, res, next) => {
  try {
    const products = await Product.findAll({ include: ProductImg });
    if (products) return res.status(200).send(products);
    return res.status(400).send("조회된 상품이 없습니다.");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/seller", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit);
    const pageNumber = req.query.page;
    const offset = 0 + limit * (pageNumber - 1);
    const products = await Product.findAll({
      where: { sellerId: req.user.id },
      offset: offset,
      limit: limit,
      include: { model: ProductImg, limit: 1 },
    });
    if (products) {
      res.status(200).send(products);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/detail", async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
      include: ProductImg,
    });
    if (product) res.send(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  "/images",
  isLoggedIn,
  upload.array("productImgs", 10),
  async (req, res) => {
    const images = req.files;
    if (images) {
      const locations = await images.map((img) => img.location);
      console.log(locations);
      return res.status(201).send(locations);
    }
    res.status(400).send("이미지가 없습니다.");
  }
);
router.get("/seller", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit);
    const pageNumber = req.query.page;
    const offset = 0 + limit * (pageNumber - 1);
    const products = await Product.findAll({
      where: { sellerId: req.user.id },
      offset: offset,
      limit: limit,
      include: { model: ProductImg, limit: 1 },
    });
    if (products) {
      res.status(200).send(products);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { productName, content, category, price, imgUrls } = req.body;

    const product = await Product.create({
      sellerId: req.user.id,
      productName: productName,
      content: content,
      category: category,
      price: price,
    });
    console.log("이미지 urls", imgUrls);
    if (imgUrls) {
      imgUrls.data.map((url) => product.createProductImg({ imgUrl: url }));
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
