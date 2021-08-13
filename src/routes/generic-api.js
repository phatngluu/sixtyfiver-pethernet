require("dotenv").config();
const hash = require("object-hash");
const model = require("../models/models");
const { PethernetContractMeta } = require("../web3/web3");

const register = (app) => {
    // const oidc = app.locals.oidc;

    app.get("/api/contractABI", async (req, res) => {
        res.json({ success: true, message: PethernetContractMeta.abi })
    })

    app.get("/api/contractAddress", async (req, res) => {
        res.json({ success: true, message: process.env.PETHERNET_CONTRACT_ADDRESS })
    })

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