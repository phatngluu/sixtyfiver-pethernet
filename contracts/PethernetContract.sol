// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

contract PethernetContract {
    // Ministry of Health's account address 
    address public ministryOfHealthAddr = msg.sender;
    string[] public medicalUnitsList;
    string[] public vaccineDosesList;
    string[] public certificatesList;
    
    // Medical Unit hash => Medical Unit account address
    mapping (string => address) medicalUnits;
    // Vaccine Dose hash => address of owner (Medical Unit or by default Ministry of Health)
    mapping (string => address) vaccineDoses;
    // Certificate hash => Medical Unit address account
    mapping (string => Certificate) certificates;

    /** Event */
    event MedicalUnitAddedEvent(string _medicalUnitHash, address _medicalUnitAddr);
    event VaccinDoseAddedEvent(string _vaccineDoseHash);
    event DistributedVaccinDoseAddedEvent(string _vaccineDoseHash, string _medicalUnitHash);
    event IssuedCertEvent(string _certificateHash, string _patientHash);

    modifier ministryOfHealthRestricted() {
        require(
            msg.sender == ministryOfHealthAddr,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    struct Certificate {
        string issuer; // Medical unit address
        address issuerAddr;
        string patient;
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
        emit VaccinDoseAddedEvent(_vaccineDoseHash);
    }

    function distributeVaccineDoses(string memory _medicalUnitHash, string[] memory _vaccineDoseHashes) public ministryOfHealthRestricted {
        require(
            medicalUnits[_medicalUnitHash] != address(0),
            "Medical unit is not existed."
        );

        require(
            _vaccineDoseHashes.length > 0,
            "Number of vaccine doses should be at least 1."
        );

        for (uint i = 0; i < _vaccineDoseHashes.length; i++) {
            require(
                vaccineDoses[_vaccineDoseHashes[i]] == ministryOfHealthAddr,
                "Vaccine dose is unexisted or used."
            );

            vaccineDoses[_vaccineDoseHashes[i]] = medicalUnits[_medicalUnitHash];
            emit DistributedVaccinDoseAddedEvent(_vaccineDoseHashes[i], _medicalUnitHash);
        }
    }

    function issueCertificate(
        string memory _medicalUnitHash,
        string memory _patientHash,
        string memory _vaccineDoseHash,
        string memory _certificateHash) public {
        require(
            medicalUnits[_medicalUnitHash] == msg.sender,
            "Medical unit is not matched."
        );
        require(
            vaccineDoses[_vaccineDoseHash] == msg.sender,
            "Vaccine dose does not belong to this Medical Unit."
        );
        require(
            certificates[_certificateHash].issuerAddr == address(0),
            "Certificate is already existed."
        );
        
        certificatesList.push(_certificateHash);
        certificates[_certificateHash] = Certificate(_medicalUnitHash, msg.sender, _patientHash, _vaccineDoseHash);
        emit IssuedCertEvent(_certificateHash, _patientHash);
    }

    function checkVaccineDose(string memory _vaccineDoseHash) public view returns(address _owner) {
        return vaccineDoses[_vaccineDoseHash];
    }

    function checkMedicalUnit(string memory _medicalUnitHash) public view returns(address _owner) {
        return medicalUnits[_medicalUnitHash];
    }

    function checkCertificate(string memory _certificateHash) public view returns (Certificate memory) {
        return certificates[_certificateHash];
    }
    
    function vaccineDosesListGetter() public view returns (string[] memory) {
        return vaccineDosesList;
    }

    function medicalUnitsListGetter() public view returns (string[] memory) {
        return medicalUnitsList;
    }
}