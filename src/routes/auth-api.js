const express = require('express');
const router = express.Router();
const userService = require('../auth/user.service');
const authorize = require('../middleware/auth')
const Role = require('../_helpers/role');

const register = (app) => {
    // routes
    app.post('/authenticate', authenticate);     // public route
    app.get('/', authorize(Role.Admin), getAll); // admin only
    app.get('/:id', authorize(), getById);       // all authenticated usersÎ
}

module.exports = { register };

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}