// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

contract PethernetContract {
    // Ministry of Health's account address 
    address public ministryOfHealthAddr = msg.sender;
    string[] public medicalUnitsList;
    string[] public vaccineDosesList;
    string[] public certificatesList;
    string[] public doctorsList;
    string[] public injectorsList;

    // Medical Unit hash => Medical Unit account address
    mapping (string => address) medicalUnits;
    // Vaccine Dose hash => address of owner (Medical Unit or by default Ministry of Health)
    mapping (string => address) vaccineDoses;
    // Certificate hash => Medical Unit address account
    mapping (string => Certificate) certificates;

    // Doctor hash => existed?
    mapping (string => bool) doctors;
    // Injector hash => existed?
    mapping (string => bool) injectors;

    /** Event */
    event MedicalUnitAddedEvent(string _medicalUnitHash, address _medicalUnitAddr);

    modifier ministryOfHealthRestricted() {
        require(
            msg.sender == ministryOfHealthAddr,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    struct Certificate {
        address issuer; // Medical unit address
        string injector;
        string doctor;
        string vaccineDose;
    }

    function addMedicalUnit(string memory _medicalUnitHash, address _medicalUnitOriginAddr) public ministryOfHealthRestricted {
        require(
            medicalUnits[_medicalUnitHash] == address(0),
            "Medical unit is already existed."
        );
        
        medicalUnitsList.push(_medicalUnitHash);
        medicalUnits[_medicalUnitHash] = _medicalUnitOriginAddr;

        emit MedicalUnitAddedEvent(_medicalUnitHash, _medicalUnitOriginAddr);
    }

    function addVaccineDose(string memory _vaccineDoseHash) public ministryOfHealthRestricted {
        require(
            vaccineDoses[_vaccineDoseHash] == address(0),
            "Vaccine dose is already existed."
        );

        vaccineDosesList.push(_vaccineDoseHash);
        vaccineDoses[_vaccineDoseHash] = ministryOfHealthAddr;
    }

    function distributeVaccineDose(string memory _vaccineDoseHash, string memory _medicalUnitHash) public ministryOfHealthRestricted {
        require(
            medicalUnits[_medicalUnitHash] != address(0),
            "Medical unit is not existed."
        );
        require(
            vaccineDoses[_vaccineDoseHash] == ministryOfHealthAddr,
            "Vaccine dose is unexisted or used."
        );

        vaccineDoses[_vaccineDoseHash] = medicalUnits[_medicalUnitHash];
    }

    function addDoctor(string memory _doctorHash) public {
        require(
            doctors[_doctorHash] == false,
            "Doctor is already existed"
        );

        doctorsList.push(_doctorHash);
        doctors[_doctorHash] = true;
    }

    function addInjector(string memory _injectorHash) public {
        require(
            injectors[_injectorHash] == false,
            "Injector is already existed"
        );

        injectorsList.push(_injectorHash);
        injectors[_injectorHash] = true;
    }

    function issueCertificate(
        string memory _medicalUnitHash,
        string memory _injectorHash,
        string memory _doctorHash,
        string memory _vaccineDoseHash,
        string memory _certificateHash) public {
        require(
            medicalUnits[_medicalUnitHash] == msg.sender,
            "Medical unit is not matched."
        );
        require(
            injectors[_injectorHash] == true,
            "Injector is not existed."
        );
        require(
            doctors[_doctorHash] == true,
            "Doctor is not existed."
        );
        require(
            vaccineDoses[_vaccineDoseHash] == medicalUnits[_medicalUnitHash],
            "Vaccine dose does not belong to this Medical Unit."
        );
        require(
            certificates[_certificateHash].issuer == address(0),
            "Certificate is already existed."
        );
        
        certificates[_certificateHash] = Certificate(msg.sender, _injectorHash, _doctorHash, _vaccineDoseHash);
    }

    /* Check functions */

    function checkDoctor(string memory _doctorHash) public view returns(bool isExisted) {
        isExisted = doctors[_doctorHash];
    }

    function checkInjector(string memory _injectorHash) public view returns(bool isExisted) {
        isExisted = doctors[_injectorHash];
    }

    function checkCertificate(string memory _certificateHash) public view returns(bool isExisted) {
        isExisted = certificates[_certificateHash].issuer != address(0);
    }

    function checkVaccineDose(string memory _vaccineDoseHash) public view returns(bool isExisted) {
        isExisted = vaccineDoses[_vaccineDoseHash] != address(0);
    }

    function checkMedicalUnit(string memory _medicalUnitHash) public view returns(bool isExisted) {
        isExisted = medicalUnits[_medicalUnitHash] != address(0);
    }
}