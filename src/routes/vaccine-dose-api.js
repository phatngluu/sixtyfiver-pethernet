require("dotenv").config();
const model = require("../models/models");

const register = (app) => {

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
        const vaccineDoseHashes = req.body.vaccineDoseHashes;
        const medicalUnitHash = req.body.medicalUnitHash;

        model.VaccineDoseModel.updateMany({
            Hash: vaccineDoseHashes
        }, {
            MedicalUnitHash: medicalUnitHash
        }, (err, _) => {
            if (err) {
                res.json({ success: false, message: vaccineDoseHashes })
            } else {
                res.json({ success: true, message: vaccineDoseHashes })
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