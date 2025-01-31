import logo from "./logo.svg";
import "./App.css";
import * as React from "react";
import { styled } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import "@ethersproject/shims";
import { ethers } from "ethers";
require('dotenv').config();



const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledButton = withStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 48,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);

const SaleDetails = ({ id, supply, presale, liquidity, softcap }) => {
  const ts = { textAlign: "left", marginLeft: "10vw" };
  return (
    <div>
      <p style={ts}>Sale ID: {id}</p>
      <p style={ts}>Total Supply: {supply}</p>
      <p style={ts}>Tokens for Presale: {presale}</p>
      <p style={ts}>Tokens for Liquidity: {liquidity}</p>
      <p style={ts}>Softcap: {softcap} ETH</p>
    </div>
  );
};

var provider;
var signer;
var accounts;
//test
async function connect() {
  try {
    await window.ethereum.enable();
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    accounts = await provider.send("eth_requestAccounts", []);
  } catch (e) {
    console.log("Could not get a wallet connection");
    return;
  }

  var balance = await provider.getBalance(await signer.getAddress());
  console.log("Account:", await signer.getAddress());

  document.querySelector("#address").textContent = await signer.getAddress();
  document.querySelector("#balance").textContent =
    ethers.utils.formatEther(balance);

  if ((await signer.getChainId()) == 56) {
    console.log("Connected to BSC mainnet");
    document.querySelector("#chain").textContent = "BSC Mainnet";
  } else if ((await signer.getChainId()) == 97) {
    console.log("Connected to BSC testnet");
    document.querySelector("#chain").textContent = "BSC Testnet";
  } else {
    console.log("Unknwonn chain");
    document.querySelector("#chain").textContent = "Unknown chain";
  }

  await AnyTokenConnection();
}

// variable to save the contract object
var AnyTokenContract;
var connectedTokenAddress;
// takes a contract address, creates a contract object and uses it to get the name, decimals, etc
//*******************************
// HARCODE THE TOKEN ADDRESS HERE
//*******************************

async function AnyTokenConnection() {

  var input_address = process.env.INPUT_ADDRESS;

  console.log("--> CONNECTION TO BEP-20 START...");
  //This is not the real ABI this are just some of the standarts that we need
  const ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address recipient, uint256 amount) external returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];

  //here the contract object is created
  const address = input_address;
  try {
    AnyTokenContract = new ethers.Contract(address, ABI, signer);
    connectedTokenAddress = input_address;
    //Now that we have the contract object and the ABI we can call functions
    const name = await AnyTokenContract.name();
    const symbol = await AnyTokenContract.symbol();
    const decimals = await AnyTokenContract.decimals();
    const balance = ethers.utils.formatEther(
      await AnyTokenContract.balanceOf(await signer.getAddress())
    );
    console.log("Name: ", name);
    console.log("Symbol: ", symbol);
    console.log("Decimals", decimals);
    console.log("Balance", balance);
    document.querySelector(".t_name").textContent = name;
    document.querySelector("#t_symbol").textContent = symbol;
    document.querySelector("#t_decimals").textContent = decimals;
    document.querySelector("#t_balance").textContent = balance;
    console.log("-- fend --");
  } catch (e) {
    console.log(
      "No connection stablished, check wallet connection or token address"
    );
  }
}

