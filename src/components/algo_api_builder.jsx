import React, { useState, useEffect } from 'react';
import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';
import '../App.css';
import Navbar from "./navbar2";

const Algo_api_builder = () => {
  const [userWalletAddress, setUserWalletAddress] = useState(null);
  const [algodClient, setAlgodClient] = useState(null);
  const [abi, setAbi] = useState('');
  const [appId, setAppId] = useState('');
  const [writeFunctions, setWriteFunctions] = useState([]);
  const [readFunctions, setReadFunctions] = useState([]);
  const [network, setNetwork] = useState(null);
  const [peraWallet, setPeraWallet] = useState(new PeraWalletConnect());
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const algodServer = 'https://mainnet-api.algonode.cloud';
    const algodToken = '';
    const algodPort = '';

    const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    setAlgodClient(client);

    const savedAddress = window.localStorage.getItem('userWalletAddress');
    if (savedAddress) {
      setUserWalletAddress(savedAddress);
    }

    peraWallet.reconnectSession()
      .then(accounts => {
        if (accounts.length > 0) {
          setUserWalletAddress(accounts[0]);
          window.localStorage.setItem('userWalletAddress', accounts[0]);
        }
      })
      .catch(error => {
        console.error(error);
      });

  }, [peraWallet]);

  const handleConnectWallet = async () => {
    try {
      const newAccounts = await peraWallet.connect();
      const selectedAccount = newAccounts[0];
      setUserWalletAddress(selectedAccount);
      window.localStorage.setItem('userWalletAddress', selectedAccount);
    } catch (error) {
      console.error(error);
      alert('Failed to connect wallet');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const parsedAbi = JSON.parse(abi);
      setAbi(parsedAbi);
      if (appId) {
        setWriteFunctions(parsedAbi.filter(item => item.type === 'appl' && (item.stateMutability !== 'view' && item.stateMutability !== 'pure')));
        setReadFunctions(parsedAbi.filter(item => item.type === 'appl' && (item.stateMutability === 'view' || item.stateMutability === 'pure')));
      }
    } catch (error) {
      alert('Invalid ABI or App ID');
    }
  };

  const handleWriteFunction = async (functionName, inputs) => {
    try {
      const params = await algodClient.getTransactionParams().do();
      const txn = algosdk.makeApplicationNoOpTxnFromObject({
        from: userWalletAddress,
        appIndex: parseInt(appId),
        appArgs: [algosdk.encodeUint64(functionName), ...inputs.map(input => algosdk.encodeUint64(input))],
        suggestedParams: params
      });
      const signedTxn = await peraWallet.signTransaction(txn.toByte());
      const response = await algodClient.sendRawTransaction(signedTxn).do();
      console.log('Transaction sent with ID:', response.txId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReadFunction = async (functionName, inputs) => {
    try {
      const result = await algodClient.getApplicationByID(parseInt(appId)).do();
      alert(JSON.stringify(result));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App bg-white pb-64 pt-5">
      <Navbar email={userEmail} />
      <h1 className='text-center my-10 text-4xl font-medium'>Get Algorand API List</h1>
      <div className="flex justify-center gap-6 flex-wrap my-7">
        <button className="connect_wallet" onClick={handleConnectWallet}>Connect Wallet!</button>
        <div id="wallet-info" className="wallet-info py-3 px-4 border-2">
          <span className="address text-wrap">Wallet Address: {userWalletAddress}</span><br />
        </div>
      </div>
      <div className='w-full flex flex-col justify-center items-center'>
        <form className="form-container w-full sm:w-[80%] md:w-[70%] lg:w-[50%] bg-slate-600 flex flex-col" onSubmit={handleSubmit}>
          {/* <label>Paste Contract ABI:</label>
          <input
            className="form-input"
            type="text"
            value={abi}
            onChange={(e) => setAbi(e.target.value)}
          /> */}
          <label>Paste App ID:</label>
          <input
            className="form-input"
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
          />
          <button className="form-submit mx-auto" type="submit">Submit</button>
        </form>
      </div>
      <div id="container" className="container">
        {writeFunctions.map((func, idx) => (
          <div className="group" key={idx}>
            <button onClick={() => handleWriteFunction(func.name, func.inputs.map(input => document.getElementById(`write-${func.name}-${input.name}`).value))}>
              {func.name}
            </button>
            {func.inputs.map((input, i) => (
              <input
                key={i}
                id={`write-${func.name}-${input.name}`}
                type="text"
                placeholder={`${input.type} ${input.name}`}
              />
            ))}
          </div>
        ))}
        {readFunctions.map((func, idx) => (
          <div className="group" key={idx}>
            <button className="read_button" onClick={() => handleReadFunction(func.name, func.inputs.map(input => document.getElementById(`read-${func.name}-${input.name}`).value))}>
              {func.name}
            </button>
            {func.inputs.map((input, i) => (
              <input
                key={i}
                id={`read-${func.name}-${input.name}`}
                type="text"
                placeholder={`${input.type} ${input.name}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Algo_api_builder;
