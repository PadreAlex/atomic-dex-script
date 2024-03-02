import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useState, useEffect } from "react";
import  "./test.js";
function App() {
  useEffect(() => {

   window.getitAdScript.renderAdPlugin(
      {
        apiKey:
          "JoIBr3NRNYImiL8qaRxlxXFaMjvxoaCBMN1OiAvKNYyclky8WixRnScHjLNPIZrANfMpvZvcepsWbjXbH9YxOeul17siKT9poug56wFmxlaLi3Xh2IYQoq167MYaPFbJ",
        walletConnected: "",
        slotId: "0",
      },
      "adContainer"
    );
  }, []);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <div className="App">
      <Header
        connect={connect}
        disconnect={disconnect}
        isConnected={isConnected}
        address={address}
      />
      <div id='adContainer'></div>
      <div className="mainWindow">
        <Swap isConnected={isConnected} address={address} />
      </div>
    </div>
  );
}

export default App;
