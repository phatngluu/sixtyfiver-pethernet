require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const { web3, PethernetContractMeta } = require("../web3/web3")

const register = (app) => {

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
                // const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);

                // try {
                //     pethernetContract.methods.addMedicalUnit(newMedicalUnit.Hash, medicalUnitOriginAddr).send(
                //         {
                //             from: process.env.PETHERNET_SYSTEM_ADDRESS,
                //             gas: 150000,
                //         })
                //         .on('receipt', function (x) {
                //             console.log(x);
                //         });
                // } catch (err) {
                //     console.log(err);
                // }
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
                    const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);

                    try {
                        pethernetContract.methods.addMedicalUnit(updatedMedicalUnit.Hash, updatedMedicalUnit.AccountAddress).send(
                            {
                                from: process.env.PETHERNET_SYSTEM_ADDRESS,
                                gas: 150000,
                            })
                            .on('receipt', function (x) {
                                console.log(x);
                            });
                    } catch (err) {
                        res.json({ success: false, message: err });
                        console.log(err);
                        return;
                    };

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