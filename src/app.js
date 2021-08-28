require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require( "mongoose");
const routes = require("./routes/index");
const errorHandler = require("./_helpers/error-handler");
// import * as sessionAuth = require( "./middleware/sessionAuth";

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();

// Configure Express to parse incoming JSON data
app.use(express.json());

// Configure routes
routes.register(app);

// Global error handler
app.use(errorHandler);

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