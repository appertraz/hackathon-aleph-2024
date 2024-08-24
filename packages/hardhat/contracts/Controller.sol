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

	//--------------------------------------------------------------

	mapping(address => string) public birthCertificate;

	struct Training {
		uint256 id;
		string name;
	}
	Training[] public trainings;
	uint256 public lastTrainingID = 0;

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

	function addTraining(string calldata name) external {
		uint256 id = lastTrainingID++;
		trainings.push(Training({ id: id, name: name }));
		emit NewTraining(id, name);
	}

	//--------------------------------------------------------------

	function addWoman(address wallet, string calldata proof) external {
		birthCertificate[wallet] = proof;
		emit NewWoman(wallet);
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
