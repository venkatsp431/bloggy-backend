import express from "express";
import dotenv from "dotenv";
import { createConnection } from "./db.js";
import cors from "cors";
import { blogsRouter } from "./Routes/blogs.js";
import { userRouter } from "./Routes/users.js";
import { Users } from "./models/users.js";
import bcrypt from "bcrypt";
// import { userRouter } from "./Routers/users.js";
// import { notesRouter } from "./Routers/notes.js";
// import isAuthenticated from "./Auth/auth.js";

dotenv.config();
createConnection();
const PORT = process.env.PORT;
const app = express();

const createAdminUser = async () => {
  try {
    // Check if an admin user already exists
    const adminExists = await Users.findOne({ role: "admin" });

    if (!adminExists) {
      // If no admin user exists, create one
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("adminpassword", salt); // Set a secure password

      const adminUser = await new Users({
        name: "Admin Name",
        email: "admin@example.com",
        contact: "1234567890",
        password: hashedPassword,
        role: "admin", // Set the role to "admin"
      }).save();

      console.log("Admin user created:", adminUser);
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

app.use(express.json());
app.use(cors());
createAdminUser();
// app.use("/api/users", userRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Server running in localhost:${PORT}`));
