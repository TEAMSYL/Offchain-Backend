const express = require("express");

const { isLoggedIn } = require("./middlewares");
const router = express.Router();
const multer = require("../src/multers");
const Product = require("../models/product");
const ProductImg = require("../models/productImg");

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

router.get("/seller", isLoggedIn, async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { sellerId: req.user.id },
      include: { model: ProductImg, limit: 1, attributes: ["imgUrl"] },
    });
    if (products) {
      res.status(200).send(products);
    }
  } catch (error) {
    console.error(error);
  }
});

router.post(
  "/",
  multer.upload.single("thumbnail", 1),
  isLoggedIn,
  async (req, res, next) => {
    try {
      const data = req.body.data;
      const { id, productName, content, category, price } = JSON.parse(data);
      const thumbnail = req.file.location;

      const product = await Product.create({
        sellerId: id,
        productName: productName,
        content: content,
        category: category,
        price: price,
        thumbnail: thumbnail,
      });
      return res.status(201).send({ productId: product.id });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post(
  "/images/:id",
  isLoggedIn,
  multer.upload.array("productImgs", 10),
  async (req, res) => {
    const images = req.files;
    const productId = req.params.id;
    if (images) {
      const locations = await images.map((img) => img.location);
      locations.map((url) =>
        ProductImg.create({ productId: productId, imgUrl: url })
      );
      return res.status(201).send(locations);
    }
    res.status(400).send("이미지가 없습니다.");
  }
);

router.get(
  "/management",
  isLoggedIn,
  multer.upload.array("productImgs", 10, async (req, res, next) => {
    try {
      const sellerId = req.user.id;
      const limit = Number(req.query.limit);
      const pageNumber = req.query.page;
      const offset = 0 + limit * (pageNumber - 1);

      const products = await Product.findAll({
        where: { sellerId: sellerId },
        attributes: ["productName", "status", "price", "updatedAt"],
        offset: offset,
        limit: limit,
      });

      if (products) res.status(200).send(products);
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
);

router.delete("/:id", async (req, res, next) => {
  try {
    const product = await Product.findOne({
      attributes: ["id", "sellerId"],
      where: { id: req.params.id },
    });
    if (product) {
      const seller = await product.getUser();
      if (seller.id) {
        const productImgs = await ProductImg.findAll({
          where: { productId: product.id },
        });
        const filenames = productImgs.map((img) =>
          img.imgUrl.split("/").at(-1)
        );
        // s3에 있는 이미지들 삭제
        filenames.map((file) => multer.delete_file(file));
        // s3에서 thumbnail 삭제
        multer.delete_file(product.thumbnail);
        await ProductImg.destroy({ where: { productId: product.id } });
        await product.destroy();
        res.status(200).send("완료");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
