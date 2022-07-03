// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Trade {
    enum TradeState {
        Start,
        Proceeding,
        Shipping,
        Cancel,
        Complete
    }
    
    address payable public seller; // 판매자 주소
    address payable public buyer;  // 구매자 주소
    uint256 public productID; // 외부 DB상에서의 상품 ID
    uint256 public price;   // 상품 가격
    uint256 public trackingNumber; // 송장번호
    TradeState public currentTradeState; // 거래 상태

    constructor(address _buyer, uint256 _productID, uint256 _price) {
        seller = payable(msg.sender); // 컨트랙트 호출한 사람이 판매자
        buyer = payable(_buyer);
        productID = _productID;
        price = _price;
        trackingNumber = 0; // 거래 시작시에는 송장번호 없음. 판매자가 입력함
        currentTradeState = TradeState.Start; // 컨트랙트 배포 시점에 거래가 시작되는 것
    }

    /**
     * @dev 판매자가 송장번호를 등록하는 function
     * @param _trackingNumber 등록할 송장번호
     */
    function setTrackingNumber(uint256 _trackingNumber) public {
        require(msg.sender == seller); // 판매자가 아닌 사람의 호출은 제외시킨다.
        trackingNumber = _trackingNumber;
        currentTradeState = TradeState.Shipping; // 배송중으로 상태 변경

    }

    function makePayment() public payable returns (bool result) {
        require(msg.sender == buyer && msg.value == price, "Not enough ETH"); // 상품가격만큼 송금했어야 함
        currentTradeState = TradeState.Proceeding; // 진행중으로 상태 변경
        return true;
    }

    function completeTrade() public payable {
        require(msg.sender == buyer, "msg.sender is not buyer!"); // 구매자만이 해당 함수 호출 가능 && 상품 발송한 경우에만 거래성사 가능
        require(trackingNumber != 0, "trackingNumber has not been set.");

        seller.transfer(price); // 판매자에게 상품금액 전송
        buyer.transfer(address(this).balance); // 혹시라도 컨트랙트 addr에 남은 금액을 구매자에게 전송
        currentTradeState = TradeState.Complete;
    }

    /**
     * @dev 거래를 취소하는 function
     */
    function cancel() public payable {
        require(currentTradeState != TradeState.Start, "Not deposit yet");
        buyer.transfer(address(this).balance);
        currentTradeState = TradeState.Cancel; // 거래상태 '취소'로 변경
    }

    /**
     * @dev 송금수수료 없이 tranfer하는 function
     * @param addr 송금할 주소
     * @param amount 송금할 양
     */
    function transferWithoutPayingFee(address payable addr, uint256 amount) internal {
        addr.transfer(amount);
    }

    
}
