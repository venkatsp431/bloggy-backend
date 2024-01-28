import express from "express";
import { Blogs } from "../models/blogs.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const blogs = await Blogs.find();
    if (!blogs) {
      return res.status(400).json({ data: "No blogs found" });
    }
    res.status(200).json({ data: blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.post("/postblog", async (req, res) => {
  try {
    const blogs = await new Blogs({
      ...req.body,
      user: req?.user?._id,
    }).save();
    if (!blogs) return res.status(400).json({ message: "Nothing received" });

    res.status(200).json({ data: blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "internal server error" });
  }
});
router.get("/question/:id", async (req, res) => {
  try {
    const blogs = await Blogs.findOne({ _id: req.params.id });
    if (!blogs) res.status(400).json({ data: "No data Found" });
    res.status(200).json({ data: blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.put("/blog/:id", async (req, res) => {
  try {
    const blogs = await Blogs.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!blogs) res.status(400).json({ data: "No data found" });
    // blogs.views = views;
    return res.status(200).json({ data: blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const blog = await Blogs.deleteOne({ _id: req.params.id });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const blogsRouter = router;
