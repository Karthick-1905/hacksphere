const Company = require('../models/company.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

const registerCompany = asyncHandler(async (req, res) => {
    const company = await Company.create(req.body);
    const token = company.createJWT();
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json(
        new ApiResponse(201, company, "Company registered successfully")
    );
});

const loginCompany = asyncHandler(async (req, res) => {
    const { company_email, password } = req.body;
    const company = await Company.findOne({ company_email });

    if (!company) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await company.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = company.createJWT();
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json(
        new ApiResponse(200, company, "Logged in successfully")
    );
});

const logoutCompany = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    return res.json(
        new ApiResponse(200, {}, "Logged out successfully")
    );
});

const getCompanyProfile = asyncHandler(async (req, res) => {
    return res.json(
        new ApiResponse(200, req.company, "Profile retrieved successfully")
    );
});

module.exports = {
    registerCompany,
    loginCompany,
    logoutCompany,
    getCompanyProfile
};