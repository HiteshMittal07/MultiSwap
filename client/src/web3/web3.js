import { ethers, providers } from "ethers";
import abi from "../abis/MultiSwap.json";
export const contract_address = "0x2599355bb17DFE1f90cCb08FFC6873837572Bb72";

export function getProvider() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
}
export async function getContract() {
  const provider = getProvider();
  const signer = await provider.getSigner();
}
