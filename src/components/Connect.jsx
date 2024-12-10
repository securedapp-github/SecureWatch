import React, { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  polygonAmoy,sepolia
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "",
  projectId: "252ad358c903d28a5b6610ef5c98dac9",
  chains: [polygonAmoy,sepolia],
  ssr: true, // If your dApp uses server-side rendering (SSR)
});
const queryClient = new QueryClient();


const Connect = ({ onWalletAddressUpdate }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (connected && walletAddress) {
      // Update the wallet address in the parent component (App.js)
      onWalletAddressUpdate(walletAddress);
    }
  }, [connected, walletAddress, onWalletAddressUpdate]);
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <div className=" flex justify-center">
                          <button onClick={openConnectModal} className="text-white text-xs lg:text-base bg-transparent backdrop-filter backdrop-blur-2xl hover:scale-95 transform transition-transform duration-100 hover:shadow-xl form-submit p-3 px-6 rounded-xl md:text-base border-2 brandy-font border-white custom-border-radius flex justify-center items-center">
                            Connect
                          </button>
                        </div>
                      );
                    }

                    if (chain?.unsupported) {
                      return (
                        <button
                          className=" text-white broge-font bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 hover:bg-gradient-to-l hover:shadow-xl p-3 rounded text-[8px] md:text-xs font-medium border-b-2 border-white"
                          onClick={openChainModal}
                          type="button"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          className="text-white text-xs w-full bg-transparent backdrop-blur-2xl backdrop-filter hover:scale-105 transform transition-transform duration-100 hover:shadow-xl form-submit hover:bg-gradient-to-l p-3 px-2 rounded bricolage-font border-2"
                          onClick={openChainModal}
                          type="button"
                        >
                          {chain?.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: "hidden",
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain?.name}
                        </button>

                        <button
                          className="text-white text-xs w-full bg-transparent backdrop-blur-2xl backdrop-filter hover:scale-105 transform transition-transform duration-100 hover:shadow-xl form-submit hover:bg-gradient-to-l p-3 px-2 rounded bricolage-font border-2"
                          onClick={openAccountModal}
                          type="button"
                        >
                          {account?.displayName}
                          {account?.displayBalance ? ` (${account.displayBalance})` : ""}
                        </button>

                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Connect;