require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const { PethernetContractMeta } = require("../web3/web3");

const register = (app) => {
    app.get("/api/contractABI", async (req, res) => {
        res.json({ success: true, message: PethernetContractMeta.abi })
    })

    app.get("/api/contractAddress", async (req, res) => {
        res.json({ success: true, message: process.env.PETHERNET_CONTRACT_ADDRESS })
    })
};

module.exports = { register };