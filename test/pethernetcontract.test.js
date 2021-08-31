require("dotenv").config();
const { assertThrows, assertEvent } = require("./helper")

// intentionally leave here, uncomment while writing unit test, it will give code suggestion
// const { assert } = require("chai");

const PethernetContract = artifacts.require("PethernetContract");

contract("PethernetContract", (accounts) => {
    // first contract is used to deploy contracts to
    // this is also ministry address
    const MINISTRY_OF_HEALTH_ADDRESS = accounts[0];
    const MEDICAL_UNIT_ADDRESS = accounts[1];
    const REVERT_ERROR_MESSAGE = "Returned error: VM Exception while processing transaction: revert";

    it('should deployed contract', async () => {
        // Arrange & Act
        const instance = await PethernetContract.deployed();

        // Assert
        assert.isNotNull(instance);
    })

    it('ministryOfHealthAddress_match', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();

        // Act
        const contractOwnerAddr = await instance.ministryOfHealthAddr();

        // Assert
        assert.equal(contractOwnerAddr, MINISTRY_OF_HEALTH_ADDRESS);
    })

    it('addMedicalUnit_validRequest_createSuccessfully', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const medicalUnitHash = "addMedicalUnit_validRequest_createSuccessfully";
        
        // Act
        const response = await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);
        
        // Assert
        assertEvent('MedicalUnitAddedEvent', response);
        const result = await instance.checkMedicalUnit(medicalUnitHash);
        assert.equal(MEDICAL_UNIT_ADDRESS, result);
    });

    it('addMedicalUnit_existed_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const medicalUnitHash = "addMedicalUnit_existed_throwsException";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

        // Act & Assert
        await assertThrows(async () => { await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS) });
    });

    it('addVaccineDose_validRequest_createSuccessfully', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const vaccineDoseHash = "addVaccineDose_validRequest_createSuccessfully";
        
        // Act
        const response = await instance.addVaccineDose(vaccineDoseHash);
        
        // Assert
        assertEvent('VaccinDoseAddedEvent', response);
        const result = await instance.checkVaccineDose(vaccineDoseHash);
        assert.equal(MINISTRY_OF_HEALTH_ADDRESS, result);
    });

    it('addVaccineDose_existed_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const vaccineDoseHash = "addVaccineDose_existed_throwsException";
        await instance.addVaccineDose(vaccineDoseHash);

        // Act & Assert
        await assertThrows(async () => {
            await instance.addVaccineDose(vaccineDoseHash);
        }, "Vaccine dose is already existed.");
    });
});