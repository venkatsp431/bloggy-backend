import express from "express";
import { Users, generateJWTtoken } from "../models/users.js";
import bcrypt from "bcrypt";
import { isAuthenticated } from "../Auth/auth.js";

const router = express.Router();

// const createAdminUser = async () => {
//   try {
//     // Check if an admin user already exists
//     const adminExists = await Users.findOne({ role: "admin" });

//     if (!adminExists) {
//       // If no admin user exists, create one
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash("adminpassword", salt); // Set a secure password

//       const adminUser = await new Users({
//         name: "Admin Name",
//         email: "admin@example.com",
//         contact: "1234567890",
//         password: hashedPassword,
//         role: "admin", // Set the role to "admin"
//       }).save();

//       console.log("Admin user created:", adminUser);
//     } else {
//       console.log("Admin user already exists.");
//     }
//   } catch (error) {
//     console.error("Error creating admin user:", error);
//   }
// };

// Call the function to create an admin user
// createAdminUser();

router.get("/all", async (req, res) => {
  try {
    const users = await Users.find({});
    if (!users) return res.status(400).json({ message: "No users found" });
    res.status(200).json({ message: "Users found", data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/signup", async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ data: "User Already Exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user = await new Users({
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    }).save();
    const token = generateJWTtoken(user._id);
    res.status(200).json({ message: "User successfull", token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ data: "User unavailable" });
    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password) return res.status(400).json({ data: "Passwords Wrong" });
    const token = generateJWTtoken(user._id);
    res.status(200).json({ message: "Login Successfull", token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const userid = req.user._id;
    const user = await Users.findById(userid);
    if (!user) {
      return res.status(400).json("User not found");
    }
    const { name, email, contact, role, notifications } = user;

    const userProfile = {
      name,
      email,
      contact,
      role,
      notifications,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});
router.post("/addcategory", isAuthenticated, async (req, res) => {
  try {
    // Check if the user has the admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Permission denied. Only admins can add categories.",
      });
    }

    // Add category creation logic here
    const categoryTitle = req.body.categoryTitle;

    res.status(200).json({ message: "Category added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

export const userRouter = router;
