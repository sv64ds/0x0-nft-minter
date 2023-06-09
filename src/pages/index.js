import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import {ethers} from 'ethers';
import ABI from '../contracts/contractABI.json';
import Web3Modal from 'web3modal';

const NFTContractAddress = "0x1cE2eBD876Ae2C72bf4e5384F12eb2cff3c96636";

export default function Home() {
  const [nfts, setNfts] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const web3ModalRef = useRef();
  
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();
    
    if(chainId !== 97) {
      window.alert('Change network to BNB Testnet');
    }
    
    if(needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    
    return web3Provider;
  }
  
  const mintNFT = async () => {
    try {
      setErrorMessage('')
      const signer = await getProviderOrSigner(true);
      const nftContract = new ethers.Contract(NFTContractAddress, ABI, signer);
      
      const amountToSend = ethers.utils.parseEther('0.001'); // 1 Ether
      
      const tx = await nftContract.mint({value: amountToSend});
      alert("Success! Please wait for transaction to be processed");
      await tx.wait();
    } catch (error) {
      setErrorMessage(error.reason)
    }
  };
  
  const getNFTs = async () => {
    try {
      setErrorMessage('')
      const signer = await getProviderOrSigner(true);
      const nftContract = new ethers.Contract(NFTContractAddress, ABI, signer);
      
      const nftBalance = await nftContract.balanceOf(await signer.getAddress());
      setNfts(Number(nftBalance));
    } catch (error) {
      setErrorMessage(error.reason)
    }
  }
  
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 97,
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    } else {
      getNFTs();
    }
    

  }, [walletConnected])
  
  const renderButton = () => {
    if(walletConnected) {
      return (
        <div>
          <button className={styles.btn} onClick={mintNFT}>Mint</button>
        </div>
        )
      }
    }
    
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
      {walletConnected ? (
        <div>You have {nfts} NFTs.</div>
        ) : (
          <button className={styles.btn} onClick={connectWallet}>
          Connect wallet
          </button>
          )}
          
          
          {renderButton()} 

          {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>}
          
          
          </div>
          </main>
          </>
          )
        }
        