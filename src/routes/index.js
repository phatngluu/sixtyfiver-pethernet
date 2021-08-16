const genericAPI = require("./generic-api");
const vaccineDoseAPI = require("./vaccine-dose-api");
const medicalUnitAPI = require("./medical-unit-api");
const doctorAPI = require("./doctor-api");
const injectorAPI = require("./injector-api");
const authAPI = require("./auth-api");

const register = (app) => {
    // const oidc = app.locals.oidc;

    // Set APIs
    authAPI.register(app);
    genericAPI.register(app);
    vaccineDoseAPI.register(app);
    medicalUnitAPI.register(app);
    doctorAPI.register(app);
    injectorAPI.register(app);

    // // define a route handler for the default home page
    // app.get( "/", (req, res) => {
    //     res.render( "index" );
    // } );

    // // define a secure route handler for the login page that redirects to /guitars
    // app.get( "/login", (req, res) => {
    //     res.redirect( "/guitars" );
    // } );

    // // define a route to handle logout
    // app.get( "/logout", (req, res) => {
    //     req.logout();
    //     res.redirect( "/" );
    // } );

    // // define a secure route handler for the guitars page
    // app.get( "/guitars", (req, res) => {
    //     res.render( "guitars" );
    // } );

};

module.exports = { register };