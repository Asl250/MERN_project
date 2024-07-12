import express from "express";
import { createUser, getUser, loginUser, logoutUser } from '../controllers/userController.js'
const router = express.Router();

router.route('/').post(createUser)
router.route('/').get(getUser)
router.post('/auth', loginUser)
router.post('/logout', logoutUser)

export default router
