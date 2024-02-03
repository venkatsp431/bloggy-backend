import jwt from "jsonwebtoken";
// import { User } from "../Models/user.js";
import { Users } from "../models/users.js";

const isAuthenticated = async (req, res, next) => {
  let token;
  if (req.headers) {
    try {
      token = await req.headers["x-auth-token"];
      const decode = jwt.verify(token, process.env.SECRETKEY);
      console.log(decode);
      req.user = await Users.findById(decode.id).select("_id name email");
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  if (!req.headers) {
    console.log("no token found");
  }
};

const isAdmin = (req, res, next) => {
  // Check if the user is an admin
  if (req.user && req.user.role === "admin") {
    return next(); // Allow the request to proceed
  }
  // If not an admin, return an error
  return res
    .status(403)
    .json({ message: "Permission denied. Admin access required." });
};
export { isAuthenticated, isAdmin };
