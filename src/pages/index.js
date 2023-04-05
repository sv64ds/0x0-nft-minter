import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import {ethers} from 'ethers';
import ABI from '../contracts/contractABI.json';

const NFTContractAddress = "0x494d20908C3DD605221CE6c2211c4320725CF7d4";

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    setConnected(window.ethereum.selectedAddress)
  }, [])
  
  
  
  const connectAccount = async () => {
    if(window !== undefined) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length === 0) {
        alert("Aborted");
      } else {
        setConnected(true);
      }
    }
  };
  
  if (!connected) {
    return <button onClick={connectAccount}>Connect Metamask</button>;
  }
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const airdropTokenContract = new ethers.Contract(
    NFTContractAddress,
    ABI,
    signer
    );
    console.log(airdropTokenContract);
    
    const mintNFT = async () => {
      try {
        
        const amountToSend = ethers.utils.parseEther('0.001'); // 1 Ether
        const opts = {
          value: amountToSend,
        };
        const tx = await airdropTokenContract.mint(opts);
        alert("Success! Please wait for transaction to be processed");
        await tx.wait();
      } catch (error) {
        alert("Something went wrong :( More details below.");
        setErrorMessage(error.message);
      }
    };
    
    return (
      <>
      <Head>
      <title>0x0 NFT Collection</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <div className={styles.description}>
      ku
      <button onClick={mintNFT}>mint</button>
      </div>
      </main>
      </>
      )
    }
    