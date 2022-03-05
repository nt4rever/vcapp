import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contract';

function App() {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract('Faucet', provider);

      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        });
      } else {
        console.log("please install metamask");
      }
    }
    loadProvider();
  }, []);

  // useEffect(() => {
  //   const getAccount = async () => {
  //     const accounts = await web3Api.web3.eth.getAccounts();
  //     setAccount(accounts[0]);
  //   }
  //   web3Api.web3 && getAccount()
  // }, [web3Api.web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setAccount(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }
    web3Api.contract && loadBalance()
  }, [web3Api]);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Currrent balance: <strong>{balance} ETH</strong>
        </div>
        <button className="button is-primary mr-3">Donate</button>
        <button className="button is-danger mr-3">Donate</button>
        <button className='button is-dark'
          onClick={() => {
            web3Api.provider.request({ method: 'eth_requestAccounts' })
          }}
        >Connect Wallet</button>
        <span>
          <p>
            <strong>Account Address:</strong>
            {
              account ? account : 'Account denied!'
            }
          </p>
        </span>

      </div>
    </div >
  );
}

export default App;
