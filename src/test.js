// // 필요한 .js 파일 import하기
// const Trade = require("./connectContract.js"); // 배포된 contract와 상호작용
// const Deployer = require("./deployContract.js"); // contract 배포

// (async function () {
//   // contract 배포 함수
//   let privateKey = "0x..."; // 판매자, 즉 contract 배포자의 지갑 private Key
//   let buyerAddr = "0x..."; // 구매자의 지갑 Address(public key)
//   let productID = 1; // DB상의 ID
//   let price = 10000; // 단위는 wei
//   let deployedContractAddr = await Deployer.deployContract(
//     privateKey,
//     buyerAddr,
//     productID,
//     price
//   );

//   // [getter function들 이용]
//   // 모든 getter fuction은 접근하려는 contract의 address를 parameter로 받는다
//   let sellerAddr = await Trade.getSellerAddr(deployedContractAddr);
//   let buyerAddr = await Trade.getBuyerAddr(deployedContractAddr);
//   let trackingNumber = await Trade.getTrackingNumber(deployedContractAddr);

//   // makePayment(contractAddress, privateKey, Price)
//   // 구매자가 상품가격만큼의 송금할 때 사용하는 function.
//   // 이 함수는 구매자만이 call 해야 한다. 다른 이가 call 하면 error return
//   let buyerPrivateKey = "0x..."; // 구매자의 privateKey
//   await Trade.makePayment(deployedContractAddr, buyerPrivateKey);

//   // setTrackingNumber(contractAddress, privatekey, trackingNumber)
//   // 판매자가 상품 배송 후에 송장번호 입력할 때 사용하는 function
//   // 판매자만이 call 할 수 있다.
//   let sellerPrivateKey = "0x..."; // 판매자(contract 배포자)의 private Key
//   let newTrakcingNumber = 1234; //  example.
//   await Trade.sellerPrivateKey(deployedContractAddr, sellerPrivateKey);

//   // completeTrade(contractAddress, privateKey)
//   // 구매자가 상품을 받고 구매확정 시에 사용하는 function
//   // 구매자만이 call할 수 있다.
//   let callerPrivateKey = "0x...";
//   await Trade.completeTrade(deployedContractAddr, callerPrivateKey);

//   // cancel(contractAddress, privateKey)
//   // 거래 취소할 때 사용하는 function
//   // 구매자, 판매자 둘 다 call 가능
//   await Trade.cancel(deployedContractAddr, callerPrivateKey);
// })();
