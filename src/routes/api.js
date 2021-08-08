require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const { web3, 
    PethernetContractMeta, 
    PethernetContractAddress,
    VaccineDoseAccountAddress
} = require("../web3")

const register = (app) => {
    // const oidc = app.locals.oidc;

    app.get("/api/testcontract", async (req, res) => {
        
    })

    app.get("/api/vaccinedose/all", async (req, res) => {
        const pethernetContract = new web3.eth.Contract(PethernetContractMeta.abi, process.env.PETHERNET_CONTRACT_ADDRESS);
        pethernetContract.methods.getVaccineDoses().call({
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
                        from: process.env.VACCINE_DOSE_PROVIDER_ADDRESS,
                        gas: 150000,
                    })
                .on('receipt', function(x){
                    console.log(x);
                });

                res.json({success: true, message: newVaccineDose})
            }
        })
    });

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

    app.post("api/doctor/add", async (req, res) => {
        // TODO: check existence

        const newDoctor = new model.DoctorModel({
            FullName: req.body.FullName,
            CitizenId: req.body.CitizenId,
            Hash: hash(`${req.body.MedCode}${req.body.CitizenId}`),
        })

        newDoctor.save(err => {
            if(err) {
                res.json({success: false, message: err})
            } else {
                res.json({success: true, message: newDoctor})
            }
        })
    });

    app.post("/api/injector/register", async (req, res) => {
        // TODO: check existence
        
        const newInjector = new model.InjectorModel({
            FullName: req.body.FullName,
            Birthday: req.body.Birthday,
            CitizenId: req.body.CitizenId,
            Address: req.body.Address,
            PhoneNumber: req.body.PhoneNumber,
            Hash: hash(`${req.body.CitizenId}`),
        })

        newInjector.save(err => {
            if(err) {
                res.json({success: false, message: err});
            } else {
                res.json({success: true, message: newInjector});
            }
        })
    });

    // app.delete( `/api/guitars/remove/:id`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
    //     try {
    //         const userId = req.userContext.userinfo.sub;
    //         const id = await db.result( `
    //             DELETE
    //             FROM    guitars
    //             WHERE   user_id = $[userId]
    //             AND     id = $[id]`,
    //             { userId, id: req.params.id  }, ( r ) => r.rowCount );
    //         return res.json( { id } );
    //     } catch ( err ) {
    //         // tslint:disable-next-line:no-console
    //         console.error(err);
    //         res.json( { error: err.message || err } );
    //     }
    // } );
};

module.exports = { register };