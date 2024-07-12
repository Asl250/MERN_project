import User from "../models/userModel.js"
import asyncHandler from "../middlewares/asyncHandler.js";
// bcryptjs import qilamiz
import bcrypt from "bcryptjs"

import generateToken from '../utils/createToken.js'

const createUser = asyncHandler(async (req, res) => {
	const {username, email, password} = req.body
	// user agar hamma inputlarga malumotlarni kiritmaganda ishlaydigan logic
	if (!username || !email || !password) {
		res.status(400)
		throw new Error("Iltimos har bitta ma'lumot to'liq kiriting")
	}
	//user agar avval mavjud bolgan username yoki email orqali royxatdan otgan bolsa ishlaydigan logic
	const userExist = await User.findOne({email})
	if (userExist) res.status(400).send("Bu email mavjud")
	
	//user parolni shifrlash
	const salt = await bcrypt.genSalt(12)
	const hashedPassword = await bcrypt.hash(password, salt)
	
	//user yaratish
	const newUser = new User({username, email, password: hashedPassword})
	
	try {
		await newUser.save()
		generateToken(res, newUser._id)
		res.status(201).json({
			_id: newUser._id,
			username: newUser.username,
			email: newUser.email,
			isAdmin: newUser.isAdmin
		})
	} catch (error) {
		res.status(400).send(error.message)
		throw new Error('Invalid user data')
	}
})

const getUser = asyncHandler(async (req, res) => {
	const {email} = req.body
	
	const user = await User.findOne({email})
	if (user) {
		res.json({
			_id: user._id,
			username: user.username,
			email: user.email,
			isAdmin: user.isAdmin
		})
	} else {
		res.status(404)
		throw new Error("User not found")
	}
})

const loginUser = asyncHandler(async (req,res)=>{
	const {email, password} = req.body
	
	// mavjud user email tekshiradigan kod
	const existingUser = await User.findOne({email})
	
	if (existingUser) {
		const isPasswordValid = await bcrypt.compare(password, existingUser.password)
		if (isPasswordValid) {
			generateToken(res, existingUser._id)
			res.status(201).json({
				_id: existingUser._id,
				username: existingUser.username,
				email: existingUser.email,
				isAdmin: existingUser.isAdmin
			})
		}
	}
})

const logoutUser = asyncHandler(async (req,res)=>{
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	})
	res.status(200).send("User Logged out")
})


const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find({})
	res.json(users)
})

export {createUser, getUser, loginUser, logoutUser, getAllUsers}
