require("dotenv").config();
const hash = require("object-hash");
const authorize = require("../middleware/auth");
const model = require("../models/models");
const Role = require('../_helpers/role');
const { PethernetContractMeta } = require("../web3/web3");

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