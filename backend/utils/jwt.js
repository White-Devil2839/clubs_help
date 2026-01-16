const jwt = require('jsonwebtoken');

const generateToken = (user, institution) => {
    return jwt.sign({
        userId: user._id,
        role: user.role,
        institutionCode: institution.code,
        tokenVersion: user.tokenVersion || 0 // Session Invalidation payload
    }, process.env.JWT_SECRET, {
        expiresIn: '15m', // Short-lived access token
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({
        userId: user._id,
        tokenVersion: user.tokenVersion || 0
    }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Long-lived refresh token
    });
};

module.exports = { generateToken, generateRefreshToken };
