import { ethers } from "ethers";
import "./App.css";
import {
  contract_address,
  getContract,
  getProvider,
  tokenList,
} from "./web3/web3";
import { Button, Card, Select, TextInput } from "flowbite-react";
import { useState } from "react";

function App() {
  const [selectedTokens, setSelectedTokens] = useState([""]);
  const [amounts, setAmounts] = useState({});
  const [outputToken, setOutputToken] = useState("");

  const handleTokenSelection = (event, index) => {
    const selectedAddress = event.target.value;
    const newSelectedTokens = [...selectedTokens];
    newSelectedTokens[index] = selectedAddress;
    setSelectedTokens(newSelectedTokens);
  };

  const handleAmountChange = (event, address) => {
    const newAmounts = { ...amounts };
    newAmounts[address] = event.target.value;
    setAmounts(newAmounts);
  };

  const handleOutputTokenSelection = (event) => {
    setOutputToken(event.target.value);
  };

  const executeMultiSwap = async () => {
    console.log("Selected Tokens:", selectedTokens);
    console.log("Amounts:", amounts);
    console.log("Output Token:", outputToken);

    for (const token of selectedTokens) {
      const amount = amounts[token];
      if (amount) {
        try {
          await approveToken(token, amount);
        } catch (error) {
          console.error(`Error approving token ${token}:`, error);
          return;
        }
      }
    }
    const provider = getProvider();
    const contract = getContract(provider);

    const amountsIn = selectedTokens.map((token) => {
      const tokenInfo = tokenList.find((t) => t.address === token);
      const decimals = tokenInfo ? tokenInfo.decimals : 18; // Default to 18 if decimals not found
      return ethers.utils.parseUnits(amounts[token] || "0", decimals);
    });
    console.log(amountsIn);
    try {
      const tx = await contract.multiSwapExactInputSingle(
        selectedTokens,
        amountsIn,
        outputToken,
        { gasLimit: 3000000 }
      );
      await tx.wait();
      console.log("Transaction successful:", tx);
    } catch (error) {
      console.error("Error executing multiSwapExactInputSingle:", error);
    }
  };

  const approveToken = async (tokenAddress, amount) => {
    const provider = getProvider();
    const signer = provider.getSigner();

    const tokenABI = [
      "function approve(address spender, uint256 amount) external returns (bool)",
    ];
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    const tokenInfo = tokenList.find((t) => t.address === tokenAddress);
    const decimals = tokenInfo ? tokenInfo.decimals : 18; // Default to 18 if decimals not found

    const tx = await tokenContract.approve(
      contract_address,
      ethers.utils.parseUnits(amount, decimals),
      { gasLimit: 3000000 }
    );
    await tx.wait();
    console.log(`Approval successful for token ${tokenAddress}`);
  };

  return (
    <div className="App">
      <h1 className="text-8xl">Multi Swap</h1>
      <div className="flex justify-center items-center">
        <Card className="max-w-lg w-96 mt-10">
          <h2>Select Input Tokens and Amounts</h2>
          {selectedTokens.map((token, index) => (
            <div key={index} className="token-input">
              <Select
                onChange={(e) => handleTokenSelection(e, index)}
                value={token}
              >
                <option value="">Select Token</option>
                {tokenList.map((t) => (
                  <option key={t.address} value={t.address}>
                    {t.name}
                  </option>
                ))}
              </Select>
              <TextInput
                type="number"
                placeholder="Amount"
                value={amounts[token] || ""}
                onChange={(e) => handleAmountChange(e, token)}
              />
            </div>
          ))}
          <Button onClick={() => setSelectedTokens([...selectedTokens, ""])}>
            Add Token
          </Button>

          <h2>Select Output Token</h2>
          <Select onChange={handleOutputTokenSelection} value={outputToken}>
            <option value="">Select Token</option>
            {tokenList
              .filter((t) => !selectedTokens.includes(t.address))
              .map((t) => (
                <option key={t.address} value={t.address}>
                  {t.name}
                </option>
              ))}
          </Select>

          <Button onClick={executeMultiSwap}>Swap</Button>
        </Card>
      </div>
    </div>
  );
}

export default App;
