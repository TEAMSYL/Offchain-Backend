const express = require("express");

const { isLoggedIn } = require("./middlewares");
const Transaction_request = require("../models/transaction_request");
const Product = require("../models/product");

const router = express.Router();
const Deployer = require("../src/deployContract"); // contract 배포
const { getAddress } = require("ethers/lib/utils");

router.post("/request", isLoggedIn, async (req, res, next) => {
  const buyer_id = req.user.id;
  const { product_id, seller_id } = req.body;

  try {
    await Transaction_request.create({
      productId: product_id,
      buyerId: buyer_id,
      sellerId: seller_id,
      status: "requested",
    });
    return res.status(200).send("완료");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/permit", isLoggedIn, async (req, res, next) => {
  const { product_id, buyer_id, seller_id } = req.body;
  try {
    // 테이블 관점에서 생각해서 조회를 너무 많이하게 구성함
    // TODO: 객체 관점에서 참조를 통해 가져오도록 고쳐야 함.
    const buyer = User.findOne({ where: { id: buyer_id } });
    const seller = User.findOne({ where: { id: seller_id } });
    const product = Product.findOne({ where: { id: product_id } });

    const contract_address = await Deployer.deployContract(
      seller.privatekey, // seller
      buyer.wallet_address, //buyer
      product_id,
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
    where: { seller_id: req.user.id },
  });
  return res.send(requests);
});

module.exports = router;
