require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const { web3, PethernetContractMeta } = require("../web3/web3")

const register = (app) => {
    app.post("/api/doctor/add", async (req, res) => {
        // TODO: check existence

        const newDoctor = new model.DoctorModel({
            FullName: req.body.fullName,
            CitizenId: req.body.citizenId,
            Hash: hash(`${req.body.citizenId}`),
        })

        newDoctor.save(err => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);
                pethernetContract.methods.addDoctor(newDoctor.Hash).send(
                    {
                        from: process.env.PETHERNET_SYSTEM_ADDRESS,
                        gas: 150000,
                    })
                    .on('receipt', function (x) {
                        console.log(x);
                    });

                res.json({ success: true, message: newDoctor })
            }
        })
    });

    app.get("/api/doctor/check", async (req, res) => {
        const doctorHash = req.query.hash;

        const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);
        pethernetContract.methods.checkDoctor(doctorHash).call()
        .then((result) => {
            res.json({ success: true, message: result });
        });
    });
}

module.exports = { register };