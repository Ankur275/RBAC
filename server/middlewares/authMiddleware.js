import { User } from "../models/user.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT and authenticate user.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log("Token received:", token); // Log the received token

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error); // Log the error for debugging

        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access Token expired. Please login again.");
        } else if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid Access Token");
        } else {
            throw new ApiError(401, error?.message || "Authentication failed");
        }
    }
});

/**
 * Middleware to enforce role-based access control (RBAC).
 * @param  {...string} roles - Allowed roles.
 */
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Access denied");
        }
        next();
    };
};

/**
 * Middleware for optional authentication.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedToken._id).select("-password -refreshToken");
            req.user = user; // Attach user to the request if authenticated
        }
        next(); // Proceed regardless of authentication status
    } catch (error) {
        req.user = null; // Ensure no user data is attached if token verification fails
        next();
    }
});
