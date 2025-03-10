import jwt from "jsonwebtoken"

const generateToken = (res, userId) =>{
	const token = jwt.sign({userId},process.env.JWT_SECRET,
		{expiresIn: "30d"}
	)
	res.cookie("token", token, {
		httpOnly: true,
		smSite: 'strict',
		secure: process.env.NODE_ENV,
		maxAge: 30 * 24 * 60 * 60 * 1000
	})
	return token
}
export default generateToken
