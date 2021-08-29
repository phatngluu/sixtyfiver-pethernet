require('dotenv').config();
const jwt = require('jsonwebtoken');
const Role = require('../_helpers/role');

const users = [
    { id: 1, username: 'admin', password: 'memphis13322', firstName: 'Admin', role: Role.Admin },
    { id: 2, username: 'ministry', password: 'memphis13322', firstName: 'Ministry of Health', role: Role.MinistryOfHealth },
    { id: 3, username: 'med1', password: 'memphis13322', firstName: 'Medical Unit 1', role: Role.MedicalUnit },
    { id: 4, username: 'med2', password: 'memphis13322', firstName: 'Medical Unit 2', role: Role.MedicalUnit },
    { id: 5, username: 'med3', password: 'memphis13322', firstName: 'Medical Unit 3', role: Role.MedicalUnit },
    { id: 6, username: 'user1', password: 'memphis13322', firstName: 'user1', role: Role.Injector },
    { id: 7, username: 'user2', password: 'memphis13322', firstName: 'user2', role: Role.Injector },
    { id: 8, username: 'user3', password: 'memphis13322', firstName: 'user3', role: Role.Injector }
];

module.exports = {
    authenticate,
    getAll,
    getById
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, firstName: user.firstName ,role: user.role }, process.env.SESSION_SECRET);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getById(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}