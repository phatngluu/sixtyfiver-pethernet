require('dotenv').config();
const jwt = require('jsonwebtoken');
const Role = require('../_helpers/role');

console.log(Role.MinistryOfHealth);

const users = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', role: Role.Admin },
    { id: 2, username: 'ministry', password: '12345', firstName: 'Ministry of Health', role: Role.MinistryOfHealth },
    { id: 2, username: 'med1', password: '12345', firstName: 'med1', role: Role.MedicalUnit },
    { id: 2, username: 'med2', password: '12345', firstName: 'med2', role: Role.MedicalUnit },
    { id: 2, username: 'med3', password: '12345', firstName: 'med3', role: Role.MedicalUnit },
    { id: 2, username: 'user1', password: '12345', firstName: 'user1', role: Role.Injector },
    { id: 2, username: 'user2', password: '12345', firstName: 'user2', role: Role.Injector },
    { id: 2, username: 'user3', password: '12345', firstName: 'user3', role: Role.Injector },
    { id: 2, username: 'doc1', password: '12345', firstName: 'Normal', role: Role.Doctor },
    { id: 2, username: 'doc2', password: '12345', firstName: 'Normal', role: Role.Doctor },
    { id: 2, username: 'doc3', password: '12345', firstName: 'Normal', role: Role.Doctor },
];

module.exports = {
    authenticate,
    getAll,
    getById
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.SESSION_SECRET);
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