const express = require("express");

const { isLoggedIn } = require("./middlewares");
const Transaction_request = require("../models/transaction_request");
const Product = require("../models/product");

const router = express.Router();
const Deployer = require("../src/deployContract"); // contract 배포

router.get("/request", isLoggedIn, async (req, res, next) => {
  const sellerId = req.user.id;
  const { productId } = req.body;
  try {
    const transaction_requests = await Transaction_request.findAll({
      where: { sellerId: sellerId },
    });
    return res.status(200).send(transaction_requests);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/request", isLoggedIn, async (req, res, next) => {
  const buyerId = req.user.id;
  const { productId, sellerId } = req.body;
  try {
    await Transaction_request.create({
      productId: productId,
      buyerId: buyerId,
      sellerId: sellerId,
      status: "requested",
    });
    return res.status(200).send("완료");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/permit", async (req, res, next) => {
  const { productId, buyerId, sellerId } = req.body;
  try {
    // 테이블 관점에서 생각해서 조회를 너무 많이하게 구성함
    // TODO: 객체 관점에서 참조를 통해 가져오도록 고쳐야 함.
    const buyer = User.findOne({ where: { id: buyerId } });
    const seller = User.findOne({ where: { id: sellerId } });
    const product = Product.findOne({ where: { id: productId } });
    const sellerinfo = product.getUser();
    res.send(sellerinfo);

    const contract_address = await Deployer.deployContract(
      seller.privatekey, // seller
      buyer.wallet_address, //buyer
      productId,
      product.price
    );

    return res.status(200).send("완료");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
router.get("/request", isLoggedIn, async (req, res, next) => {
  const requests = await Transaction_request.findAll({
    where: { sellerId: req.user.id },
  });
  return res.send(requests);
});

module.exports = router;
