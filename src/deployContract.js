const ethers = require("ethers");
const fs = require("fs");

const RPC_SERVER_ADDR = "HTTP://127.0.0.1:7545"; // 개발 중이므로 로컬 ganache address 이용 => 추후 롭슨 테스트넷이나 메인넷 주소로 변경 요망
let contractABI = JSON.parse(fs.readFileSync("./contractInfo/Trade.json"));
let bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000c9238038062000c928339818101604052810190620000379190620001aa565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550816002819055508060038190555060006004819055506000600560006101000a81548160ff02191690836004811115620000f757620000f662000206565b5b021790555050505062000235565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000137826200010a565b9050919050565b62000149816200012a565b81146200015557600080fd5b50565b60008151905062000169816200013e565b92915050565b6000819050919050565b62000184816200016f565b81146200019057600080fd5b50565b600081519050620001a48162000179565b92915050565b600080600060608486031215620001c657620001c562000105565b5b6000620001d68682870162000158565b9350506020620001e98682870162000193565b9250506040620001fc8682870162000193565b9150509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b610a4d80620002456000396000f3fe6080604052600436106100915760003560e01c80637150d8ae116100595780637150d8ae1461014a578063a035b1fe14610175578063d8d79700146101a0578063ea8a1af0146101be578063f9fb452f146101c857610091565b806308551a5314610096578063234d442b146100c15780632acdbd8a146100cb578063367e4411146100f6578063526ff16f1461011f575b600080fd5b3480156100a257600080fd5b506100ab6101f3565b6040516100b891906106e1565b60405180910390f35b6100c9610217565b005b3480156100d757600080fd5b506100e06103eb565b6040516100ed9190610773565b60405180910390f35b34801561010257600080fd5b5061011d600480360381019061011891906107c9565b6103fe565b005b34801561012b57600080fd5b5061013461048b565b6040516101419190610805565b60405180910390f35b34801561015657600080fd5b5061015f610491565b60405161016c91906106e1565b60405180910390f35b34801561018157600080fd5b5061018a6104b7565b6040516101979190610805565b60405180910390f35b6101a86104bd565b6040516101b5919061083b565b60405180910390f35b6101c661058e565b005b3480156101d457600080fd5b506101dd61069a565b6040516101ea9190610805565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102a7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161029e906108b3565b60405180910390fd5b6000600454036102ec576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e39061091f565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f19350505050158015610354573d6000803e3d6000fd5b50600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f193505050501580156103bd573d6000803e3d6000fd5b506004600560006101000a81548160ff021916908360048111156103e4576103e36106fc565b5b0217905550565b600560009054906101000a900460ff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461045657600080fd5b806004819055506002600560006101000a81548160ff02191690836004811115610483576104826106fc565b5b021790555050565b60045481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60035481565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614801561051d575060035434145b61055c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105539061098b565b60405180910390fd5b6001600560006101000a81548160ff02191690836004811115610582576105816106fc565b5b02179055506001905090565b600060048111156105a2576105a16106fc565b5b600560009054906101000a900460ff1660048111156105c4576105c36106fc565b5b03610604576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105fb906109f7565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f1935050505015801561066c573d6000803e3d6000fd5b506003600560006101000a81548160ff02191690836004811115610693576106926106fc565b5b0217905550565b60025481565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006106cb826106a0565b9050919050565b6106db816106c0565b82525050565b60006020820190506106f660008301846106d2565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6005811061073c5761073b6106fc565b5b50565b600081905061074d8261072b565b919050565b600061075d8261073f565b9050919050565b61076d81610752565b82525050565b60006020820190506107886000830184610764565b92915050565b600080fd5b6000819050919050565b6107a681610793565b81146107b157600080fd5b50565b6000813590506107c38161079d565b92915050565b6000602082840312156107df576107de61078e565b5b60006107ed848285016107b4565b91505092915050565b6107ff81610793565b82525050565b600060208201905061081a60008301846107f6565b92915050565b60008115159050919050565b61083581610820565b82525050565b6000602082019050610850600083018461082c565b92915050565b600082825260208201905092915050565b7f6d73672e73656e646572206973206e6f74206275796572210000000000000000600082015250565b600061089d601883610856565b91506108a882610867565b602082019050919050565b600060208201905081810360008301526108cc81610890565b9050919050565b7f747261636b696e674e756d62657220686173206e6f74206265656e207365742e600082015250565b6000610909602083610856565b9150610914826108d3565b602082019050919050565b60006020820190508181036000830152610938816108fc565b9050919050565b7f4e6f7420656e6f75676820455448000000000000000000000000000000000000600082015250565b6000610975600e83610856565b91506109808261093f565b602082019050919050565b600060208201905081810360008301526109a481610968565b9050919050565b7f4e6f74206465706f736974207965740000000000000000000000000000000000600082015250565b60006109e1600f83610856565b91506109ec826109ab565b602082019050919050565b60006020820190508181036000830152610a10816109d4565b905091905056fea26469706673582212208abca2577e3b292362bf7bcb04fffa1e257e90239a8325e18b0977b0e834538564736f6c634300080e0033";
let provider = ethers.getDefaultProvider(RPC_SERVER_ADDR);

async function deployContract(privateKey, buyerAddress, productID, price) {
  let wallet = new ethers.Wallet(privateKey, provider);
  let factory = new ethers.ContractFactory(contractABI, bytecode, wallet);
  let contract = await factory.deploy(buyerAddress, productID, price);

  return contract.address;
}

module.exports = {
  deployContract,
};
