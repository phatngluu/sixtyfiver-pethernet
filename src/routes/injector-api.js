require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const { web3, PethernetContractMeta } = require("../web3/web3")

const register = (app) => {

    app.post("/api/injector/add", async (req, res) => {
        // TODO: check existence

        const newInjector = new model.InjectorModel({
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
                const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);
                pethernetContract.methods.addInjector(newInjector.Hash).send(
                    {
                        from: process.env.PETHERNET_SYSTEM_ADDRESS,
                        gas: 150000,
                    })
                    .on('receipt', function (x) {
                        console.log(x);
                    });

                res.json({ success: true, message: newInjector });
            }
        })
    });
}

module.exports = { register };