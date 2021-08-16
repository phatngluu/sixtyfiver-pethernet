require('dotenv').config();

const _ = require('lodash');
const jwt = require('jsonwebtoken')




UserSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();

    return _.omit(userObj, ['Password', 'Sessions'])
}

UserSchema.methods.generateAccessAuthToken = function() {
    const user = this;
    return new Promise((resolve, reject) => {

    });
}
