const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const authenticateUser = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const isTestUser = payload.userId == '66611fec2ca1a9e63aeaf76b';
        // Attach user to the job routes
        req.user = {userId: payload.userId, name:payload.name, isTestUser};
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
}

module.exports = authenticateUser;