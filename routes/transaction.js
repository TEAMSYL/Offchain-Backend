const express = require("express");

const { isLoggedIn } = require("./middlewares");
const router = express.Router();
const TransactionRequest = require("../models/transaction_request");
const Transaction = require("../models/transaction");
const Product = require("../models/product");
const User = require("../models/user");
const Deployer = require("../src/deployContract"); // contract 배포
const connectContract = require("../src/connectContract");
const ProductImg = require("../models/productImg");

router.get("/request/sent", isLoggedIn, async (req, res, next) => {
  const buyerId = req.user.id;
  try {
    const sentRequests = await TransactionRequest.findAll({
      where: { buyerId: buyerId },
      attributes: ["productId"],
      include: { model: Product, attributes: ["productName"] },
    });
    return res.status(200).send(sentRequests);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/request/recieved", isLoggedIn, async (req, res, next) => {
  const sellerId = req.user.id;
  try {
    const productsWithRequests = await Product.findAll({
      where: { sellerId: sellerId },
      attributes: ["id"],
      include: TransactionRequest,
    });
    return res.status(200).send(productsWithRequests);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/request/recieved/product", isLoggedIn, async (req, res, next) => {
  const productId = Number(req.query.productId);
  console.log(productId);
  try {
    const recievedRequests = await TransactionRequest.findAll({
      where: { productId: productId },
      include: { model: User, attributes: ["id", "nick"] },
    });

    return res.status(200).send(recievedRequests);
  } catch (error) {
    return next(error);
  }
});

router.post("/request", isLoggedIn, async (req, res, next) => {
  const buyerId = req.user.id;
  const { productId } = req.body;
  try {
    const existRequest = await TransactionRequest.findOne({
      where: { 
        productId: productId,
        buyerId: buyerId
      }
    });
    console.log('existRequest: ', existRequest);
    if (existRequest) {
      return res.status(400).send("이미 구매 요청을 한 상품입니다.");
    }

    await TransactionRequest.create({
      productId: productId,
      buyerId: buyerId,
    });
    Product.update({ status: "requested" }, { where: { id: productId } });
    return res.status(200).send("구매요청 완료");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/permission", isLoggedIn, async (req, res, next) => {
  const { productId, buyerId } = req.body;
  try {
    const buyer = await User.findOne({ where: { id: buyerId } });
    const product = await Product.findOne({ where: { id: productId } });
    const seller = await product.getUser();
    // 구매 요청을 수락한 계정의 id가 상품 판매자의 id와 같다면
    if (seller.id != req.user.id) {
      return res.status(401).send("해당 상품의 판매자가 아닙니다.");
    }
    const contract_address = await Deployer.deployContract(
      seller.privatekey, // seller
      buyer.walletAddress, //buyer
      productId,
      product.price
    );
    Transaction.create({
      buyerId: buyerId,
      contractAddress: contract_address,
      productId: productId,
    });
    Product.update({ status: "permitted" }, { where: { id: productId } });
    return res.status(200).send("구매요청 수락 완료");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete("/request/:id", isLoggedIn, async (req, res, next) => {
  const requestId = req.params.id;
  try {
    await TransactionRequest.destroy({ where: { id: requestId } });
    res.status(200).send("제거완료");
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

router.get("/permission", isLoggedIn, async (req, res, next) => {
  const sellerId = req.user.id;
  const seller = await User.findOne({ where: { id: sellerId } });
  const permittedProducts = await seller.getProducts({
    where: { status: "permitted" },
    include: { model: Transaction, attributes: ["buyerId", "contractAddress"] },
  });
  const buyers = await Promise.all(
    permittedProducts.map(async (product) => {
      const buyer = await User.findOne({
        where: { id: product.Transaction.buyerId },
        attributes: ["email", "nick", "snsId"],
      });
      const txState = await connectContract.getCurrentState(
        product.Transaction.contractAddress
      );
      return { ...product.dataValues, buyer: buyer, txState: txState };
    })
  );
  res.status(200).send(buyers);
});

module.exports = router;
