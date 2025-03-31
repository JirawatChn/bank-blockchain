let web3;
let contract;
let account;

const abi = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "checkBlance",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

function logOutput(text) {
    document.getElementById('alert').innerText = text;
}

const connectAccount = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();

    const accounts = await web3.eth.getAccounts();
    account = accounts[0];

    const contractAddress = "0x09b32069ef69B21AAd1fdbD5462a515c543053E8";
    contract = new web3.eth.Contract(abi, contractAddress);

	document.getElementById("account").value = account;

	const balance = await contract.methods.checkBlance().call({ from: account });

	document.getElementById("balance").value = balance;
	document.getElementById("details").classList.remove("hidden");

	logOutput("Connected Successfully!");

} else {
    alert("Please install MetaMask");
  }
};

const deposit = async () => {
	const amount = document.getElementById("deposit").value;
	const amountNumber = parseFloat(amount);

	if (!account) {
		logOutput("Please connect your wallet first.");
		return;
	}

	else if (!amount || isNaN(amountNumber) || amountNumber <= 0) {
		logOutput("Please enter a valid amount to deposit.");
		return;
	} else{
		try{
			logOutput("Depositing...")
			await contract.methods.deposit().send({
				from: account,
				value: web3.utils.toWei(amount, "wei"),
			});
			logOutput("Deposit successful!");
		}catch(err){
			logOutput(`${err.message}`);
		}
	}

};

const withdraw = async () => {
	const amount = document.getElementById("withdraw").value;
	const amountNumber = parseFloat(amount);

	if (!account) {
		logOutput("Please connect your wallet first.");
		return;
	}

	else if (!amount || isNaN(amountNumber) || amountNumber <= 0) {
		logOutput("Please enter a valid amount to withdraw.");
		return;
	} else{
		try{
			logOutput("Withdrawing...")
			await contract.methods.withdraw(web3.utils.toWei(amount, "wei")).send({
				from: account,
			});
			logOutput("Withdraw successful!");
		}catch(err){
			logOutput(`${err.message}`);
		}
	}
}


