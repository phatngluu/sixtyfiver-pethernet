// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;

contract PethernetContract {
    address public ministryOfHealthAddr = msg.sender;
    string[] public vaccineDoses;

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

    function getVaccineDose() public view returns(uint _vaccineDoses) {
        _vaccineDoses = vaccineDoses.length;
    }
}