// variable to save the contract object
var PreSaleContract;
var PreSaleAddress;
var presaleOpen;
// takes a contract address, creates a contract object and uses it to get the name, decimals, etc
async function PreSaleConnection() {
  var input_address = document.querySelector("#presale_address_input").value;
  console.log(input_address)
  if (input_address == "") {
    input_address = process.env.INPUT_ADDRESS;
  }
  console.log("--> CONNECTION TO PRESALE CONTRACT...");
  console.log(input_address);

  //This is not the real ABI this are just some of the standarts that we need
  const ABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cap",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_minBNB",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxBNB",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "EmergencyWithdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "SeeAddressContribution",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cap_",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "contributions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount_",
          "type": "uint256"
        }
      ],
      "name": "depositPreSaleTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "finalize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isOpen",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "liqTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "liqTokens_",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxBNB",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minBNB",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "moneyRaised",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner_",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "preSaleCompleted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "saleTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "seeAllowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "seeBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to_",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount_",
          "type": "uint256"
        }
      ],
      "name": "sendTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "send_BNB_back",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenAddress_",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr_",
          "type": "address"
        }
      ],
      "name": "tokenAllocation",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "uniswapV2Router",
      "outputs": [
        {
          "internalType": "contract IUniswapV2Router02",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  try {
    //here the contract object is created
    const address = input_address;
    PreSaleContract = new ethers.Contract(address, ABI, signer);

    //Now that we have the contract object and the ABI we can call functions
    const owner = await PreSaleContract.owner_();
    const bnbRaised = ethers.utils.formatEther(
      await PreSaleContract.moneyRaised()
    );
    const status = await PreSaleContract.preSaleCompleted();
    const tokenAddress = await PreSaleContract.tokenAddress_();
    const minBNB = ethers.utils.formatEther(await PreSaleContract.minBNB());
    const maxBNB = ethers.utils.formatEther(await PreSaleContract.maxBNB());
    const cap = ethers.utils.formatEther(await PreSaleContract.cap_());
    const isOpen = await PreSaleContract.isOpen();
    
    const myContribution = ethers.utils.formatEther(
      await PreSaleContract.SeeAddressContribution(await signer.getAddress())
    );
    console.log("isOpen: ", isOpen);
    console.log("preSaleCompleted: ", status);
    console.log("bnbRaised: ", bnbRaised);
    console.log("cap: ", cap);
    console.log("minBNB: ", minBNB);
    console.log("maxBNB: ", maxBNB);
    console.log("myContribution: ", myContribution);
    console.log("tokenAddress: ", tokenAddress);
    console.log("owner: ", owner);

    document.querySelector("#bnbRaised").textContent = bnbRaised;
    document.querySelector("#cap").textContent = cap;
    document.querySelector("#minBNB").textContent = minBNB;
    document.querySelector("#maxBNB").textContent = maxBNB;
    document.querySelector("#myContribution").textContent = myContribution;

    const myAllocation = myContribution != 0 ? 250000: 0




    
    document.querySelector("#myAllocation").textContent = myAllocation;
    console.log("myAllocation: ", myAllocation);
    presaleOpen = isOpen;

    PreSaleAddress = input_address;

    console.log("-- fend --");
  } catch (e) {
    console.log(
      "No connection stablished, check wallet connection or token/presale address"
    );
    console.log(e);
  }
}

async function disconnectContracts() {
  AnyTokenContract = "";
  PreSaleContract = "";
}

async function depositBNB() {
  //bnb = ethers.utils.parseEther( bnb_ )
  await disconnectContracts();
  await PreSaleConnection();

  var temp_value = document.querySelector("#presale_bnb_input").value;
  console.log(temp_value);
  try {
    console.log(await PreSaleContract.owner_());
    const sent = await PreSaleContract.deposit({
      value: ethers.utils.parseEther(temp_value),
    });
    const receipt = await sent.wait();
    console.log("Status: ", receipt["status"]);
    console.log("Hash: ", receipt["transactionHash"]);
    if (receipt["status"] == 1) {
      document.querySelector("#load_approve").textContent = "Success";
      console.log(":)");
    } else {
      document.querySelector("#load_approve").textContent = "Failed";
    }
  } catch (e) {
    console.log("No deposit done");
    console.log(e);
  }
}

async function claimTokens() {
  await disconnectContracts();
  await PreSaleConnection();

  const sent = await PreSaleContract.claimTokens();
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("From: ", receipt["from"]);
}

async function approvePreSale() {
  //bnb = ethers.utils.parseEther( bnb_ )
  await disconnectContracts();
  await AnyTokenConnection();

  const sent = await AnyTokenContract.approve(
    PreSaleAddress,
    ethers.BigNumber.from(
      process.env.ADDRESS_SENT
    )
  );
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("From: ", receipt["from"]);
}

async function depositPreSaleTokens_() {
  await disconnectContracts();
  await AnyTokenConnection();

  //bnb = ethers.utils.parseEther( bnb_ )
  var dev_token_balance = await AnyTokenContract.balanceOf(
    await signer.getAddress()
  );
  AnyTokenContract = "";
  PreSaleConnection();
  const sent = await PreSaleContract.depositPreSaleTokens(dev_token_balance);
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("From: ", receipt["from"]);
}

async function fin() {
  await disconnectContracts();
  await PreSaleConnection();
  //bnb = ethers.utils.parseEther( bnb_ )
  console.log("ADD LIQUIITY...");
  const sent = await PreSaleContract.finalize();
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("From: ", receipt["from"]);
}

async function DeployPresale() {
  disconnectContracts();
  console.log("START PRESALE CONTRACT DEPLOYMENT...");
  //bnb = ethers.utils.parseEther( bnb_ )

  const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cap",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_minBNB",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxBNB",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "EmergencyWithdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "SeeAddressContribution",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cap_",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "contributions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount_",
          "type": "uint256"
        }
      ],
      "name": "depositPreSaleTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "finalize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isOpen",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "liqTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "liqTokens_",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxBNB",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minBNB",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "moneyRaised",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner_",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "preSaleCompleted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "saleTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "seeAllowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "seeBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to_",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount_",
          "type": "uint256"
        }
      ],
      "name": "sendTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "send_BNB_back",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenAddress_",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr_",
          "type": "address"
        }
      ],
      "name": "tokenAllocation",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "uniswapV2Router",
      "outputs": [
        {
          "internalType": "contract IUniswapV2Router02",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const bytecode = {
    "generatedSources": [
      {
        "ast": {
          "nodeType": "YulBlock",
          "src": "0:1634:1",
          "statements": [
            {
              "body": {
                "nodeType": "YulBlock",
                "src": "70:80:1",
                "statements": [
                  {
                    "nodeType": "YulAssignment",
                    "src": "80:22:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "offset",
                          "nodeType": "YulIdentifier",
                          "src": "95:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "mload",
                        "nodeType": "YulIdentifier",
                        "src": "89:5:1"
                      },
                      "nodeType": "YulFunctionCall",
                      "src": "89:13:1"
                    },
                    "variableNames": [
                      {
                        "name": "value",
                        "nodeType": "YulIdentifier",
                        "src": "80:5:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "value",
                          "nodeType": "YulIdentifier",
                          "src": "138:5:1"
                        }
                      ],
                      "functionName": {
                        "name": "validator_revert_t_address",
                        "nodeType": "YulIdentifier",
                        "src": "111:26:1"
                      },
                      "nodeType": "YulFunctionCall",
                      "src": "111:33:1"
                    },
                    "nodeType": "YulExpressionStatement",
                    "src": "111:33:1"
                  }
                ]
              },
              "name": "abi_decode_t_address_fromMemory",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "offset",
                  "nodeType": "YulTypedName",
                  "src": "48:6:1",
                  "type": ""
                },
                {
                  "name": "end",
                  "nodeType": "YulTypedName",
                  "src": "56:3:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "value",
                  "nodeType": "YulTypedName",
                  "src": "64:5:1",
                  "type": ""
                }
              ],
              "src": "7:143:1"
            },
            {
              "body": {
                "nodeType": "YulBlock",
                "src": "219:80:1",
                "statements": [
                  {
                    "nodeType": "YulAssignment",
                    "src": "229:22:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "offset",
                          "nodeType": "YulIdentifier",
                          "src": "244:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "mload",
                        "nodeType": "YulIdentifier",
                        "src": "238:5:1"
                      },
                      "nodeType": "YulFunctionCall",
                      "src": "238:13:1"
                    },
                    "variableNames": [
                      {
                        "name": "value",
                        "nodeType": "YulIdentifier",
                        "src": "229:5:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "value",
                          "nodeType": "YulIdentifier",
                          "src": "287:5:1"
                        }
                      ],
                      "functionName": {
                        "name": "validator_revert_t_uint256",
                        "nodeType": "YulIdentifier",
                        "src": "260:26:1"
                      },
                      "nodeType": "YulFunctionCall",
                      "src": "260:33:1"
                    },
                    "nodeType": "YulExpressionStatement",
                    "src": "260:33:1"
                  }
                ]
              },
              "name": "abi_decode_t_uint256_fromMemory",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "offset",
                  "nodeType": "YulTypedName",
                  "src": "197:6:1",
                  "type": ""
                },
                {
                  "name": "end",
                  "nodeType": "YulTypedName",
                  "src": "205:3:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "value",
                  "nodeType": "YulTypedName",
                  "src": "213:5:1",
                  "type": ""
                }
              ],
              "src": "156:143:1"
            },
            {
              "body": {
                "nodeType": "YulBlock",
                "src": "433:625:1",
                "statements": [
                  {
                    "body": {
                      "nodeType": "YulBlock",
                      "src": "480:16:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [
                              {
                                "kind": "number",
                                "nodeType": "YulLiteral",
                                "src": "489:1:1",
                                "type": "",
                                "value": "0"
                              },
                              {
                                "kind": "number",
                                "nodeType": "YulLiteral",
                                "src": "492:1:1",
                                "type": "",
                                "value": "0"
                              }
                            ],
                            "functionName": {
                              "name": "revert",
                              "nodeType": "YulIdentifier",
                              "src": "482:6:1"
                            },
                            "nodeType": "YulFunctionCall",
                            "src": "482:12:1"
                          },
                          "nodeType": "YulExpressionStatement",
                          "src": "482:12:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "dataEnd",
                              "nodeType": "YulIdentifier",
                              "src": "454:7:1"
                            },
                            {
                              "name": "headStart",
                              "nodeType": "YulIdentifier",
                              "src": "463:9:1"
                            }
                          ],
                          "functionName": {
                            "name": "sub",
                            "nodeType": "YulIdentifier",
                            "src": "450:3:1"
                          },
                          "nodeType": "YulFunctionCall",
                          "src": "450:23:1"
                        },
                        {
                          "kind": "number",
                          "nodeType": "YulLiteral",
                          "src": "475:3:1",
                          "type": "",
                          "value": "128"
                        }
                      ],
                      "functionName": {
                        "name": "slt",
                        "nodeType": "YulIdentifier",
                        "src": "446:3:1"
                      },
                      "nodeType": "YulFunctionCall",
                      "src": "446:33:1"
                    },
                    "nodeType": "YulIf",
                    "src": "443:2:1"
                  },
                  {
                    "nodeType": "YulBlock",
                    "src": "506:128:1",
                    "statements": [
                      {
                        "nodeType": "YulVariableDeclaration",
                        "src": "521:15:1",
                        "value": {
                          "kind": "number",
                          "nodeType": "YulLiteral",
                          "src": "535:1:1",
                          "type": "",
                          "value": "0"
                        },
                        "variables": [
                          {
                            "name": "offset",
                            "nodeType": "YulTypedName",
                            "src": "525:6:1",
                            "type": ""
                          }
                        ]
                      },
                      {
                        "nodeType": "YulAssignment",
                        "src": "550:74:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nodeType": "YulIdentifier",
                                  "src": "596:9:1"
                                },
                                {
                                  "name": "offset",
                                  "nodeType": "YulIdentifier",
                                  "src": "607:6:1"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nodeType": "YulIdentifier",
                                "src": "592:3:1"
                              },
                              "nodeType": "YulFunctionCall",
                              "src": "592:22:1"
                            },
                            {
                              "name": "dataEnd",
                              "nodeType": "YulIdentifier",
                              "src": "616:7:1"
                            }
                          ],
                          "functionName": {
                            "name": "abi_decode_t_uint256_fromMemory",
                            "nodeType": "YulIdentifier",
                            "src": "560:31:1"
                          },
                          "nodeType": "YulFunctionCall",
                          "src": "560:64:1"
                        },
                        "variableNames": [
                          {
                            "name": "value0",
                            "nodeType": "YulIdentifier",
                            "src": "550:6:1"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nodeType": "YulBlock",
                    "src": "644:129:1",
                    "statements": [
                      {
                        "nodeType": "YulVariableDeclaration",
                        "src": "659:16:1",
                        "value": {
                          "kind": "number",
                          "nodeType": "YulLiteral",
                          "src": "673:2:1",
                          "type": "",
                          "value": "32"
                        },
                        "variables": [
                          {
                            "name": "offset",
                            "nodeType": "YulTypedName",
                            "src": "663:6:1",
                            "type": ""
                          }
                        ]
                      },
                      {
                        "nodeType": "YulAssignment",
                        "src": "689:74:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nodeType": "YulIdentifier",
                                  "src": "735:9:1"
                                },
                                {
                                  "name": "offset",
                                  "nodeType": "YulIdentifier",
                                  "src": "746:6:1"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nodeType": "YulIdentifier",
                                "src": "731:3:1"
                              },
                              "nodeType": "YulFunctionCall",
                              "src": "731:22:1"
                            },
                            {
                              "name": "dataEnd",
                              "nodeType": "YulIdentifier",
                              "src": "755:7:1"
                            }
                          ],
                          "functionName": {
                            "name": "abi_decode_t_uint256_fromMemory",
                            "nodeType": "YulIdentifier",
                            "src": "699:31:1"
                          },
                          "nodeType": "YulFunctionCall",
                          "src": "699:64:1"
                        },
                        "variableNames": [
                          {
                            "name": "value1",
                            "nodeType": "YulIdentifier",
                            "src": "689:6:1"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nodeType": "YulBlock",
                    "src": "783:129:1",
                    "statements": [
                      {
                        "nodeType": "YulVariableDeclaration",
                        "src": "798:16:1",
                        "value": {
                          "kind": "number",
                          "nodeType": "YulLiteral",
                          "src": "812:2:1",
                          "type": "",
                          "value": "64"
                        },
                        "variables": [
                          {
                            "name": "offset",
                            "nodeType": "YulTypedName",
                            "src": "802:6:1",
                            "type": ""
                          }
                        ]
                      },
                      {
                        "nodeType": "YulAssignment",
                        "src": "828:74:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nodeType": "YulIdentifier",
                                  "src": "874:9:1"
                                },
                                {
                                  "name": "offset",
                                  "nodeType": "YulIdentifier",
                                  "src": "885:6:1"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nodeType": "YulIdentifier",
                                "src": "870:3:1"
                              },
                              "nodeType": "YulFunctionCall",
                              "src": "870:22:1"
                            },
                            {
                              "name": "dataEnd",
                              "nodeType": "YulIdentifier",
                              "src": "894:7:1"
                            }
                          ],
                          "functionName": {
                            "name": "abi_decode_t_uint256_fromMemory",
                            "nodeType": "YulIdentifier",
                            "src": "838:31:1"
                          },
                          "nodeType": "YulFunctionCall",
                          "src": "838:64:1"
                        },
                        "variableNames": [
                          {
                            "name": "value2",
                            "nodeType": "YulIdentifier",
                            "src": "828:6:1"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nodeType": "YulBlock",
                    "src": "922:129:1",
                    "statements": [
                      {
                        "nodeType": "YulVariableDeclaration",
                        "src": "937:16:1",
                        "value": {
                          "kind": "number",
                          "nodeType": "YulLiteral",
                          "src": "951:2:1",
                          "type": "",
                          "value": "96"
                        },
                        "variables": [
                          {
                            "name": "offset",
                            "nodeType": "YulTypedName",
                            "src": "941:6:1",
                            "type": ""
                          }
                        ]
                      },
                      {
                        "nodeType": "YulAssignment",
                        "src": "967:74:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nodeType": "YulIdentifier",
                                  "src": "1013:9:1"
                                },
                                {
                                  "name": "offset",
                                  "nodeType": "YulIdentifier",
                                  "src": "1024:6:1"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nodeType": "YulIdentifier",
                                "src": "1009:3:1"
                              },
                              "nodeType": "YulFunctionCall",
                              "src": "1009:22:1"
                            },
                            {
                              "name": "dataEnd",
                              "nodeType": "YulIdentifier",
                              "src": "1033:7:1"
                            }
                          ],
                          "functionName": {
                            "name": "abi_decode_t_address_fromMemory",
                            "nodeType": "YulIdentifier",
                            "src": "977:31:1"
                          },
                          "nodeType": "YulFunctionCall",
                          "src": "977:64:1"
                        },
                        "variableNames": [
                          {
                            "name": "value3",
                            "nodeType": "YulIdentifier",
                            "src": "967:6:1"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              "name": "abi_decode_tuple_t_uint256t_uint256t_uint256t_address_fromMemory",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "headStart",
                  "nodeType": "YulTypedName",
                  "src": "379:9:1",
                  "type": ""
                },
                {
                  "name": "dataEnd",
                  "nodeType": "YulTypedName",
                  "src": "390:7:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "value0",
                  "nodeType": "YulTypedName",
                  "src": "402:6:1",
                  "type": ""
                },
                {
                  "name": "value1",
                  "nodeType": "YulTypedName",
                  "src": "410:6:1",
                  "type": ""
                },
                {
                  "name": "value2",
                  "nodeType": "YulTypedName",
                  "src": "418:6:1",
                  "type": ""
                },
                {
                  "name": "value3",
                  "nodeType": "YulTypedName",
                  "src": "426:6:1",
                  "type": ""
                }
              ],
              "src": "305:753:1"
            },
            {
              "body": {
                "nodeType": "YulBlock",
                "src": "1109:51:1",
                "statements": [
                  {
                    "nodeType": "YulAssignment",
                    "src": "1119:35:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value",
                          "nodeType": "YulIdentifier",
                          "src": "1148:5:1"
                        }
                      ],
                      "functionName": {
                        "name": "cleanup_t_uint160",
                        "nodeType": "YulIdentifier",
                        "src": "1130:17:1"
                      },
                      "nodeType": "YulFunctionCall",
                      "src": "1130:24:1"
                    },
                    "variableNames": [
                      {
                        "name": "cleaned",
                        "nodeType": "YulIdentifier",
                        "src": "1119:7:1"
                      }
                    ]
                  }
                ]
              },
              "name": "cleanup_t_address",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nodeType": "YulTypedName",
                  "src": "1091:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "cleaned",
                  "nodeType": "YulTypedName",
                  "src": "1101:7:1",
                  "type": ""
                }
              ],
              "src": "1064:96:1"
            },
            {
              "body": {
                "nodeType": "YulBlock",
                "src": "1211:81:1",
                "statements": [
                  {
                    "nodeType": "YulAssignment",
                    "src": "1221:65:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value",
                          "nodeType": "YulIdentifier",
                          "src": "1236:5:1"
                        },
                        {
                          "kind": "number",
                          "nodeType": "YulLiteral",
                          "src": "1243:42:1",
                          "type": "",
                          "value": "0xffffffffffffffffffffffffffffffffffffffff"
                        }
                      ],
                      "functionName": {
                        "name": "and",
                        "nodeType": "YulIdentifier",
                        "src": "1232:3:1"
                      },
                      "nodeType": "YulFunctionCall",
                      "src": "1232:54:1"
                    },
                    "variableNames": [
                      {
                        "name": "cleaned",
                        "nodeType": "YulIdentifier",
                        "src": "1221:7:1"
                      }
                    ]
                  }
                ]
              },
              "name": "cleanup_t_uint160",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nodeType": "YulTypedName",
                  "src": "1193:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "cleaned",
                  "nodeType": "YulTypedName",
                  "src": "1203:7:1",
                  "type": ""
                }
              ],
              "src": "1166:126:1"
            },
            {
              "body": {
                "nodeType": "YulBlock",
                "src": "1343:32:1",
                "statements": [
                  {
                    "nodeType": "YulAssignment",
                    "src": "1353:16:1",
                    "value": {
                      "name": "value",
                      "nodeType": "YulIdentifier",
                      "src": "1364:5:1"
                    },
                    "variableNames": [
                      {
                        "name": "cleaned",
                        "nodeType": "YulIdentifier",
                        "src": "1353:7:1"
                      }
                    ]
                  }
                ]
              },
              "name": "cleanup_t_uint256",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nodeType": "YulTypedName",
                  "src": "1325:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "cleaned",
                  "nodeType": "YulTypedName",
                  "src": "1335:7:1",
                  "type": ""
                }
              ],
              "src": "1298:77:1"
            },
            {
              "body": {
                "nodeType": "YulBlock",
                "src": "1424:79:1",
                "statements": [
                  {
                    "body": {
                      "nodeType": "YulBlock",
                      "src": "1481:16:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [
                              {
                                "kind": "number",
                                "nodeType": "YulLiteral",
                                "src": "1490:1:1",
                                "type": "",
                                "value": "0"
                              },
                              {
                                "kind": "number",
                                "nodeType": "YulLiteral",
                                "src": "1493:1:1",
                                "type": "",
                                "value": "0"
                              }
                            ],
                            "functionName": {
                              "name": "revert",
                              "nodeType": "YulIdentifier",
                              "src": "1483:6:1"
                            },
                            "nodeType": "YulFunctionCall",
                            "src": "1483:12:1"
                          },
                          "nodeType": "YulExpressionStatement",
                          "src": "1483:12:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "value",
                              "nodeType": "YulIdentifier",
                              "src": "1447:5:1"
                            },
                            {
                              "arguments": [
                                {
                                  "name": "value",
                                  "nodeType": "YulIdentifier",
                                  "src": "1472:5:1"
                                }
                              ],
                              "functionName": {
                                "name": "cleanup_t_address",
                                "nodeType": "YulIdentifier",
                                "src": "1454:17:1"
                              },
                              "nodeType": "YulFunctionCall",
                              "src": "1454:24:1"
                            }
                          ],
                          "functionName": {
                            "name": "eq",
                            "nodeType": "YulIdentifier",
                            "src": "1444:2:1"
                          },
                          "nodeType": "YulFunctionCall",
                          "src": "1444:35:1"
                        }
                      ],
                      "functionName": {
                        "name": "iszero",
                        "nodeType": "YulIdentifier",
                        "src": "1437:6:1"
                      },
                      "nodeType": "YulFunctionCall",
                      "src": "1437:43:1"
                    },
                    "nodeType": "YulIf",
                    "src": "1434:2:1"
                  }
                ]
              },
              "name": "validator_revert_t_address",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nodeType": "YulTypedName",
                  "src": "1417:5:1",
                  "type": ""
                }
              ],
              "src": "1381:122:1"
            },
            {
              "body": {
                "nodeType": "YulBlock",
                "src": "1552:79:1",
                "statements": [
                  {
                    "body": {
                      "nodeType": "YulBlock",
                      "src": "1609:16:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [
                              {
                                "kind": "number",
                                "nodeType": "YulLiteral",
                                "src": "1618:1:1",
                                "type": "",
                                "value": "0"
                              },
                              {
                                "kind": "number",
                                "nodeType": "YulLiteral",
                                "src": "1621:1:1",
                                "type": "",
                                "value": "0"
                              }
                            ],
                            "functionName": {
                              "name": "revert",
                              "nodeType": "YulIdentifier",
                              "src": "1611:6:1"
                            },
                            "nodeType": "YulFunctionCall",
                            "src": "1611:12:1"
                          },
                          "nodeType": "YulExpressionStatement",
                          "src": "1611:12:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "value",
                              "nodeType": "YulIdentifier",
                              "src": "1575:5:1"
                            },
                            {
                              "arguments": [
                                {
                                  "name": "value",
                                  "nodeType": "YulIdentifier",
                                  "src": "1600:5:1"
                                }
                              ],
                              "functionName": {
                                "name": "cleanup_t_uint256",
                                "nodeType": "YulIdentifier",
                                "src": "1582:17:1"
                              },
                              "nodeType": "YulFunctionCall",
                              "src": "1582:24:1"
                            }
                          ],
                          "functionName": {
                            "name": "eq",
                            "nodeType": "YulIdentifier",
                            "src": "1572:2:1"
                          },
                          "nodeType": "YulFunctionCall",
                          "src": "1572:35:1"
                        }
                      ],
                      "functionName": {
                        "name": "iszero",
                        "nodeType": "YulIdentifier",
                        "src": "1565:6:1"
                      },
                      "nodeType": "YulFunctionCall",
                      "src": "1565:43:1"
                    },
                    "nodeType": "YulIf",
                    "src": "1562:2:1"
                  }
                ]
              },
              "name": "validator_revert_t_uint256",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nodeType": "YulTypedName",
                  "src": "1545:5:1",
                  "type": ""
                }
              ],
              "src": "1509:122:1"
            }
          ]
        },
        "contents": "{\n\n    function abi_decode_t_address_fromMemory(offset, end) -> value {\n        value := mload(offset)\n        validator_revert_t_address(value)\n    }\n\n    function abi_decode_t_uint256_fromMemory(offset, end) -> value {\n        value := mload(offset)\n        validator_revert_t_uint256(value)\n    }\n\n    function abi_decode_tuple_t_uint256t_uint256t_uint256t_address_fromMemory(headStart, dataEnd) -> value0, value1, value2, value3 {\n        if slt(sub(dataEnd, headStart), 128) { revert(0, 0) }\n\n        {\n\n            let offset := 0\n\n            value0 := abi_decode_t_uint256_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 32\n\n            value1 := abi_decode_t_uint256_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 64\n\n            value2 := abi_decode_t_uint256_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 96\n\n            value3 := abi_decode_t_address_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function cleanup_t_address(value) -> cleaned {\n        cleaned := cleanup_t_uint160(value)\n    }\n\n    function cleanup_t_uint160(value) -> cleaned {\n        cleaned := and(value, 0xffffffffffffffffffffffffffffffffffffffff)\n    }\n\n    function cleanup_t_uint256(value) -> cleaned {\n        cleaned := value\n    }\n\n    function validator_revert_t_address(value) {\n        if iszero(eq(value, cleanup_t_address(value))) { revert(0, 0) }\n    }\n\n    function validator_revert_t_uint256(value) {\n        if iszero(eq(value, cleanup_t_uint256(value))) { revert(0, 0) }\n    }\n\n}\n",
        "id": 1,
        "language": "Yul",
        "name": "#utility.yul"
      }
    ],
    "linkReferences": {},
    "object": "6101206040526000600360006101000a81548160ff0219169083151502179055506000600360016101000a81548160ff02191690831515021790555060006006553480156200004d57600080fd5b506040516200235938038062002359833981810160405281019062000073919062000186565b8360a081815250508260c081815250508160e081815250508073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1660601b8152505073d99d1c33f9fc3444f8101754abc46c52416550d173ffffffffffffffffffffffffffffffffffffffff166101008173ffffffffffffffffffffffffffffffffffffffff1660601b81525050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505062000264565b600081519050620001698162000230565b92915050565b60008151905062000180816200024a565b92915050565b600080600080608085870312156200019d57600080fd5b6000620001ad878288016200016f565b9450506020620001c0878288016200016f565b9350506040620001d3878288016200016f565b9250506060620001e68782880162000158565b91505092959194509250565b6000620001ff8262000206565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6200023b81620001f2565b81146200024757600080fd5b50565b620002558162000226565b81146200026157600080fd5b50565b60805160601c60a05160c05160e0516101005160601c61203a6200031f60003960008181610741015281816114ff01526115910152600081816107670152610edf015260008181610a710152610e7c0152600081816106e90152818161080e01528181610fab0152611013015260008181610585015281816106330152818161071b015281816108660152818161091401528181610a9701528181610b8a01528181610c60015281816114c301526115ce015261203a6000f3fe6080604052600436106101665760003560e01c806349003551116100d15780638da5cb5b1161008a578063cc6a1a0611610064578063cc6a1a0614610520578063d0e30db014610537578063d33aa8e514610541578063e76630791461055857610166565b80638da5cb5b1461048d5780639136a5ec146104b8578063b0b9603b146104f557610166565b8063490035511461037d5780634b0b945e146103ba5780634bb278f3146103e5578063517311ea146103fc578063521886b3146104275780638aeb87071461045057610166565b80634123fec7116101235780634123fec71461026b57806342e94c901461029657806343248084146102d3578063440e1e69146102fe57806347535d7b1461033b57806348c54b9d1461036657610166565b806305ab421d1461016b57806307fb363a146101945780630d056513146101bf57806310051089146101ea5780631694505e146102155780631e377df014610240575b600080fd5b34801561017757600080fd5b50610192600480360381019061018d9190611747565b610583565b005b3480156101a057600080fd5b506101a96106e5565b6040516101b69190611be0565b60405180910390f35b3480156101cb57600080fd5b506101d461070d565b6040516101e19190611be0565b60405180910390f35b3480156101f657600080fd5b506101ff610717565b60405161020c91906119c5565b60405180910390f35b34801561022157600080fd5b5061022a61073f565b6040516102379190611ae5565b60405180910390f35b34801561024c57600080fd5b50610255610763565b6040516102629190611be0565b60405180910390f35b34801561027757600080fd5b5061028061078b565b60405161028d9190611be0565b60405180910390f35b3480156102a257600080fd5b506102bd60048036038101906102b8919061171e565b610791565b6040516102ca9190611be0565b60405180910390f35b3480156102df57600080fd5b506102e86107a9565b6040516102f59190611aca565b60405180910390f35b34801561030a57600080fd5b506103256004803603810190610320919061171e565b6107c0565b6040516103329190611be0565b60405180910390f35b34801561034757600080fd5b50610350610842565b60405161035d9190611aca565b60405180910390f35b34801561037257600080fd5b5061037b610859565b005b34801561038957600080fd5b506103a4600480360381019061039f919061171e565b610a0a565b6040516103b19190611be0565b60405180910390f35b3480156103c657600080fd5b506103cf610a53565b6040516103dc9190611be0565b60405180910390f35b3480156103f157600080fd5b506103fa610a5d565b005b34801561040857600080fd5b50610411610a6d565b60405161041e9190611be0565b60405180910390f35b34801561043357600080fd5b5061044e600480360381019061044991906117ac565b610a95565b005b34801561045c57600080fd5b506104776004803603810190610472919061171e565b610b86565b6040516104849190611be0565b60405180910390f35b34801561049957600080fd5b506104a2610c38565b6040516104af91906119c5565b60405180910390f35b3480156104c457600080fd5b506104df60048036038101906104da919061171e565b610c5c565b6040516104ec9190611be0565b60405180910390f35b34801561050157600080fd5b5061050a610d10565b6040516105179190611be0565b60405180910390f35b34801561052c57600080fd5b50610535610d16565b005b61053f610e7a565b005b34801561054d57600080fd5b506105566111e3565b005b34801561056457600080fd5b5061056d61146c565b60405161057a91906119c5565b60405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b81526004016105de929190611a40565b602060405180830381600087803b1580156105f857600080fd5b505af115801561060c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106309190611783565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3084846040518463ffffffff1660e01b815260040161068e93929190611a09565b602060405180830381600087803b1580156106a857600080fd5b505af11580156106bc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106e09190611783565b505050565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b6000600454905090565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b60045481565b60076020528060005260406000206000915090505481565b6000600360009054906101000a900460ff16905090565b600080610837600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546108326005547f0000000000000000000000000000000000000000000000000000000000000000611495565b6114ab565b905080915050919050565b6000600360019054906101000a900460ff16905090565b600065e35fa931a00090507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b81526004016108bf929190611a40565b602060405180830381600087803b1580156108d957600080fd5b505af11580156108ed573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109119190611783565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3033846040518463ffffffff1660e01b815260040161096f93929190611a09565b602060405180830381600087803b15801561098957600080fd5b505af115801561099d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109c19190611783565b506000600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b6000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000600254905090565b610a6b6004546002546114c1565b565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3330846040518463ffffffff1660e01b8152600401610af293929190611a09565b602060405180830381600087803b158015610b0c57600080fd5b505af1158015610b20573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b449190611783565b506001600360016101000a81548160ff021916908315150217905550610b6b816002611495565b600481905550610b7d8160045461168d565b60058190555050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff1660e01b8152600401610be191906119c5565b60206040518083038186803b158015610bf957600080fd5b505afa158015610c0d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c3191906117d5565b9050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e83306040518363ffffffff1660e01b8152600401610cb99291906119e0565b60206040518083038186803b158015610cd157600080fd5b505afa158015610ce5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d0991906117d5565b9050919050565b60055481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610da4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d9b90611b40565b60405180910390fd5b600047905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1682604051610df0906119b0565b60006040518083038185875af1925050503d8060008114610e2d576040519150601f19603f3d011682016040523d82523d6000602084013e610e32565b606091505b5050905080610e76576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e6d90611b00565b60405180910390fd5b5050565b7f0000000000000000000000000000000000000000000000000000000000000000341015610edd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ed490611bc0565b60405180910390fd5b7f0000000000000000000000000000000000000000000000000000000000000000341115610f40576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f3790611b60565b60405180910390fd5b600360009054906101000a900460ff1615610f90576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8790611b20565b60405180910390fd5b3460026000828254610fa29190611c17565b925050819055507f0000000000000000000000000000000000000000000000000000000000000000600254111561100e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161100590611ba0565b60405180910390fd5b6110377f00000000000000000000000000000000000000000000000000000000000000006116a3565b6002541061105b576001600360006101000a81548160ff0219169083151502179055505b6000805b6006548110156110e8573373ffffffffffffffffffffffffffffffffffffffff166008600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156110d557600191505b80806110e090611daa565b91505061105f565b506000151581151514611130576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161112790611b80565b60405180910390fd5b3360086000600654815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600660008154809291906111db90611daa565b919050555050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611271576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161126890611b40565b60405180910390fd5b60005b60065481101561144e5760006008600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008273ffffffffffffffffffffffffffffffffffffffff1682604051611320906119b0565b60006040518083038185875af1925050503d806000811461135d576040519150601f19603f3d011682016040523d82523d6000602084013e611362565b606091505b50509050806113a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161139d90611b00565b60405180910390fd5b81600260008282546113b89190611cf8565b925050819055506008600085815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009055505050808061144690611daa565b915050611274565b506000600360006101000a81548160ff021916908315150217905550565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600081836114a39190611c6d565b905092915050565b600081836114b99190611c9e565b905092915050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b37f0000000000000000000000000000000000000000000000000000000000000000846040518363ffffffff1660e01b815260040161153c929190611a40565b602060405180830381600087803b15801561155657600080fd5b505af115801561156a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061158e9190611783565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663f305d719827f00000000000000000000000000000000000000000000000000000000000000008560008060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16426040518863ffffffff1660e01b815260040161163496959493929190611a69565b6060604051808303818588803b15801561164d57600080fd5b505af1158015611661573d6000803e3d6000fd5b50505050506040513d601f19601f8201168201806040525081019061168691906117fe565b5050505050565b6000818361169b9190611cf8565b905092915050565b60008060648360636116b59190611c9e565b6116bf9190611c6d565b905080915050919050565b6000813590506116d981611fbf565b92915050565b6000815190506116ee81611fd6565b92915050565b60008135905061170381611fed565b92915050565b60008151905061171881611fed565b92915050565b60006020828403121561173057600080fd5b600061173e848285016116ca565b91505092915050565b6000806040838503121561175a57600080fd5b6000611768858286016116ca565b9250506020611779858286016116f4565b9150509250929050565b60006020828403121561179557600080fd5b60006117a3848285016116df565b91505092915050565b6000602082840312156117be57600080fd5b60006117cc848285016116f4565b91505092915050565b6000602082840312156117e757600080fd5b60006117f584828501611709565b91505092915050565b60008060006060848603121561181357600080fd5b600061182186828701611709565b935050602061183286828701611709565b925050604061184386828701611709565b9150509250925092565b61185681611d2c565b82525050565b61186581611d3e565b82525050565b61187481611d74565b82525050565b61188381611d98565b82525050565b6000611896601483611c06565b91506118a182611e51565b602082019050919050565b60006118b9601683611c06565b91506118c482611e7a565b602082019050919050565b60006118dc600983611c06565b91506118e782611ea3565b602082019050919050565b60006118ff600083611bfb565b915061190a82611ecc565b600082019050919050565b6000611922601883611c06565b915061192d82611ecf565b602082019050919050565b6000611945602b83611c06565b915061195082611ef8565b604082019050919050565b6000611968602783611c06565b915061197382611f47565b604082019050919050565b600061198b601a83611c06565b915061199682611f96565b602082019050919050565b6119aa81611d6a565b82525050565b60006119bb826118f2565b9150819050919050565b60006020820190506119da600083018461184d565b92915050565b60006040820190506119f5600083018561184d565b611a02602083018461184d565b9392505050565b6000606082019050611a1e600083018661184d565b611a2b602083018561184d565b611a3860408301846119a1565b949350505050565b6000604082019050611a55600083018561184d565b611a6260208301846119a1565b9392505050565b600060c082019050611a7e600083018961184d565b611a8b60208301886119a1565b611a98604083018761187a565b611aa5606083018661187a565b611ab2608083018561184d565b611abf60a08301846119a1565b979650505050505050565b6000602082019050611adf600083018461185c565b92915050565b6000602082019050611afa600083018461186b565b92915050565b60006020820190508181036000830152611b1981611889565b9050919050565b60006020820190508181036000830152611b39816118ac565b9050919050565b60006020820190508181036000830152611b59816118cf565b9050919050565b60006020820190508181036000830152611b7981611915565b9050919050565b60006020820190508181036000830152611b9981611938565b9050919050565b60006020820190508181036000830152611bb98161195b565b9050919050565b60006020820190508181036000830152611bd98161197e565b9050919050565b6000602082019050611bf560008301846119a1565b92915050565b600081905092915050565b600082825260208201905092915050565b6000611c2282611d6a565b9150611c2d83611d6a565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611c6257611c61611df3565b5b828201905092915050565b6000611c7882611d6a565b9150611c8383611d6a565b925082611c9357611c92611e22565b5b828204905092915050565b6000611ca982611d6a565b9150611cb483611d6a565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611ced57611cec611df3565b5b828202905092915050565b6000611d0382611d6a565b9150611d0e83611d6a565b925082821015611d2157611d20611df3565b5b828203905092915050565b6000611d3782611d4a565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000611d7f82611d86565b9050919050565b6000611d9182611d4a565b9050919050565b6000611da382611d6a565b9050919050565b6000611db582611d6a565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611de857611de7611df3565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4661696c656420746f2073656e64204574686572000000000000000000000000600082015250565b7f43617020697320616c7265616479207265616368656400000000000000000000600082015250565b7f4e6f74206f776e65720000000000000000000000000000000000000000000000600082015250565b50565b7f4465706f7369742056616c756520697320546f6f204269670000000000000000600082015250565b7f596f75206861766520616c726561647920636f6e747269627574656420746f2060008201527f7468652070726573616c65000000000000000000000000000000000000000000602082015250565b7f52657665727465643a20424e42206465706f73697420776f756c6420676f206f60008201527f7665722063617000000000000000000000000000000000000000000000000000602082015250565b7f4465706f7369742056616c756520697320546f6f20536d616c6c000000000000600082015250565b611fc881611d2c565b8114611fd357600080fd5b50565b611fdf81611d3e565b8114611fea57600080fd5b50565b611ff681611d6a565b811461200157600080fd5b5056fea264697066735822122013c85a5380a4fc7ec2697d393e69d3eca88d7907c80495556e7fe38a6d07fbd864736f6c63430008040033",
    "opcodes": "PUSH2 0x120 PUSH1 0x40 MSTORE PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x3 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x6 SSTORE CALLVALUE DUP1 ISZERO PUSH3 0x4D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD PUSH3 0x2359 CODESIZE SUB DUP1 PUSH3 0x2359 DUP4 CODECOPY DUP2 DUP2 ADD PUSH1 0x40 MSTORE DUP2 ADD SWAP1 PUSH3 0x73 SWAP2 SWAP1 PUSH3 0x186 JUMP JUMPDEST DUP4 PUSH1 0xA0 DUP2 DUP2 MSTORE POP POP DUP3 PUSH1 0xC0 DUP2 DUP2 MSTORE POP POP DUP2 PUSH1 0xE0 DUP2 DUP2 MSTORE POP POP DUP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x80 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP PUSH20 0xD99D1C33F9FC3444F8101754ABC46C52416550D1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x100 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP CALLER PUSH1 0x0 DUP1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP POP POP POP POP PUSH3 0x264 JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH3 0x169 DUP2 PUSH3 0x230 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH3 0x180 DUP2 PUSH3 0x24A JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x80 DUP6 DUP8 SUB SLT ISZERO PUSH3 0x19D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH3 0x1AD DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP5 POP POP PUSH1 0x20 PUSH3 0x1C0 DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP4 POP POP PUSH1 0x40 PUSH3 0x1D3 DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP3 POP POP PUSH1 0x60 PUSH3 0x1E6 DUP8 DUP3 DUP9 ADD PUSH3 0x158 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP6 SWAP2 SWAP5 POP SWAP3 POP JUMP JUMPDEST PUSH1 0x0 PUSH3 0x1FF DUP3 PUSH3 0x206 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH3 0x23B DUP2 PUSH3 0x1F2 JUMP JUMPDEST DUP2 EQ PUSH3 0x247 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH3 0x255 DUP2 PUSH3 0x226 JUMP JUMPDEST DUP2 EQ PUSH3 0x261 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH1 0x80 MLOAD PUSH1 0x60 SHR PUSH1 0xA0 MLOAD PUSH1 0xC0 MLOAD PUSH1 0xE0 MLOAD PUSH2 0x100 MLOAD PUSH1 0x60 SHR PUSH2 0x203A PUSH3 0x31F PUSH1 0x0 CODECOPY PUSH1 0x0 DUP2 DUP2 PUSH2 0x741 ADD MSTORE DUP2 DUP2 PUSH2 0x14FF ADD MSTORE PUSH2 0x1591 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x767 ADD MSTORE PUSH2 0xEDF ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0xA71 ADD MSTORE PUSH2 0xE7C ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x6E9 ADD MSTORE DUP2 DUP2 PUSH2 0x80E ADD MSTORE DUP2 DUP2 PUSH2 0xFAB ADD MSTORE PUSH2 0x1013 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x585 ADD MSTORE DUP2 DUP2 PUSH2 0x633 ADD MSTORE DUP2 DUP2 PUSH2 0x71B ADD MSTORE DUP2 DUP2 PUSH2 0x866 ADD MSTORE DUP2 DUP2 PUSH2 0x914 ADD MSTORE DUP2 DUP2 PUSH2 0xA97 ADD MSTORE DUP2 DUP2 PUSH2 0xB8A ADD MSTORE DUP2 DUP2 PUSH2 0xC60 ADD MSTORE DUP2 DUP2 PUSH2 0x14C3 ADD MSTORE PUSH2 0x15CE ADD MSTORE PUSH2 0x203A PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x166 JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x49003551 GT PUSH2 0xD1 JUMPI DUP1 PUSH4 0x8DA5CB5B GT PUSH2 0x8A JUMPI DUP1 PUSH4 0xCC6A1A06 GT PUSH2 0x64 JUMPI DUP1 PUSH4 0xCC6A1A06 EQ PUSH2 0x520 JUMPI DUP1 PUSH4 0xD0E30DB0 EQ PUSH2 0x537 JUMPI DUP1 PUSH4 0xD33AA8E5 EQ PUSH2 0x541 JUMPI DUP1 PUSH4 0xE7663079 EQ PUSH2 0x558 JUMPI PUSH2 0x166 JUMP JUMPDEST DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0x48D JUMPI DUP1 PUSH4 0x9136A5EC EQ PUSH2 0x4B8 JUMPI DUP1 PUSH4 0xB0B9603B EQ PUSH2 0x4F5 JUMPI PUSH2 0x166 JUMP JUMPDEST DUP1 PUSH4 0x49003551 EQ PUSH2 0x37D JUMPI DUP1 PUSH4 0x4B0B945E EQ PUSH2 0x3BA JUMPI DUP1 PUSH4 0x4BB278F3 EQ PUSH2 0x3E5 JUMPI DUP1 PUSH4 0x517311EA EQ PUSH2 0x3FC JUMPI DUP1 PUSH4 0x521886B3 EQ PUSH2 0x427 JUMPI DUP1 PUSH4 0x8AEB8707 EQ PUSH2 0x450 JUMPI PUSH2 0x166 JUMP JUMPDEST DUP1 PUSH4 0x4123FEC7 GT PUSH2 0x123 JUMPI DUP1 PUSH4 0x4123FEC7 EQ PUSH2 0x26B JUMPI DUP1 PUSH4 0x42E94C90 EQ PUSH2 0x296 JUMPI DUP1 PUSH4 0x43248084 EQ PUSH2 0x2D3 JUMPI DUP1 PUSH4 0x440E1E69 EQ PUSH2 0x2FE JUMPI DUP1 PUSH4 0x47535D7B EQ PUSH2 0x33B JUMPI DUP1 PUSH4 0x48C54B9D EQ PUSH2 0x366 JUMPI PUSH2 0x166 JUMP JUMPDEST DUP1 PUSH4 0x5AB421D EQ PUSH2 0x16B JUMPI DUP1 PUSH4 0x7FB363A EQ PUSH2 0x194 JUMPI DUP1 PUSH4 0xD056513 EQ PUSH2 0x1BF JUMPI DUP1 PUSH4 0x10051089 EQ PUSH2 0x1EA JUMPI DUP1 PUSH4 0x1694505E EQ PUSH2 0x215 JUMPI DUP1 PUSH4 0x1E377DF0 EQ PUSH2 0x240 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x177 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x192 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x18D SWAP2 SWAP1 PUSH2 0x1747 JUMP JUMPDEST PUSH2 0x583 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1A0 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1A9 PUSH2 0x6E5 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1B6 SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1CB JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1D4 PUSH2 0x70D JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1E1 SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1F6 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1FF PUSH2 0x717 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x20C SWAP2 SWAP1 PUSH2 0x19C5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x221 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x22A PUSH2 0x73F JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x237 SWAP2 SWAP1 PUSH2 0x1AE5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x24C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x255 PUSH2 0x763 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x262 SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x277 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x280 PUSH2 0x78B JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x28D SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x2A2 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x2BD PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x2B8 SWAP2 SWAP1 PUSH2 0x171E JUMP JUMPDEST PUSH2 0x791 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2CA SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x2DF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x2E8 PUSH2 0x7A9 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2F5 SWAP2 SWAP1 PUSH2 0x1ACA JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x30A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x325 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x320 SWAP2 SWAP1 PUSH2 0x171E JUMP JUMPDEST PUSH2 0x7C0 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x332 SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x347 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x350 PUSH2 0x842 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x35D SWAP2 SWAP1 PUSH2 0x1ACA JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x372 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x37B PUSH2 0x859 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x389 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3A4 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x39F SWAP2 SWAP1 PUSH2 0x171E JUMP JUMPDEST PUSH2 0xA0A JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x3B1 SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x3C6 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3CF PUSH2 0xA53 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x3DC SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x3F1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3FA PUSH2 0xA5D JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x408 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x411 PUSH2 0xA6D JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x41E SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x433 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x44E PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x449 SWAP2 SWAP1 PUSH2 0x17AC JUMP JUMPDEST PUSH2 0xA95 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x45C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x477 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x472 SWAP2 SWAP1 PUSH2 0x171E JUMP JUMPDEST PUSH2 0xB86 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x484 SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x499 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4A2 PUSH2 0xC38 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x4AF SWAP2 SWAP1 PUSH2 0x19C5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x4C4 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4DF PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x4DA SWAP2 SWAP1 PUSH2 0x171E JUMP JUMPDEST PUSH2 0xC5C JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x4EC SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x501 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x50A PUSH2 0xD10 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x517 SWAP2 SWAP1 PUSH2 0x1BE0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x52C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x535 PUSH2 0xD16 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x53F PUSH2 0xE7A JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x54D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x556 PUSH2 0x11E3 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x564 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x56D PUSH2 0x146C JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x57A SWAP2 SWAP1 PUSH2 0x19C5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x5DE SWAP3 SWAP2 SWAP1 PUSH2 0x1A40 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x5F8 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x60C JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x630 SWAP2 SWAP1 PUSH2 0x1783 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS DUP5 DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x68E SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1A09 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x6A8 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x6BC JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x6E0 SWAP2 SWAP1 PUSH2 0x1783 JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x4 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x4 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x7 PUSH1 0x20 MSTORE DUP1 PUSH1 0x0 MSTORE PUSH1 0x40 PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP2 POP SWAP1 POP SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH2 0x837 PUSH1 0x7 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x832 PUSH1 0x5 SLOAD PUSH32 0x0 PUSH2 0x1495 JUMP JUMPDEST PUSH2 0x14AB JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH6 0xE35FA931A000 SWAP1 POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x8BF SWAP3 SWAP2 SWAP1 PUSH2 0x1A40 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x8D9 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x8ED JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x911 SWAP2 SWAP1 PUSH2 0x1783 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS CALLER DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x96F SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1A09 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x989 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x99D JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x9C1 SWAP2 SWAP1 PUSH2 0x1783 JUMP JUMPDEST POP PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x2 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0xA6B PUSH1 0x4 SLOAD PUSH1 0x2 SLOAD PUSH2 0x14C1 JUMP JUMPDEST JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD CALLER ADDRESS DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xAF2 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1A09 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xB0C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xB20 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xB44 SWAP2 SWAP1 PUSH2 0x1783 JUMP JUMPDEST POP PUSH1 0x1 PUSH1 0x3 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH2 0xB6B DUP2 PUSH1 0x2 PUSH2 0x1495 JUMP JUMPDEST PUSH1 0x4 DUP2 SWAP1 SSTORE POP PUSH2 0xB7D DUP2 PUSH1 0x4 SLOAD PUSH2 0x168D JUMP JUMPDEST PUSH1 0x5 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x70A08231 DUP4 PUSH1 0x40 MLOAD DUP3 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xBE1 SWAP2 SWAP1 PUSH2 0x19C5 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xBF9 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH2 0xC0D JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xC31 SWAP2 SWAP1 PUSH2 0x17D5 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xDD62ED3E DUP4 ADDRESS PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xCB9 SWAP3 SWAP2 SWAP1 PUSH2 0x19E0 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xCD1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH2 0xCE5 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xD09 SWAP2 SWAP1 PUSH2 0x17D5 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x5 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0xDA4 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xD9B SWAP1 PUSH2 0x1B40 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 SELFBALANCE SWAP1 POP PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH1 0x40 MLOAD PUSH2 0xDF0 SWAP1 PUSH2 0x19B0 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP8 GAS CALL SWAP3 POP POP POP RETURNDATASIZE DUP1 PUSH1 0x0 DUP2 EQ PUSH2 0xE2D JUMPI PUSH1 0x40 MLOAD SWAP2 POP PUSH1 0x1F NOT PUSH1 0x3F RETURNDATASIZE ADD AND DUP3 ADD PUSH1 0x40 MSTORE RETURNDATASIZE DUP3 MSTORE RETURNDATASIZE PUSH1 0x0 PUSH1 0x20 DUP5 ADD RETURNDATACOPY PUSH2 0xE32 JUMP JUMPDEST PUSH1 0x60 SWAP2 POP JUMPDEST POP POP SWAP1 POP DUP1 PUSH2 0xE76 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xE6D SWAP1 PUSH2 0x1B00 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP POP JUMP JUMPDEST PUSH32 0x0 CALLVALUE LT ISZERO PUSH2 0xEDD JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xED4 SWAP1 PUSH2 0x1BC0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH32 0x0 CALLVALUE GT ISZERO PUSH2 0xF40 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xF37 SWAP1 PUSH2 0x1B60 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO PUSH2 0xF90 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xF87 SWAP1 PUSH2 0x1B20 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLVALUE PUSH1 0x2 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0xFA2 SWAP2 SWAP1 PUSH2 0x1C17 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH32 0x0 PUSH1 0x2 SLOAD GT ISZERO PUSH2 0x100E JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1005 SWAP1 PUSH2 0x1BA0 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x1037 PUSH32 0x0 PUSH2 0x16A3 JUMP JUMPDEST PUSH1 0x2 SLOAD LT PUSH2 0x105B JUMPI PUSH1 0x1 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP JUMPDEST PUSH1 0x0 DUP1 JUMPDEST PUSH1 0x6 SLOAD DUP2 LT ISZERO PUSH2 0x10E8 JUMPI CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x8 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x10D5 JUMPI PUSH1 0x1 SWAP2 POP JUMPDEST DUP1 DUP1 PUSH2 0x10E0 SWAP1 PUSH2 0x1DAA JUMP JUMPDEST SWAP2 POP POP PUSH2 0x105F JUMP JUMPDEST POP PUSH1 0x0 ISZERO ISZERO DUP2 ISZERO ISZERO EQ PUSH2 0x1130 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1127 SWAP1 PUSH2 0x1B80 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLER PUSH1 0x8 PUSH1 0x0 PUSH1 0x6 SLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP CALLVALUE PUSH1 0x7 PUSH1 0x0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH1 0x6 PUSH1 0x0 DUP2 SLOAD DUP1 SWAP3 SWAP2 SWAP1 PUSH2 0x11DB SWAP1 PUSH2 0x1DAA JUMP JUMPDEST SWAP2 SWAP1 POP SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x1271 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1268 SWAP1 PUSH2 0x1B40 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 JUMPDEST PUSH1 0x6 SLOAD DUP2 LT ISZERO PUSH2 0x144E JUMPI PUSH1 0x0 PUSH1 0x8 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP PUSH1 0x0 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH1 0x40 MLOAD PUSH2 0x1320 SWAP1 PUSH2 0x19B0 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP8 GAS CALL SWAP3 POP POP POP RETURNDATASIZE DUP1 PUSH1 0x0 DUP2 EQ PUSH2 0x135D JUMPI PUSH1 0x40 MLOAD SWAP2 POP PUSH1 0x1F NOT PUSH1 0x3F RETURNDATASIZE ADD AND DUP3 ADD PUSH1 0x40 MSTORE RETURNDATASIZE DUP3 MSTORE RETURNDATASIZE PUSH1 0x0 PUSH1 0x20 DUP5 ADD RETURNDATACOPY PUSH2 0x1362 JUMP JUMPDEST PUSH1 0x60 SWAP2 POP JUMPDEST POP POP SWAP1 POP DUP1 PUSH2 0x13A6 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x139D SWAP1 PUSH2 0x1B00 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 PUSH1 0x2 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0x13B8 SWAP2 SWAP1 PUSH2 0x1CF8 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH1 0x8 PUSH1 0x0 DUP6 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 SSTORE PUSH1 0x7 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SSTORE POP POP POP DUP1 DUP1 PUSH2 0x1446 SWAP1 PUSH2 0x1DAA JUMP JUMPDEST SWAP2 POP POP PUSH2 0x1274 JUMP JUMPDEST POP PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x14A3 SWAP2 SWAP1 PUSH2 0x1C6D JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x14B9 SWAP2 SWAP1 PUSH2 0x1C9E JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 PUSH32 0x0 DUP5 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x153C SWAP3 SWAP2 SWAP1 PUSH2 0x1A40 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x1556 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x156A JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x158E SWAP2 SWAP1 PUSH2 0x1783 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xF305D719 DUP3 PUSH32 0x0 DUP6 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND TIMESTAMP PUSH1 0x40 MLOAD DUP9 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1634 SWAP7 SWAP6 SWAP5 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1A69 JUMP JUMPDEST PUSH1 0x60 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x164D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x1661 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x1686 SWAP2 SWAP1 PUSH2 0x17FE JUMP JUMPDEST POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x169B SWAP2 SWAP1 PUSH2 0x1CF8 JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x64 DUP4 PUSH1 0x63 PUSH2 0x16B5 SWAP2 SWAP1 PUSH2 0x1C9E JUMP JUMPDEST PUSH2 0x16BF SWAP2 SWAP1 PUSH2 0x1C6D JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x16D9 DUP2 PUSH2 0x1FBF JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH2 0x16EE DUP2 PUSH2 0x1FD6 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x1703 DUP2 PUSH2 0x1FED JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH2 0x1718 DUP2 PUSH2 0x1FED JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1730 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x173E DUP5 DUP3 DUP6 ADD PUSH2 0x16CA JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x175A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1768 DUP6 DUP3 DUP7 ADD PUSH2 0x16CA JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x1779 DUP6 DUP3 DUP7 ADD PUSH2 0x16F4 JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1795 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x17A3 DUP5 DUP3 DUP6 ADD PUSH2 0x16DF JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x17BE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x17CC DUP5 DUP3 DUP6 ADD PUSH2 0x16F4 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x17E7 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x17F5 DUP5 DUP3 DUP6 ADD PUSH2 0x1709 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 PUSH1 0x60 DUP5 DUP7 SUB SLT ISZERO PUSH2 0x1813 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1821 DUP7 DUP3 DUP8 ADD PUSH2 0x1709 JUMP JUMPDEST SWAP4 POP POP PUSH1 0x20 PUSH2 0x1832 DUP7 DUP3 DUP8 ADD PUSH2 0x1709 JUMP JUMPDEST SWAP3 POP POP PUSH1 0x40 PUSH2 0x1843 DUP7 DUP3 DUP8 ADD PUSH2 0x1709 JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 POP SWAP3 JUMP JUMPDEST PUSH2 0x1856 DUP2 PUSH2 0x1D2C JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1865 DUP2 PUSH2 0x1D3E JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1874 DUP2 PUSH2 0x1D74 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1883 DUP2 PUSH2 0x1D98 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1896 PUSH1 0x14 DUP4 PUSH2 0x1C06 JUMP JUMPDEST SWAP2 POP PUSH2 0x18A1 DUP3 PUSH2 0x1E51 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x18B9 PUSH1 0x16 DUP4 PUSH2 0x1C06 JUMP JUMPDEST SWAP2 POP PUSH2 0x18C4 DUP3 PUSH2 0x1E7A JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x18DC PUSH1 0x9 DUP4 PUSH2 0x1C06 JUMP JUMPDEST SWAP2 POP PUSH2 0x18E7 DUP3 PUSH2 0x1EA3 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x18FF PUSH1 0x0 DUP4 PUSH2 0x1BFB JUMP JUMPDEST SWAP2 POP PUSH2 0x190A DUP3 PUSH2 0x1ECC JUMP JUMPDEST PUSH1 0x0 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1922 PUSH1 0x18 DUP4 PUSH2 0x1C06 JUMP JUMPDEST SWAP2 POP PUSH2 0x192D DUP3 PUSH2 0x1ECF JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1945 PUSH1 0x2B DUP4 PUSH2 0x1C06 JUMP JUMPDEST SWAP2 POP PUSH2 0x1950 DUP3 PUSH2 0x1EF8 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1968 PUSH1 0x27 DUP4 PUSH2 0x1C06 JUMP JUMPDEST SWAP2 POP PUSH2 0x1973 DUP3 PUSH2 0x1F47 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x198B PUSH1 0x1A DUP4 PUSH2 0x1C06 JUMP JUMPDEST SWAP2 POP PUSH2 0x1996 DUP3 PUSH2 0x1F96 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x19AA DUP2 PUSH2 0x1D6A JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x19BB DUP3 PUSH2 0x18F2 JUMP JUMPDEST SWAP2 POP DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x19DA PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x184D JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP PUSH2 0x19F5 PUSH1 0x0 DUP4 ADD DUP6 PUSH2 0x184D JUMP JUMPDEST PUSH2 0x1A02 PUSH1 0x20 DUP4 ADD DUP5 PUSH2 0x184D JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x60 DUP3 ADD SWAP1 POP PUSH2 0x1A1E PUSH1 0x0 DUP4 ADD DUP7 PUSH2 0x184D JUMP JUMPDEST PUSH2 0x1A2B PUSH1 0x20 DUP4 ADD DUP6 PUSH2 0x184D JUMP JUMPDEST PUSH2 0x1A38 PUSH1 0x40 DUP4 ADD DUP5 PUSH2 0x19A1 JUMP JUMPDEST SWAP5 SWAP4 POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP PUSH2 0x1A55 PUSH1 0x0 DUP4 ADD DUP6 PUSH2 0x184D JUMP JUMPDEST PUSH2 0x1A62 PUSH1 0x20 DUP4 ADD DUP5 PUSH2 0x19A1 JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xC0 DUP3 ADD SWAP1 POP PUSH2 0x1A7E PUSH1 0x0 DUP4 ADD DUP10 PUSH2 0x184D JUMP JUMPDEST PUSH2 0x1A8B PUSH1 0x20 DUP4 ADD DUP9 PUSH2 0x19A1 JUMP JUMPDEST PUSH2 0x1A98 PUSH1 0x40 DUP4 ADD DUP8 PUSH2 0x187A JUMP JUMPDEST PUSH2 0x1AA5 PUSH1 0x60 DUP4 ADD DUP7 PUSH2 0x187A JUMP JUMPDEST PUSH2 0x1AB2 PUSH1 0x80 DUP4 ADD DUP6 PUSH2 0x184D JUMP JUMPDEST PUSH2 0x1ABF PUSH1 0xA0 DUP4 ADD DUP5 PUSH2 0x19A1 JUMP JUMPDEST SWAP8 SWAP7 POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1ADF PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x185C JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1AFA PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x186B JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1B19 DUP2 PUSH2 0x1889 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1B39 DUP2 PUSH2 0x18AC JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1B59 DUP2 PUSH2 0x18CF JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1B79 DUP2 PUSH2 0x1915 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1B99 DUP2 PUSH2 0x1938 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1BB9 DUP2 PUSH2 0x195B JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1BD9 DUP2 PUSH2 0x197E JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1BF5 PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x19A1 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1C22 DUP3 PUSH2 0x1D6A JUMP JUMPDEST SWAP2 POP PUSH2 0x1C2D DUP4 PUSH2 0x1D6A JUMP JUMPDEST SWAP3 POP DUP3 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF SUB DUP3 GT ISZERO PUSH2 0x1C62 JUMPI PUSH2 0x1C61 PUSH2 0x1DF3 JUMP JUMPDEST JUMPDEST DUP3 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1C78 DUP3 PUSH2 0x1D6A JUMP JUMPDEST SWAP2 POP PUSH2 0x1C83 DUP4 PUSH2 0x1D6A JUMP JUMPDEST SWAP3 POP DUP3 PUSH2 0x1C93 JUMPI PUSH2 0x1C92 PUSH2 0x1E22 JUMP JUMPDEST JUMPDEST DUP3 DUP3 DIV SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1CA9 DUP3 PUSH2 0x1D6A JUMP JUMPDEST SWAP2 POP PUSH2 0x1CB4 DUP4 PUSH2 0x1D6A JUMP JUMPDEST SWAP3 POP DUP2 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DIV DUP4 GT DUP3 ISZERO ISZERO AND ISZERO PUSH2 0x1CED JUMPI PUSH2 0x1CEC PUSH2 0x1DF3 JUMP JUMPDEST JUMPDEST DUP3 DUP3 MUL SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1D03 DUP3 PUSH2 0x1D6A JUMP JUMPDEST SWAP2 POP PUSH2 0x1D0E DUP4 PUSH2 0x1D6A JUMP JUMPDEST SWAP3 POP DUP3 DUP3 LT ISZERO PUSH2 0x1D21 JUMPI PUSH2 0x1D20 PUSH2 0x1DF3 JUMP JUMPDEST JUMPDEST DUP3 DUP3 SUB SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1D37 DUP3 PUSH2 0x1D4A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 ISZERO ISZERO SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1D7F DUP3 PUSH2 0x1D86 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1D91 DUP3 PUSH2 0x1D4A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1DA3 DUP3 PUSH2 0x1D6A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1DB5 DUP3 PUSH2 0x1D6A JUMP JUMPDEST SWAP2 POP PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 EQ ISZERO PUSH2 0x1DE8 JUMPI PUSH2 0x1DE7 PUSH2 0x1DF3 JUMP JUMPDEST JUMPDEST PUSH1 0x1 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x12 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH32 0x4661696C656420746F2073656E64204574686572000000000000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x43617020697320616C7265616479207265616368656400000000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x4E6F74206F776E65720000000000000000000000000000000000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST POP JUMP JUMPDEST PUSH32 0x4465706F7369742056616C756520697320546F6F204269670000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x596F75206861766520616C726561647920636F6E747269627574656420746F20 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x7468652070726573616C65000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x52657665727465643A20424E42206465706F73697420776F756C6420676F206F PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x7665722063617000000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x4465706F7369742056616C756520697320546F6F20536D616C6C000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH2 0x1FC8 DUP2 PUSH2 0x1D2C JUMP JUMPDEST DUP2 EQ PUSH2 0x1FD3 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH2 0x1FDF DUP2 PUSH2 0x1D3E JUMP JUMPDEST DUP2 EQ PUSH2 0x1FEA JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH2 0x1FF6 DUP2 PUSH2 0x1D6A JUMP JUMPDEST DUP2 EQ PUSH2 0x2001 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 SGT 0xC8 GAS MSTORE8 DUP1 LOG4 0xFC PUSH31 0xC2697D393E69D3ECA88D7907C80495556E7FE38A6D07FBD864736F6C634300 ADDMOD DIV STOP CALLER ",
    "sourceMap": "5671:7030:0:-:0;;;6063:5;6037:31;;;;;;;;;;;;;;;;;;;;6095:5;6075:25;;;;;;;;;;;;;;;;;;;;6370:1;6344:27;;6545:342;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;6637:4;6631:10;;;;;;6673:7;6652:28;;;;;;6712:7;6691:28;;;;;;6745:13;6730:28;;;;;;;;;;;;6807:42;6769:81;;;;;;;;;;;;6869:10;6861:5;;:18;;;;;;;;;;;;;;;;;;6545:342;;;;5671:7030;;7:143:1;64:5;95:6;89:13;80:22;;111:33;138:5;111:33;:::i;:::-;70:80;;;;:::o;156:143::-;213:5;244:6;238:13;229:22;;260:33;287:5;260:33;:::i;:::-;219:80;;;;:::o;305:753::-;402:6;410;418;426;475:3;463:9;454:7;450:23;446:33;443:2;;;492:1;489;482:12;443:2;535:1;560:64;616:7;607:6;596:9;592:22;560:64;:::i;:::-;550:74;;506:128;673:2;699:64;755:7;746:6;735:9;731:22;699:64;:::i;:::-;689:74;;644:129;812:2;838:64;894:7;885:6;874:9;870:22;838:64;:::i;:::-;828:74;;783:129;951:2;977:64;1033:7;1024:6;1013:9;1009:22;977:64;:::i;:::-;967:74;;922:129;433:625;;;;;;;:::o;1064:96::-;1101:7;1130:24;1148:5;1130:24;:::i;:::-;1119:35;;1109:51;;;:::o;1166:126::-;1203:7;1243:42;1236:5;1232:54;1221:65;;1211:81;;;:::o;1298:77::-;1335:7;1364:5;1353:16;;1343:32;;;:::o;1381:122::-;1454:24;1472:5;1454:24;:::i;:::-;1447:5;1444:35;1434:2;;1493:1;1490;1483:12;1434:2;1424:79;:::o;1509:122::-;1582:24;1600:5;1582:24;:::i;:::-;1575:5;1572:35;1562:2;;1621:1;1618;1611:12;1562:2;1552:79;:::o;5671:7030:0:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;"
  }
  if (connectedTokenAddress == null) {
    console.log("Not connected to a BEP-20 Token, NO PRESALE DEPLOYED");
    return;
  }

  // The factory we use for deploying contracts
  let factory = new ethers.ContractFactory(abi, bytecode, signer);

  // Deploy an instance of the contract

  //it takes cap, minbnb, maxbnb, token address
  console.log("Using Token address: " + connectedTokenAddress);
  let contract = await factory.deploy(
    ethers.BigNumber.from("200000000000000000"),
    ethers.BigNumber.from("100000000000000000"),
    ethers.BigNumber.from("200000000000000000"),
    connectedTokenAddress
  );

  // The address is available immediately, but the contract
  // is NOT deployed yet
  console.log(contract.address);

  const receipt = await contract.deployTransaction.wait();
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
}

