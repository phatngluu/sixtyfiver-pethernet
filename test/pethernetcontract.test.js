require("dotenv").config();

const PethernetContract = artifacts.require("PethernetContract");

contract("PethernetContract", (accounts) => {
    it ('should create vaccine dose', async () => {
        const instance = await PethernetContract.deployed();
        ministryAddress = accounts.find(x => x == process.env.MINISTRY_OF_HEALTH_ADDRESS);

        const vaccineDoseHash = "abc";
        const result = await instance.addVaccineDose(vaccineDoseHash);
        console.log(result);
        asssert.true(instance.checkVaccineDose(vaccineDoseHash));
    });
});