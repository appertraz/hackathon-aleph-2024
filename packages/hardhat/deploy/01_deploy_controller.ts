import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployController: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Controller", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  const controller = await hre.ethers.getContract<Contract>("Controller", deployer);

  // TODO: This should have an interface in UI

  await controller.setReward(100000000000000000n); // 0.1 matic
  await controller.setMinTrainingsForReward(3n); //   number
  await controller.setMinTimeForWithdrawal(30n); //   seconds

  await controller.addTraining("Capacitación 1");
  await controller.addTraining("Capacitación 2");
  await controller.addTraining("Capacitación 3");
  await controller.addTraining("Capacitación 4");
  await controller.addTraining("Capacitación 5");
};

export default deployController;

deployController.tags = ["Controller"];
