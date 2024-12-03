import express from 'express';
import { login, logout, signup } from '../controllers/userController.js';
import { authorizeRoles, verifyJWT } from '../middlewares/authMiddleware.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').post(verifyJWT, logout)

// User information route
router.get("/me", verifyJWT, asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not authenticated");
    }
    const { username, email, role } = req.user;
    res.status(200).json({ username, email, role });
}));

// RBAC-protected routes
const createProtectedRoute = (path, role) => {
    router.get(path, verifyJWT, authorizeRoles(role), (req, res) => {
        res.status(200).json({ message: `${role} Dashboard Access Granted` });
    });
};

createProtectedRoute("/admin-dashboard", "Admin");
createProtectedRoute("/moderator-dashboard", "Moderator");
createProtectedRoute("/user-dashboard", "User");

export default router;
