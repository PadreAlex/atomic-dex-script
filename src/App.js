import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useState, useEffect } from "react";
function App() {
  useEffect(() => {
    var loadScript = function (src) {
      var tag = document.createElement("script");
      tag.async = false;
      tag.src = src;
      tag.id = "adScript";
      var body = document.getElementsByTagName("body")[0];
      body.appendChild(tag);
    };

    loadScript(
      "https://cdn.jsdelivr.net/gh/Getit-Tech/getit-script@main/getit-script-experimental.js"
    );
    document.getElementById("adScript").addEventListener("load", () => {
      window.getitAdScript.renderAdPlugin(
        {
          apiKey:
            "DhoFm82C6XN2bbs3tnuGTIVF3IHedbNhYl5dqoCZVrrKajMePFbpLUZtd4LO17xbh36NjLbNZynbvri3OzOwiMfwJIjVH20Le2QdhS71QEpxJ71Hj7zZf1M1r0qbaZCx",
          walletConnected: "",
          slotId: "1",
        },
        "adContainer"
      );
    });
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
      <div id="adContainer"></div>
      <div className="mainWindow">
        <Swap isConnected={isConnected} address={address} />
      </div>
    </div>
  );
}

export default App;
