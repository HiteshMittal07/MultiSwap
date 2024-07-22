import { ethers } from "ethers";
import "./App.css";
import {
  contract_address,
  getContract,
  getProvider,
  requestAccounts,
  tokenList,
} from "./web3/web3";
import { Button, Card, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import Header from "./Header";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [selectedTokens, setSelectedTokens] = useState([""]);
  const [amounts, setAmounts] = useState({});
  const [balances, setBalances] = useState({});
  const [outputToken, setOutputToken] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    async function fetchBalances() {
      const provider = getProvider();
      const signer = provider.getSigner();
      const address = await requestAccounts(provider);
      setWalletAddress(address);

      const balances = {};
      for (const token of tokenList) {
        const tokenContract = new ethers.Contract(
          token.address,
          ["function balanceOf(address owner) view returns (uint256)"],
          provider
        );

        const balance = await tokenContract.balanceOf(address);
        balances[token.address] = ethers.utils.formatUnits(
          balance,
          token.decimals
        );
      }
      setBalances(balances);
    }

    fetchBalances();
  }, []);

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

  const handleMaxButtonClick = (address) => {
    const newAmounts = { ...amounts };
    newAmounts[address] = balances[address] || "0";
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
      <Header />
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
              {balances[token] && (
                <div className="flex items-center mt-2">
                  <button
                    className="ml-2 bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() => handleMaxButtonClick(token)}
                  >
                    Max
                  </button>
                  <p className="text-sm text-gray-500 mt-1 ml-2">
                    Balance: {balances[token]}
                  </p>
                </div>
              )}
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
