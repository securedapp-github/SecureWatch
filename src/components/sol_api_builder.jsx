import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import '../App.css';
import Navbar from "./navbar2";

const ApiBuilderSolana = () => {
  const [userWalletAddress, setUserWalletAddress] = useState(null);
  const [programId, setProgramId] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [network, setNetwork] = useState('devnet'); // Default network
  const [solanaConnection, setSolanaConnection] = useState(null);
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    setSolanaConnection(connection);
  }, [network]);

  const handleConnectWallet = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        setUserWalletAddress(response.publicKey.toString());
        window.localStorage.setItem('userWalletAddress', response.publicKey.toString());
      } else {
        alert('Please install the Phantom wallet');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!programId) {
        alert('Program ID is required');
        return;
      }
      // Assuming the program ID is a valid Solana public key
      const programPublicKey = new PublicKey(programId);
      // Fetch instructions for the program (placeholder logic)
      const fetchedInstructions = await fetchProgramInstructions(programPublicKey);
      setInstructions(fetchedInstructions);
    } catch (error) {
      alert('Invalid Program ID');
    }
  };

  const fetchProgramInstructions = async (programId) => {
    // Replace with actual logic to fetch instructions
    return [
      {
        name: 'Sample Instruction',
        accounts: [{ pubkey: new PublicKey('11111111111111111111111111111111') }],
        data: 'Sample Data',
      },
    ];
  };

  const handleExecuteInstruction = async (instruction) => {
    try {
      if (!solanaConnection || !userWalletAddress) return;

      const transaction = new Transaction();
      transaction.add(
        new TransactionInstruction({
          programId: new PublicKey(programId),
          keys: instruction.accounts,
          data: Buffer.from(instruction.data, 'base64'),
        })
      );

      const signAndSendTransaction = async () => {
        const { signature } = await window.solana.signAndSendTransaction(transaction);
        await solanaConnection.confirmTransaction(signature);
      };

      signAndSendTransaction();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App bg-white pb-64 pt-5">
      <Navbar email={userEmail} />
      <h1 className='text-center my-10 text-4xl font-medium'>Get Solana Program API List</h1>
      <div className="flex justify-center gap-6 flex-wrap my-7">
        <button className="connect_wallet" onClick={handleConnectWallet}>Connect Wallet!</button>
        <div id="wallet-info" className="wallet-info py-3 px-4 border-2">
          <span className="address text-wrap">Wallet Address: {userWalletAddress}</span><br />
          <span className="network text-wrap">Network: {network}</span>
        </div>
      </div>
      <div className='w-full flex flex-col justify-center items-center'>
        <form className="form-container w-full sm:w-[80%] md:w-[70%] lg:w-[50%] bg-slate-600 flex flex-col" onSubmit={handleSubmit}>
          <label>Paste Program ID:</label>
          <input
            className="form-input"
            type="text"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          />
          <button className="form-submit mx-auto" type="submit">Submit</button>
        </form>
      </div>
      <div id="container" className="container">
        {instructions.map((instr, idx) => (
          <div className="group" key={idx}>
            <button onClick={() => handleExecuteInstruction(instr)}>
              {instr.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiBuilderSolana;