var pancake_factory;
async function addLiquidity() {
  //bnb = ethers.utils.parseEther( bnb_ )

  const tx = {
    from: signer.getAddress(),
    nonce: signer.getTransactionCount("latest"),
    gasPrice: 10500000000,
    gasLimit: 5000000,
  };

  const sent = await AnyTokenContract.approve(
    "0xfd1e8c5942d1cb264b1734d3d9b007c31013e399",
    ethers.BigNumber.from(
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    )
  );
  document.querySelector("#load_approve").textContent = "Processing";
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("Payer: ", receipt["from"]);
  if (receipt["status"] == 1) {
    document.querySelector("#load_approve").textContent = "Success";
    console.log(":)");
  } else {
    document.querySelector("#load_approve").textContent = "Failed";
  }
}

const MainContent = ({ title, subtitle, logo }) => {
  return (
    <div style={{ height: "845px" }}>
      <h2>{title}</h2>
      <p style={{ fontStyle: "italic" }}>{subtitle}</p>

      <Button
        onClick={connect}
        variant="contained"
        color="primary"
        disableElevation
      >
        Connect Wallet
      </Button>
      <br/> <br/>
      <div class="wallet-info">
        Address: <span id="address">-</span> <br />
        Balance: <span id="balance">0</span> BNB <br />
        Chain: <span id="chain">-</span>
      </div>
      <h5>Token details:</h5>
      <p>
        Name: <span class="t_name">-</span> <br />
        Symbol: <span id="t_symbol">-</span>
      </p>

      <h5>Developer Zone:</h5>
      <Button
        onClick={DeployPresale}
        variant="contained"
        color="primary"
        disableElevation
      >
        deploy
      </Button>

      <Button
        onClick={approvePreSale}
        variant="contained"
        color="primary"
        disableElevation
      >
        APPROVE
      </Button>
      <p></p>
      <Button
        onClick={depositPreSaleTokens_}
        variant="contained"
        color="primary"
        disableElevation
      >
        DEPOSIT TOKENS
      </Button>
      <p></p>

      <div class="presale-info">
        <h5>User Zone:</h5>
        <input id="presale_address_input"></input>
        <br /> <br />
        <Button
          onClick={PreSaleConnection}
          variant="contained"
          color="primary"
          disableElevation
        >
          Connect to presale
        </Button>
        <br />
        <br />
        <p>
          Total BNB Raised: <span id="bnbRaised">0</span> BNB
        </p>
        <p>
          BNB Cap: <span id="cap">0</span> BNB
        </p>
        <p>
          Min BNB Contribution: <span id="minBNB">0</span> BNB
        </p>
        <p>
          Max BNB Contribution: <span id="maxBNB">0</span> BNB
        </p>
        <p>
          My BNB Contribution: <span id="myContribution">0</span> BNB
        </p>
        <p>
          My Token Allocation: <span id="myAllocation">0</span>
          <span class="t_name"></span>
        </p>
        <input id="presale_bnb_input"></input>
      </div>
      <br />
      <Button
        onClick={depositBNB}
        variant="contained"
        color="primary"
        disableElevation
      >
        Contribute BNB
      </Button>
      <p></p>
      <Button
        onClick={fin}
        variant="contained"
        color="primary"
        disableElevation
      >
        Finalize
      </Button>
      <Button
        onClick={claimTokens}
        variant="contained"
        color="primary"
        disableElevation
      >
        Claim Tokens
      </Button>


      <p>
        <span id="load_approve"></span>
      </p>
    </div>
  );
};

