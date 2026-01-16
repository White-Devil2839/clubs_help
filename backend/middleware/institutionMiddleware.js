const Institution = require('../models/Institution');

const institutionMiddleware = async (req, res, next) => {
    const { institutionCode } = req.params;

    if (!institutionCode) {
        return res.status(400).json({ message: 'Institution code is required' });
    }

    try {
        const institution = await Institution.findOne({ code: institutionCode });

        if (!institution) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        req.institutionId = institution._id;
        req.institution = institution;
        next();
    } catch (error) {
        console.error('Institution Middleware Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = institutionMiddleware;
