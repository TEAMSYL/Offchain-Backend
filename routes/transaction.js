const express = require("express");

const { isLoggedIn } = require("./middlewares");
const Transaction = require("../models/transaction");
const Product = require("../models/product");
const router = express.Router();
const Trade = require("../src/connectContract.js"); // 배포된 contract와 상호작용
const Deployer = require("../src/deployContract"); // contract 배포

router.post("/permit", isLoggedIn, async (req, res, next) => {
  const { productId } = req.body;
  try {
    if (productId) {
      const productInfo = await Product.findOne({
        where: { id: productId },
      });
      if (productInfo) {
        const sellerId = productInfo.dataValues.userId;
        if (sellerId == req.user.id) {
          await Transaction.update(
            {
              sellerIdId: sellerId,
              status: "permitted",
            },
            {
              where: { productId: productId },
            }
          );
          const transaction = await Transaction.findOne({
            where: { productId: productId, buyerId: buyer.id },
          });
          const contractAdress = await Deployer.deployContract(
            privatekey,
            buyer.wallet_address,
            productID,
            price
          );
        }
      }
    }
    return res.status(200).send("완료");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
router.post("/request", isLoggedIn, async (req, res, next) => {
  const { productId, price } = req.body;
  const buyer = req.user.id;
  try {
    await Transaction.create({
      productId: productId,
      buyerId: buyer,
      price: price,
      status: "requested",
    });
    return res.status(200).send("완료");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const Transactions = await Transaction.findAll({
      attributes: ["id", "TransactionName", "content", "price", "category"],
    });
    if (Transactions) res.send(Transactions);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const Transaction = await Transaction.findOne({
      where: { id: req.params.id },
    });
    if (Transaction) res.send(Transaction);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
