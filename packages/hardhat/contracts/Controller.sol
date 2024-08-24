// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Controller is Ownable {
	//--------------------------------------------------------------

	event Deposit(address indexed sender, uint256 amount);
	event Withdrawal(address indexed receiver, uint256 amount);

	event NewTraining(uint256 id, string name);
	event NewWoman(address indexed wallet);

	event ApprovedTraining(address indexed wallet, uint256 id);

	//--------------------------------------------------------------

	mapping(address => string) public birthProof;

	struct Training {
		uint256 id;
		string name;
	}
	Training[] public trainings;
	uint256 public lastTrainingID = 0;

	mapping(address => uint256[]) public approved;

	//--------------------------------------------------------------

	constructor(address initialOwner) Ownable(initialOwner) {}

	//--------------------------------------------------------------

	receive() external payable {
		require(msg.value > 0, "No funds were sent");
		emit Deposit(msg.sender, msg.value);
	}

	function deposit() external payable {
		require(msg.value > 0, "No funds were sent");
		emit Deposit(msg.sender, msg.value);
	}

	function getBalance() public view returns (uint256) {
		return address(this).balance;
	}

	//--------------------------------------------------------------

	function addTraining(string calldata name) public {
		uint256 id = lastTrainingID++;
		trainings.push(Training({ id: id, name: name }));
		emit NewTraining(id, name);
	}

	//--------------------------------------------------------------

	function addWoman(address wallet, string calldata proof) public {
		birthProof[wallet] = proof;
		emit NewWoman(wallet);
	}

	//--------------------------------------------------------------

	function approvedTraining(address wallet, uint256 id) public {
		approved[wallet].push(id);
		emit ApprovedTraining(wallet, id);
	}

	//--------------------------------------------------------------

	function withdraw(uint256 _amount) public {
		require(address(this).balance >= _amount, "Insufficient balance");

		payable(msg.sender).transfer(_amount);

		emit Withdrawal(msg.sender, _amount);
	}

	//--------------------------------------------------------------
}
