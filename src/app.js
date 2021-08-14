require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require( "mongoose");
const routes = require("./routes/index")
// import * as sessionAuth = require( "./middleware/sessionAuth";

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();

// Configure Express to parse incoming JSON data
app.use( express.json() );

// app.use('/', express.static('public'));
// Configure Express to use EJS
// app.set( "views", path.join( __dirname, "public" ) );
// app.set( "view engine", "pug" );

// Configure session auth
// sessionAuth.register( app );

// Configure routes
routes.register(app);

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );

mongoose.connect(process.env.DB_CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connected.");
    }
})