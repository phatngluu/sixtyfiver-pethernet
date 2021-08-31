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
    const FAKE_MEDICAL_UNIT_ADDRESS = accounts[2];
    const REVERT_ERROR_MESSAGE = "Returned error: VM Exception while processing transaction: revert";

    it('issueCertificate_noPrivilegeWithMedicalUnit_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const patientHash = "issueCertificate_noPrivilegeWithMedicalUnit_throwsException_patientHash";
        const vaccineDoseHash = "issueCertificate_noPrivilegeWithMedicalUnit_throwsException_vaccineDoseHash";
        const medicalUnitHash = "issueCertificate_noPrivilegeWithMedicalUnit_throwsException_medUnitHash";
        const certHash = "issueCertificate_noPrivilegeWithMedicalUnit_throwsException_certHash";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

        // Act & Assert
        await assertThrows(async () => {
            await instance.issueCertificate(medicalUnitHash, patientHash, vaccineDoseHash, certHash, { from: FAKE_MEDICAL_UNIT_ADDRESS });
        }, "Medical unit is not matched.");
    });

    it('issueCertificate_noPrivilegeWithVaccine_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const patientHash = "issueCertificate_noPrivilegeWithVaccine_throwsException_patientHash";
        const vaccineDoseHash = "issueCertificate_noPrivilegeWithVaccine_throwsException_vaccineDoseHash";
        await instance.addVaccineDose(vaccineDoseHash, { from: MINISTRY_OF_HEALTH_ADDRESS });
        const medicalUnitHash = "issueCertificate_noPrivilegeWithVaccine_throwsException_medUnitHash";
        const certHash = "issueCertificate_noPrivilegeWithVaccine_throwsException_certHash";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

        // Act & Assert
        await assertThrows(async () => {
            await instance.issueCertificate(medicalUnitHash, patientHash, vaccineDoseHash, certHash, { from: MEDICAL_UNIT_ADDRESS });
        }, "Vaccine dose does not belong to this Medical Unit.");
    });

    it('issueCertificate_duplicatedCertificate_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const patientHash = "issueCertificate_duplicatedCertificate_throwsException_patientHash";
        const vaccineDoseHash = "issueCertificate_duplicatedCertificate_throwsException_vaccineDoseHash";
        await instance.addVaccineDose(vaccineDoseHash, { from: MINISTRY_OF_HEALTH_ADDRESS });
        const medicalUnitHash = "issueCertificate_duplicatedCertificate_throwsException_medUnitHash";
        const certHash = "issueCertificate_duplicatedCertificate_throwsException_certHash";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

        // Act & Assert
        await assertThrows(async () => {
            await instance.issueCertificate(medicalUnitHash, patientHash, vaccineDoseHash, certHash, { from: MEDICAL_UNIT_ADDRESS });
        }, "Vaccine dose does not belong to this Medical Unit.");
    });

    it('issueCertificate_existedCertificate_throwsException', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const patientHash = "issueCertificate_existedCertificate_throwsException_patientHash";
        const vaccineDoseHash = "issueCertificate_existedCertificate_throwsException_vaccineDoseHash";
        await instance.addVaccineDose(vaccineDoseHash, { from: MINISTRY_OF_HEALTH_ADDRESS });
        const medicalUnitHash = "issueCertificate_existedCertificate_throwsException_medUnitHash";
        const certHash = "issueCertificate_existedCertificate_throwsException_certHash";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

        // Act & Assert
        await assertThrows(async () => {
            await instance.issueCertificate(medicalUnitHash, patientHash, vaccineDoseHash, certHash, { from: MEDICAL_UNIT_ADDRESS });
        }, "Vaccine dose does not belong to this Medical Unit.");
    });

    it('issueCertificate_validRequest_createSuccessfully', async () => {
        // Arrange
        const instance = await PethernetContract.deployed();
        const patientHash = "issueCertificate_validRequest_throwsException_patientHash";
        const vaccineDoseHash = "issueCertificate_validRequest_throwsException_vaccineDoseHash";
        await instance.addVaccineDose(vaccineDoseHash, { from: MINISTRY_OF_HEALTH_ADDRESS });
        const medicalUnitHash = "issueCertificate_validRequest_throwsException_medUnitHash";
        const certHash = "issueCertificate_validRequest_throwsException_certHash";
        await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);
        await instance.distributeVaccineDoses(medicalUnitHash, [vaccineDoseHash], {from: MINISTRY_OF_HEALTH_ADDRESS});

        // Act
        const response = await instance.issueCertificate(medicalUnitHash, patientHash, vaccineDoseHash, certHash, { from: MEDICAL_UNIT_ADDRESS });
        assertEvent('IssuedCertEvent', response);
        const cert = await instance.checkCertificate(certHash);
        assert.equal(cert[0], medicalUnitHash);
        assert.equal(cert[1], MEDICAL_UNIT_ADDRESS);
        assert.equal(cert[2], patientHash);
        assert.equal(cert[3], vaccineDoseHash);
    });

    // it('distributeVaccineDoses_unexistedMedicalUnit_throwsException', async () => {
    //     // Arrange
    //     const instance = await PethernetContract.deployed();
    //     const vaccineDoseHash = "distributeVaccineDoses_unexistedMedicalUnit_throwsException_vaccine";
    //     const medicalUnitHash = "distributeVaccineDoses_unexistedMedicalUnit_throwsException_medicalUnit";

    //     // Act

    //     // Act & Assert
    //     await assertThrows(async () => {
    //         await instance.distributeVaccineDoses(medicalUnitHash, [vaccineDoseHash], {from: MINISTRY_OF_HEALTH_ADDRESS});
    //     }, "Medical unit is not existed.");
    // });

    // it('distributeVaccineDoses_unexistedVaccineDose_throwsException', async () => {
    //     // Arrange
    //     const instance = await PethernetContract.deployed();
    //     const vaccineDoseHash = "distributeVaccineDoses_unexistedVaccineDose_throwsException_vaccine";
    //     const medicalUnitHash = "distributeVaccineDoses_unexistedVaccineDose_throwsException_medicalUnit";
    //     await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

    //     // Act & Assert
    //     await assertThrows(async () => {
    //         await instance.distributeVaccineDoses(medicalUnitHash, [vaccineDoseHash], {from: MINISTRY_OF_HEALTH_ADDRESS});
    //     }, "Vaccine dose is unexisted or used.");
    // });

    // it('distributeVaccineDoses_emptyVaccineDose_throwsException', async () => {
    //     // Arrange
    //     const instance = await PethernetContract.deployed();
    //     const medicalUnitHash = "distributeVaccineDoses_emptyVaccineDose_throwsException_medicalUnit";
    //     await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

    //     // Act & Assert
    //     await assertThrows(async () => {
    //         await instance.distributeVaccineDoses(medicalUnitHash, [ /* leave empty */ ], {from: MINISTRY_OF_HEALTH_ADDRESS});
    //     }, "Number of vaccine doses should be at least 1.");
    // });

    // it('distributeVaccineDoses_noPrivilege_throwsException', async () => {
    //     // Arrange
    //     const instance = await PethernetContract.deployed();
    //     const medicalUnitHash = "distributeVaccineDoses_noPrivilege_throwsException_medicalUnit";
    //     await instance.addMedicalUnit(medicalUnitHash, MEDICAL_UNIT_ADDRESS);

    //     // Act & Assert
    //     await assertThrows(async () => {
    //         await instance.distributeVaccineDoses(medicalUnitHash, [ /* leave empty */ ], {from: MEDICAL_UNIT_ADDRESS});
    //     }, "This function is restricted to the contract's owner");
    // });
});