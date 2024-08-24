// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

//
//
// FIXME: Add `onlyOwner` to the necessary functions
//
//

contract Controller is Ownable {
	//--------------------------------------------------------------

	event Deposit(address indexed sender, uint256 amount);
	event RewardClaimed(address indexed receiver, uint256 reward);

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

	uint256 public reward = 0.1 * 1e18;
	uint256 public minTrainingsForReward = 3;
	uint256 public minTimeForWithdrawal = 30 seconds;

	mapping(address => uint256) public trainingCount;
	mapping(address => uint256) public trainingTimestamp;

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

	function setReward(uint256 amount) public {
		reward = amount;
	}

	function setMinTrainingsForReward(uint256 number) public {
		minTrainingsForReward = number;
	}

	function setMinTimeForWithdrawal(uint256 time) public {
		minTimeForWithdrawal = time;
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

		trainingCount[wallet]++;

		if (trainingCount[wallet] == 1) {
			trainingTimestamp[wallet] = block.timestamp;
		}

		emit ApprovedTraining(wallet, id);
	}

	//--------------------------------------------------------------

	function withdraw() public {
		address payable receiver = payable(msg.sender);

		// Checks

		require(
			trainingCount[receiver] >= minTrainingsForReward,
			"Not enough trainings completed for reward"
		);

		require(
			block.timestamp >= trainingTimestamp[receiver] + minTimeForWithdrawal,
			"Withdrawal time not reached"
		);

		require(address(this).balance >= reward, "Not enough funds in contract");

		// Transfer

		(bool success, ) = receiver.call{ value: reward }("");
		require(success, "Transfer failed");

		emit RewardClaimed(receiver, reward);
	}

	//--------------------------------------------------------------
}
