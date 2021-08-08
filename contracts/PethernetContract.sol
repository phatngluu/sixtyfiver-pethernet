// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

contract PethernetContract {
    address public ministryOfHealthAddr = msg.sender;
    string[] public vaccineDoses;
    string[] public medicalUnits;

    modifier restricted() {
        require(
            msg.sender == ministryOfHealthAddr,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    function addVaccineDose(string memory _vaccineDoseHash) public restricted {
        vaccineDoses.push(_vaccineDoseHash);
    }

    function addMedicalUnit(string memory _medicalUnitHash) public restricted {
        medicalUnits.push(_medicalUnitHash);
    }

    function getVaccineDoses() public view returns(string[] memory _vaccineDoses) {
        _vaccineDoses = vaccineDoses;
    }

    function getMedicalUnits() public view returns(string[] memory _medicalUnits) {
        _medicalUnits = medicalUnits;
    }
}