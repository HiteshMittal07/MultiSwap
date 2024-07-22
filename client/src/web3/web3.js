import { ethers } from "ethers";
import abi from "../abis/MultiSwap.json";
export const contract_address = "0x88C4aF20281dBF1bBd36778cABFd2825b0b8c59d";

export const tokenList = [
  {
    address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
    name: "LINK",
    decimals: 18,
  },
  {
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    name: "WETH",
    decimals: 18,
  },
  {
    address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
    name: "UNI",
    decimals: 18,
  },
  {
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    name: "USDC",
    decimals: 6,
  },
  {
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    name: "USDT",
    decimals: 6,
  },
  {
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    name: "DAI",
    decimals: 18,
  },
  {
    address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    name: "WBTC",
    decimals: 8,
  },
];
export function getProvider() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
}
export const getContract = (provider) => {
  const contractABI = abi.abi;
  const signer = provider.getSigner();
  return new ethers.Contract(contract_address, contractABI, signer);
};
