import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Navbar } from "flowbite-react";
import { getProvider, requestAccounts, switchNetwork } from "./web3/web3";
const Header = (props) => {
  const [display, setDisplay] = useState(null);
  const [account, setAccount] = useState(null);
  const truncateWalletAddress = async (address, length = 4) => {
    if (!address) return "";
    const start = address.substring(0, length);
    const end = address.substring(address.length - length);
    setAccount(`${start}...${end}`);
  };
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("first install the metamask");
      window.location.href = "https://metamask.io/download/";
      return;
    }
    try {
      await switchNetwork("137");
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = getProvider();
      const address = await requestAccounts(provider);
      truncateWalletAddress(address);
      toast.success("connected successfully");
      props.setConnected(true);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const connect = async () => {
      const provider = getProvider();
      const address = await requestAccounts(provider);
      truncateWalletAddress(address);
      props.setConnected(true);
    };
    connect();
  }, []);

  return (
    <Navbar fluid rounded className="bg-black shadow-lg text-white mb-10">
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white ml-20">
          MultiSwap
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 mr-20">
        {!account ? (
          <Button color="dark" onClick={connectWallet}>
            Connect Wallet
          </Button>
        ) : (
          <Button color="dark" onClick={connectWallet}>
            {account}
          </Button>
        )}
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
};

export default Header;
