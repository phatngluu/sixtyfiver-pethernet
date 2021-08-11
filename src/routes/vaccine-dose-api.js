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
            from: process.env.VACCINE_DOSE_PROVIDER_ADDRESS,
            gas: 150000
        })
        .then(function(result){
            res.json({success: true, message: result})
        });;
    })

    app.post("/api/vaccinedose/add", async (req, res) => {
        // TODO: check existence
        

        const newVaccineDose = new model.VaccineDoseModel({
            DoseId: req.body.DoseId,
            LotNo: req.body.LotNo,
            VaccineName:req.body.VaccineName,
            ImportedDate: req.body.ImportedDate,
            ExpiredDate: new Date(),
            Hash: hash(`${req.body.DoseId}${req.body.LotNo}${req.body.VaccineName}${req.body.ExpiredDate}`),
        });

        newVaccineDose.save(err => {
            if(err) {
                res.json({success: false, message: err})
            } else {
                const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);
                pethernetContract.methods.addVaccineDose(newVaccineDose.Hash).send(
                    { 
                        from: process.env.MINISTRY_OF_HEALTH_ADDRESS,
                        gas: 150000,
                    })
                .on('receipt', function(x){
                    console.log(x);
                });

                res.json({success: true, message: newVaccineDose})
            }
        })
    });
}

module.exports = { register };