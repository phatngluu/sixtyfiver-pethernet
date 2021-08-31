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

    it('distributeVaccineDoses_validRequest_distributedSuccessfully', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const vaccineDoseHash = "distributeVaccineDoses_validRequest_distributedSuccessfully_vaccine";
        await instance.addVaccineDose(vaccineDoseHash);

        const medicalUnitHash = "distributeVaccineDoses_validRequest_distributedSuccessfully_medicalUnit";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

        // Act
        const result = await instance.distributeVaccineDoses(medicalUnitHash, [vaccineDoseHash], {from: MINISTRY_OF_HEALTH_ADDRESS});

        // Assert
        assertEvent('DistributedVaccinDoseAddedEvent', result);
        const medAddress = await instance.checkVaccineDose(vaccineDoseHash);
        assert.equal(MEDICAL_UNIT_ADDRESS, medAddress);
    });

    it('distributeVaccineDoses_unexistedMedicalUnit_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const vaccineDoseHash = "distributeVaccineDoses_unexistedMedicalUnit_throwsException_vaccine";
        const medicalUnitHash = "distributeVaccineDoses_unexistedMedicalUnit_throwsException_medicalUnit";

        // Act

        // Act & Assert
        await assertThrows(async () => {
            await instance.distributeVaccineDoses(medicalUnitHash, [vaccineDoseHash], {from: MINISTRY_OF_HEALTH_ADDRESS});
        }, "Medical unit is not existed.");
    });

    it('distributeVaccineDoses_unexistedVaccineDose_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const vaccineDoseHash = "distributeVaccineDoses_unexistedVaccineDose_throwsException_vaccine";
        const medicalUnitHash = "distributeVaccineDoses_unexistedVaccineDose_throwsException_medicalUnit";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

        // Act & Assert
        await assertThrows(async () => {
            await instance.distributeVaccineDoses(medicalUnitHash, [vaccineDoseHash], {from: MINISTRY_OF_HEALTH_ADDRESS});
        }, "Vaccine dose is unexisted or used.");
    });

    it('distributeVaccineDoses_emptyVaccineDose_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const medicalUnitHash = "distributeVaccineDoses_emptyVaccineDose_throwsException_medicalUnit";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

        // Act & Assert
        await assertThrows(async () => {
            await instance.distributeVaccineDoses(medicalUnitHash, [ /* leave empty */ ], {from: MINISTRY_OF_HEALTH_ADDRESS});
        }, "Number of vaccine doses should be at least 1.");
    });

    it('distributeVaccineDoses_noPrivilege_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const medicalUnitHash = "distributeVaccineDoses_noPrivilege_throwsException_medicalUnit";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

        // Act & Assert
        await assertThrows(async () => {
            await instance.distributeVaccineDoses(medicalUnitHash, [ /* leave empty */ ], {from: MEDICAL_UNIT_ADDRESS});
        }, "This function is restricted to the contract's owner");
    });
});