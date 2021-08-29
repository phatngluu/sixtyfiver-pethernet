require("dotenv").config();
const hash = require("object-hash");
const authorize = require("../middleware/auth");
const model = require("../models/models");
const Role = require('../_helpers/role');
const { web3, PethernetContractMeta } = require("../web3/web3")

const register = (app) => {

    app.get("/api/medicalunit/getAuthorizedMedicalUnit", authorize(Role.MedicalUnit), async (req, res) => {
        model.MedicalUnitModel.findOne({ UserId: req.user.sub }, null, null, (err, doc) => {
            if (err) {
                res.status(500).json({ success: false, message: err });
            } else {
                const filteredResult = doc === null ? null : {
                    medCode: doc.MedCode,
                    medName: doc.MedName,
                    accountAddress: doc.AccountAddress,
                    physicalAddress: doc.PhysicalAddress,
                    registeredOn: doc.RegisteredOn,
                    verifiedOn: doc.VerifiedOn,
                    hash: doc.Hash
                }
                res.status(200).json({ success: true, message: filteredResult });
            }
        })
    })

    app.get("/api/medicalunit/get/:medicalUnitHash", async (req, res) => {
        const medicalUnitHash = req.params.medicalUnitHash;
        model.MedicalUnitModel.findOne({ Hash: medicalUnitHash }, null, null, (err, doc) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                const filteredResult = doc === null ? null : {
                    medCode: doc.MedCode,
                    medName: doc.MedName,
                    accountAddress: doc.AccountAddress,
                    physicalAddress: doc.PhysicalAddress,
                    registeredOn: doc.RegisteredOn,
                    verifiedOn: doc.VerifiedOn,
                    hash: doc.Hash
                }
                res.json({ success: true, message: filteredResult });
            }
        })
    })

    // only ministry of health can create medical unit
    app.post("/api/medicalunit/add", async (req, res) => {
        const newMedicalUnit = new model.MedicalUnitModel({
            UserId: req.body.userId,
            MedCode: req.body.medCode,
            MedName: req.body.medName,
            AccountAddress: req.body.accountAddress,
            PhysicalAddress: req.body.physicalAddress,
            RegisteredOn: new Date(),
            VerifiedOn: null,
            Hash: hash(`${req.body.medCode}`),
        });

        newMedicalUnit.save(err => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                const filteredResult = {
                    medCode: newMedicalUnit.MedCode,
                    address: newMedicalUnit.Address,
                    contact: newMedicalUnit.Contact,
                    registeredOn: newMedicalUnit.RegisteredOn,
                    hash: newMedicalUnit.Hash
                };

                res.json({ success: true, message: filteredResult });
            }
        })
    });

    app.get("/api/medicalunit/getVerified", async (req, res) => {
        model.MedicalUnitModel.find(
            { VerificationStatus: 'Verified' },
            (err, result) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    const filteredResult = result.map(x => {
                        return {
                            medCode: x.MedCode,
                            medName: x.MedName,
                            accountAddress: x.AccountAddress,
                            physicalAddress: x.PhysicalAddress,
                            registeredOn: x.RegisteredOn,
                            verifiedOn: x.VerifiedOn,
                            hash: x.Hash
                        }
                    });
                    res.json({ success: true, message: filteredResult });
                }
            });
    });

    app.get("/api/medicalunit/getUnverified", async (req, res) => {
        model.MedicalUnitModel.find(
            { VerificationStatus: 'Unverified' },
            (err, result) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    const filteredResult = result.map(x => {
                        return {
                            medCode: x.MedCode,
                            medName: x.MedName,
                            accountAddress: x.AccountAddress,
                            physicalAddress: x.PhysicalAddress,
                            registeredOn: x.RegisteredOn,
                            hash: x.Hash
                        }
                    });
                    res.json({ success: true, message: filteredResult });
                }
            });
    });

    app.post("/api/medicalunit/verify", async (req, res) => {
        const medicalUnitHash = req.body.medicalUnitHash;

        model.MedicalUnitModel.findOneAndUpdate(
            { Hash: medicalUnitHash },
            { VerifiedOn: new Date(), VerificationStatus: 'Verified' },
            (err, updatedMedicalUnit) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    const filteredResult = {
                        medCode: updatedMedicalUnit.MedCode,
                        medName: updatedMedicalUnit.MedName,
                        accountAddress: updatedMedicalUnit.AccountAddress,
                        physicalAddress: updatedMedicalUnit.PhysicalAddress,
                        registeredOn: updatedMedicalUnit.RegisteredOn,
                        hash: updatedMedicalUnit.Hash
                    };

                    res.json({ success: true, message: filteredResult });
                }
            });
    });

    app.post("/api/medicalunit/reject", async (req, res) => {
        const medicalUnitHash = req.body.medicalUnitHash;

        model.MedicalUnitModel.findOneAndUpdate(
            { Hash: medicalUnitHash },
            { VerifiedOn: new Date(), VerificationStatus: 'Rejected' },
            (err, updatedMedicalUnit) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    const filteredResult = {
                        medCode: updatedMedicalUnit.MedCode,
                        medName: updatedMedicalUnit.MedName,
                        accountAddress: updatedMedicalUnit.AccountAddress,
                        physicalAddress: updatedMedicalUnit.PhysicalAddress,
                        registeredOn: updatedMedicalUnit.RegisteredOn,
                        hash: updatedMedicalUnit.Hash
                    };

                    res.json({ success: true, message: filteredResult });
                }
            });
    });

    app.post("/api/medicalunit/issueCertificate", async (req, res) => {
        // TODO: check existence

        const certificate = new model.CertificateModel({
            MedicalUnitHash: req.body.medicalUnitHash,
            InjectorHash: req.body.injectorHash,
            VaccineDoseHash: req.body.vaccineDoseHash,
            Hash: hash(`${req.body.medicalUnitHash}${req.body.injectorHash}${req.body.vaccineDoseHash}`),
        })

        certificate.save(err => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, message: certificate })
            }
        })
    });

    app.get('/api/medicalunit/getAvailableVaccineDoses/:medicalUnitHash', async (req, res) => {
        const medicalUnitHash = req.params.medicalUnitHash;
        model.VaccineDoseModel.aggregate([
            {
                "$lookup": {
                    "from": "certificates",
                    "localField": "Hash",
                    "foreignField": "VaccineDoseHash",
                    "as": "linkedCertificates"
                }
            },
            {
                "$match": {
                    "linkedCertificates": {
                        "$size": 0
                    },
                    "MedicalUnitHash": {
                        "$eq": `${medicalUnitHash}`
                    }
                }
            }
        ]).then((result) => {
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
        }, err => {
            res.json({ success: false, message: err });
        });
    });
}

module.exports = { register };