require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const { web3, PethernetContractMeta } = require("../web3/web3")

const register = (app) => {
    
    // only ministry of health can create medical unit
    app.post("/api/medicalunit/add", async (req, res) => {
        // TODO: check existence

        const newMedicalUnit = new model.MedicalUnitModel({
            MedCode: req.body.MedCode,
            Address: req.body.Address,
            Contact: req.body.Contact,
            RegisteredOn: new Date(),
            Hash: hash(`${req.body.MedCode}`),
        })

        newMedicalUnit.save(err => {
            if(err) {
                res.json({success: false, message: err})
            } else {
                res.json({success: true, message: newMedicalUnit})
            }
        })
    });
}

module.exports = { register };