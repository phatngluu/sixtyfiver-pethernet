require("dotenv").config();
const authorize = require("../middleware/auth");
const Role = require('../_helpers/role');
const PethernetContractMeta = require('../contracts/PethernetContract.json');

const register = (app) => {
    app.get("/api/contractABI", async (req, res) => {
        res.json({ success: true, message: PethernetContractMeta.abi })
    })

    app.get("/api/contractAddress", async (req, res) => {
        res.json({ success: true, message: process.env.PETHERNET_CONTRACT_ADDRESS })
    })

    app.get("/api/ministryOfHealthAccountAddress", authorize(Role.MinistryOfHealth), async (req, res) => {
        res.json({ success: true, message: process.env.MINISTRY_OF_HEALTH_ADDRESS })
    });
};

module.exports = { register };