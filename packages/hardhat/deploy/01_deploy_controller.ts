import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployController: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Controller", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  await hre.ethers.getContract<Contract>("Controller", deployer);
};

export default deployController;

deployController.tags = ["Controller"];
