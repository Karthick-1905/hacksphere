const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/keys.js');
const Company = require('../models/company.model.js');

const authenticateCompany = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const company = await Company.findById(decoded.company_id).select('-password');

        if (!company) {
            return res.status(401).json({ message: 'Company not found' });
        }

        req.company = company;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticateCompany };