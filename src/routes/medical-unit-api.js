require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const { web3, PethernetContractMeta } = require("../web3/web3")

const register = (app) => {

    // only ministry of health can create medical unit
    app.post("/api/medicalunit/add", async (req, res) => {
        // TODO: check existence
        // TODO replace by the address in request
        const medicalUnitOriginAddr = process.env.MEDICAL_UNIT_1;

        const newMedicalUnit = new model.MedicalUnitModel({
            MedCode: req.body.MedCode,
            Address: req.body.Address,
            Contact: req.body.Contact,
            RegisteredOn: new Date(),
            Hash: hash(`${req.body.MedCode}`),
        })

        newMedicalUnit.save(err => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);

                try {
                    pethernetContract.methods.addMedicalUnit(newMedicalUnit.Hash, medicalUnitOriginAddr).send(
                        {
                            from: process.env.PETHERNET_SYSTEM_ADDRESS,
                            gas: 150000,
                        })
                        .on('receipt', function (x) {
                            console.log(x);
                        });
                } catch (err) {
                    console.log(err);
                }

                res.json({ success: true, message: newMedicalUnit })
            }
        })
    });

    app.post("/api/medicalunit/issueCertificate", async (req, res) => {
        // TODO: check existence
        // TODO replace by the address in request
        const medicalUnitOriginAddr = process.env.MEDICAL_UNIT_1;

        const certificate = new model.CertificateModel({
            MedicalUnitHash: req.body.MedicalUnitHash,
            InjectorHash: req.body.InjectorHash,
            DoctorHash: req.body.DoctorHash,
            VaccineDoseHash: req.body.VaccineDoseHash,
            Hash: hash(`${req.body.MedicalUnitHash}${req.body.InjectorHash}${req.body.DoctorHash}${req.body.VaccineDoseHash}`),
        })

        certificate.save(err => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);

                try {
                    pethernetContract.methods.issueCertificate(
                        certificate.MedicalUnitHash,
                        certificate.InjectorHash,
                        certificate.DoctorHash,
                        certificate.VaccineDoseHash,
                        certificate.Hash).send(
                        {
                            from: process.env.MEDICAL_UNIT_1,
                            gas: 150000,
                        })
                        .on('receipt', function (x) {
                            console.log(x);
                        });
                } catch (err) {
                    console.log(err);
                }

                res.json({ success: true, message: certificate })
            }
        })
    });
}

module.exports = { register };