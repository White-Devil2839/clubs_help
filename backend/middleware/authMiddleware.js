const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fix: Payload now uses 'userId'
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Session Invalidation Check:
            // If the token's version is different from the user's current version, it's revoked.
            if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== (req.user.tokenVersion || 0)) {
                return res.status(401).json({ message: 'Session expired, please login again' });
            }

            // Tenant Guard: Verify user belongs to the current institution context
            // checking req.institutionId (set by institutionMiddleware) matches user's institution
            if (req.institutionId && req.user.institutionId.toString() !== req.institutionId.toString()) {
                return res.status(403).json({ message: 'Not authorized for this institution' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Generic Role-Based Access Control
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
