import { User } from '../models/user.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import validator from 'validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const generateAccessAndRefereshTokens = async(userId) =>{
        try {
        const user = await User.findById(userId);

        // Clean up expired tokens before adding a new one
        user.refreshToken = user.refreshToken.filter(token => token.expiresAt > Date.now());

        // Limit the number of tokens stored (e.g., keep only the last 5 tokens)
        if (user.refreshToken.length >= 5) {
            user.refreshToken.shift(); // Remove the oldest token
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken.push({
            token: refreshToken,
            expiresAt: new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY, 10)),
        });

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }

};

// transporter for nodemailer 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.EMAIL,
        pass: process.env.APP_PSWD,
    }
})

//Signup user
export const signup = asyncHandler( async (req, res, next)=>{
    const {username, email, password, role} = req.body;
    // console.log(req.body)



    const isPasswordStrong = validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    });

    if (!isPasswordStrong) {
        throw new ApiError(400, "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols.");
    };

    const allowedRoles = ['Admin', 'User', 'Moderator'];
    if (role && !allowedRoles.includes(role)) {
        throw new ApiError(400, 'Invalid role specified');
    };

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email format");
    };

    try{
        console.log("enter SignUp controller")
        const existUser = await User.findOne({ email });
        if(existUser) {
            throw new ApiError(409,"User with email or username already exists")
        } 

        const user = new User({ username, email, password, role });
        
        if (await user.isPasswordReused(password)) {
            throw new ApiError(400, "Cannot reuse recent passwords.");
        }

        await user.save();
        // console.log(`\n\n User: \n${user}\n\n`);

       const verificationToken = user.generateEmailVerificationToken();
        const verificationUrl = `${/*process.env.FRONTEND_URL*/6}/verify-email?token=${verificationToken}`;

        const mailOption = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Verify Your Email',
            text: `Click on the following link to verify your email: ${verificationUrl}`,
        };

        // Send verification email
        try {
            await transporter.sendMail(mailOption);
        } catch (mailError) {
            console.error("Failed to send verification email:", mailError);
            throw new ApiError(500, "Failed to send verification email.");
        }
        const sendUser = await User.findById(user._id).select('-password -refreshToken -role -passwordHistory').lean();
        return res.status(201).json(new ApiResponse(201, sendUser, "User created successfully. Please verify your email."));
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// User Login
export const login = asyncHandler(async (req, res, next) => {
    console.log("Enter login Controller:",req.body);
    const { email, password } = req.body;

    if (!password || !email) {
        throw new ApiError(400, "Email and password are required");
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ApiError(400, "Invalid email or password");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:"Strict",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 })
            .cookie("refreshToken", refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json(new ApiResponse(200, { accessToken }, "User logged in successfully"));
    } catch (error) {
        next(error);
    }
});
// Logout user and revoke refresh tokens
export const logout = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    try {
        const user = await User.findOne({ "refreshToken.token": refreshToken });

        if (!user) {
            res.clearCookie("refreshToken", { httpOnly: true, secure: true });
            throw new ApiError(204, "User not found");
        }

        // Remove the specific token
        user.refreshToken = user.refreshToken.filter(token => token.token !== refreshToken);
        await user.save();

        res.clearCookie("accessToken",{ httpOnly: true, secure: true });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });

        return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
    } catch (error) {
        next(error);
    }
});