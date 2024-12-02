import express from 'express';
import { login, signup } from '../controllers/userController.js';
import { authorizeRoles, verifyJWT } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.route('/signup').post(signup);
// router.post("/signup", signup);
router.post("/login").post(login);

router.get("/admin-dashboard").post(verifyJWT, authorizeRoles("admin"));

router.get("/manager-dashboard", verifyJWT, authorizeRoles("manager"));
router.get("/user-dashboard", verifyJWT, authorizeRoles("user"));

export default router;