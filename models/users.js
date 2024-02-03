import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 32,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  blogs: [
    {
      type: ObjectId,
      ref: "blogs",
    },
  ],
});

const generateJWTtoken = function (id) {
  return jwt.sign({ id }, process.env.SECRETKEY);
};

const Users = mongoose.model("users", userSchema);
export { Users, generateJWTtoken };
