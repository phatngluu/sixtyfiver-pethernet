require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const { web3, PethernetContractMeta } = require("../web3/web3")

const register = (app) => {
    // const oidc = app.locals.oidc;

    app.get("/api/vaccinedose/check", async (req, res) => {
        const vaccineDoseHash = req.query.vaccineDoseHash;

        const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);
        pethernetContract.methods.checkVaccineDose(vaccineDoseHash).call({
            from: process.env.PETHERNET_SYSTEM_ADDRESS,
            gas: 150000
        })
            .then(function (result) {
                res.json({ success: true, message: result })
            });;
    })

    app.post("/api/vaccinedose/add", async (req, res) => {
        const newVaccineDose = new model.VaccineDoseModel({
            DoseId: req.body.doseId,
            LotNo: req.body.lotNo,
            VaccineName: req.body.vaccineName,
            ImportedDate: req.body.importedDate,
            ExpiredDate: req.body.expiredDate,
            MedicalUnitHash: `${process.env.MINISTRY_OF_HEALTH_ADDRESS}`,
            Hash: req.body.hash,
        });

        newVaccineDose.save(err => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, message: newVaccineDose })
            }
        })
    });

    app.post("/api/vaccinedose/distribute", async (req, res) => {
        // TODO: check existence
        const vaccineDoseHash = req.body.vaccineDoseHash;
        const medicalUnitHash = req.body.medicalUnitHash;

        model.VaccineDoseModel.updateOne(
            { Hash: vaccineDoseHash },
            { MedicalUnitHash: medicalUnitHash },
            null,
            (err, msg) => {
                if (err) {
                    res.json({ success: false, message: err })
                } else {
                    const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);
                    pethernetContract.methods.distributeVaccineDose(vaccineDoseHash, medicalUnitHash).send(
                        {
                            from: process.env.MINISTRY_OF_HEALTH_ADDRESS,
                            gas: 150000,
                        })
                        .on('receipt', function (x) {
                            console.log(x);
                        });

                    res.json({ success: true, message: msg })
                }
            });
    });

    app.get('/api/vaccinedose/getAll', async (req, res) => {
        model.VaccineDoseModel.find(
            { MedicalUnitHash: process.env.MINISTRY_OF_HEALTH_ADDRESS },
        (err, result) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                const filteredResult = result.map(x => {
                    return {
                        doseId: x.DoseId,
                        lotNo: x.LotNo,
                        vaccineName: x.VaccineName,
                        expiredDate: x.ExpiredDate,
                        medicalUnitHash: x.MedicalUnitHash,
                        hash: x.Hash
                    }
                });
                res.json({ success: true, message: filteredResult });
            }
        });
    });
}

module.exports = { register };