import { ethers } from "ethers";
import "./App.css";
import { contract_address, getContract, getProvider } from "./web3/web3";

function App() {
  // usdc = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  // matic = "0x0000000000000000000000000000000000001010"
  async function swap() {
    const tokenAddress = "0x0000000000000000000000000000000000001010";
    const amount = ethers.utils.parseUnits("2", 18);
    const tokensIn = ["0x0000000000000000000000000000000000001010"];
    const provider = getProvider();
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function approve(address spender, uint256 amount) external returns (bool)",
      ],
      signer
    );

    const tx = await tokenContract.approve(contract_address, amount, {
      gasLimit: 3000000,
    });
    await tx.wait();
    console.log("Approval successful");
    // const amountsIn = [
    //   ethers.utils.parseUnits("2", 18), // Example amount with 18 decimals
    // ];
    // const tokenOut = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

    // const contract = getContract(provider);
    // const swap = await contract.multiSwapExactInputSingle(
    //   tokensIn,
    //   amountsIn,
    //   tokenOut,
    //   { gasLimit: 3000000 }
    // );
    // await swap.wait();
    // console.log(swap);
  }
  return (
    <div className="App">
      <button onClick={swap}>Swap</button>
    </div>
  );
}

export default App;
