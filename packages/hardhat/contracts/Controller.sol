// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// withdraw tokens → https://stackoverflow.com/a/73452462/2430102

import "hardhat/console.sol";

contract Controller is Ownable {
	//--------------------------------------------------------------

	event Deposit(address indexed sender, uint256 amount);
	event Withdrawal(address indexed receiver, uint256 amount);
	event NewTraining(uint256 id, string name);

	//--------------------------------------------------------------

	mapping(address => bool) public members;

	struct Training {
		uint256 id;
		string name;
	}
	Training[] public trainings;
	uint256 private lastTrainingID = 0;

	mapping(address => uint256[]) public performed;

	//--------------------------------------------------------------

	constructor(address initialOwner) Ownable(initialOwner) {}

	//--------------------------------------------------------------

	receive() external payable {
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

	function getLastTrainingID() public view onlyOwner returns (uint256) {
		return lastTrainingID;
	}

	function addTraining(string calldata name) external {
		uint256 id = ++lastTrainingID;
		trainings.push(Training({ id: id, name: name }));
		emit NewTraining(id, name);
	}

	//--------------------------------------------------------------

	function withdraw(uint256 _amount) external {
		require(address(this).balance >= _amount, "Insufficient balance");

		payable(msg.sender).transfer(_amount);
		// msg.sender.call{ value: amount }("");

		emit Withdrawal(msg.sender, _amount);
	}

	//--------------------------------------------------------------
}
