import express from 'express';
import { login, signup } from '../controllers/userController.js';
import { authorizeRoles, verifyJWT } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.route('/signup').post(signup);
// router.post("/signup", signup);
router.route("/login").post(login);

router.route("/admin-dashboard").post(verifyJWT, authorizeRoles("Admin"));

router.route("/manager-dashboard", verifyJWT, authorizeRoles("Moderator"));
router.route("/user-dashboard", verifyJWT, authorizeRoles("User"));

export default router;