const WarnItem = ({ title, text }) => {
  const textStyle = { textAlign: "left" };
  const headStyle = { textAlign: "left", color: "red" };
  return (
    <>
      <h3 style={headStyle}>{title}</h3>
      <p style={textStyle}>{text}</p>
    </>
  );
};

const Warnings = () => {
  return (
    <div style={{ height: "845px" }}>
      <h1>Warnings</h1>
      <WarnItem
        title="Code Scanning Results:"
        text="No common malicious code found"
      />
      <WarnItem
        title="Exact Bytecode found"
        text="This token is a Safemoon Fork"
      />
    </div>
  );
};

const LeftPanel = () => {
  return (
    <Grid item sm={3} xs={12}>
      <Item>
        <Warnings />
      </Item>
    </Grid>
  );
};

const CenterPanel = () => {
  return (
    <Grid item sm={6} xs={12}>
      <Item>
        <MainContent
          title="Presale "
        />
      </Item>
    </Grid>
  );
};

const RightPanel = () => {
  return (
    <Grid item sm={3} xs={12}>
      <Item>
        <img src="disqus.png" alt="disqus comments" />
      </Item>
    </Grid>
  );
};

function BasicGrid() {
  return (
    <div style={{ marginTop: "3vh", backgroundColor: "gray" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </Grid>
      </Box>
    </div>
  );
}

export default BasicGrid;
