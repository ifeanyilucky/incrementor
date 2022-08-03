const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { UnauthenticatedError, NotFoundError } = require("../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(payload.userId).select("-password");
    // if (!user) {
    //   throw new NotFoundError("User not found with this id");
    // }
    req.user = user;
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

module.exports = auth;
