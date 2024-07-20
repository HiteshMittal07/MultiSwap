import { ethers } from "ethers";
import abi from "../abis/MultiSwap.json";
export const contract_address = "0x9536e10f579e3fB7dC5385f4032b0F75bDebdBa0";

export function getProvider() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
}
export const getContract = (provider) => {
  const contractABI = abi.abi;
  const signer = provider.getSigner();
  return new ethers.Contract(contract_address, contractABI, signer);
};
