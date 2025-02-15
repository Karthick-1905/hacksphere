const express = require('express');
const router = express.Router();
const { authenticateCompany } = require('../middlewares/auth.middleware.js');
const {
    registerCompany,
    loginCompany,
    logoutCompany,
    getCompanyProfile
} = require('../controllers/company.controller.js');

// Public routes
router.post('/register', registerCompany);
router.post('/login', loginCompany);
router.post('/logout', logoutCompany);

// Protected routes
router.get('/profile', authenticateCompany, getCompanyProfile);

module.exports = router;