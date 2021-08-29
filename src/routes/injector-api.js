require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const authorize = require("../middleware/auth");
const Role = require('../_helpers/role');

const register = (app) => {


    app.get("/api/injector/getAuthorizedInjector", authorize(Role.Injector), async (req, res) => {
        model.InjectorModel.findOne({ UserId: req.user.sub }, null, null, (err, doc) => {
            if (err) {
                res.status(500).json({ success: false, message: err });
            } else {
                const filteredResult = doc === null ? null : {
                    fullName: doc.FullName,
                    birthday: doc.Birthday,
                    citizenId: doc.CitizenId,
                    address: doc.Address,
                    phoneNumber: doc.PhoneNumber,
                    hash: doc.Hash
                }
                res.status(200).json({ success: true, message: filteredResult });
            }
        })
    })

    app.get("/api/injector/getAuthorizedCert", authorize(Role.Injector), async (req, res) => {
        model.InjectorModel.findOne({ UserId: req.user.sub }, null, null, (err, doc) => {
            if (err) {
                res.status(500).json({ success: false, message: err });
            } else {
                const userHash = doc.Hash;

                model.CertificateModel.find({ InjectorHash: userHash }, (error, certs) => {
                    if (error) {
                        res.status(500).json({ success: false, message: error });
                    } else {
                        let filteredResults = [];

                        certs.forEach((cert) => {
                            const filteredResult = cert === null ? null : {
                                medicalUnitHash: cert.MedicalUnitHash,
                                injectorHash: cert.InjectorHash,
                                vaccineDoseHash: cert.VaccineDoseHash,
                                hash: cert.Hash
                            }

                            filteredResults.push(filteredResult);
                        })

                        res.status(200).json({ success: true, message: filteredResults });
                    }
                })
            }
        })
    })

    app.post("/api/injector/add", authorize(Role.Injector), async (req, res) => {
        const userId = req.user.sub;

        const newInjector = new model.InjectorModel({
            UserId: userId,
            FullName: req.body.fullName,
            Birthday: req.body.birthday,
            CitizenId: req.body.citizenId,
            Address: req.body.address,
            PhoneNumber: req.body.phoneNumber,
            Hash: hash(`${req.body.citizenId}`),
        })

        newInjector.save(err => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                const filteredResult = {
                    fullName: newInjector.FullName,
                    birthday: newInjector.Birthday,
                    citizenId: newInjector.CitizenId,
                    address: newInjector.Address,
                    phoneNumber: newInjector.PhoneNumber,
                    hash: newInjector.Hash
                }
                res.status(200).json({ success: true, message: filteredResult });
            }
        })
    });

    app.get("/api/injector/check", async (req, res) => {
        const injectorHash = req.query.hash;

        model.InjectorModel.findOne({ Hash: injectorHash }, null, null, (err, doc) => {
            if (err) {
                res.status(500).json({ success: false, message: err });
            } else {
                if (doc) {
                    res.status(200).json({ success: true, message: true });
                } else {
                    res.status(200).json({ success: true, message: false });
                }
            }
        })
    });
}

module.exports = { register };