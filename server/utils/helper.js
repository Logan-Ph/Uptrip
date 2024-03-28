require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
	{
	  id: user._id,
	  name: user.name,
	  email: user.email,
	  username: user.username,
	  verified: user.verified,
	},
	process.env.JWT_SECRET,
	{ expiresIn: "10s" }
	);
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
	{
	  id: user._id,
	  name: user.name,
	  email: user.email,
	  username: user.username,
	  verified: user.verified,
	},
	process.env.JWT_SECRET,
	{ expiresIn: "20m" }
  	);
};
