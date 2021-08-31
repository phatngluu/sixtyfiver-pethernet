const { assert } = require("chai");

require("dotenv").config();

const PethernetContract = artifacts.require("PethernetContract");

contract("PethernetContract", (accounts) => {
    // first contract is used to deploy contracts to
    // this is also ministry address
    const MINISTRY_OF_HEALTH_ADDRESS = accounts[0];

    it ('should deployed contract', async () => {
        const instance = await PethernetContract.deployed();
        ministryAddress = accounts[0];
        assert.isNotNull(instance);
    })

    it ('should match ministry of health address', async () => {
        const instance = await PethernetContract.deployed();
        const contractOwnerAddr = await instance.ministryOfHealthAddr();
        assert.equal(contractOwnerAddr, MINISTRY_OF_HEALTH_ADDRESS);
    })

    it ('should create vaccine dose', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const vaccineDoseHash = "abc";
        await instance.addVaccineDose(vaccineDoseHash);
        
        // Act
        const result = await instance.checkVaccineDose(vaccineDoseHash);

        // Assert
        assert.equal(MINISTRY_OF_HEALTH_ADDRESS, result);
    });
});