import express from "express";
import { Blogs } from "../models/blogs.js";
import { isAuthenticated } from "../Auth/auth.js";
import { Notifis } from "../models/notification.js";
import { Users } from "../models/users.js";

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

router.post("/postblog", isAuthenticated, async (req, res) => {
  try {
    const newBlog = await new Blogs({
      ...req.body,
      user: req?.user?._id,
    }).save();

    if (!newBlog) return res.status(400).json({ message: "Nothing received" });

    // Update the user document with the new blog
    await Users.findByIdAndUpdate(req?.user?._id, {
      $push: { blogs: newBlog._id },
    });

    res.status(200).json({ data: newBlog });
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
    const blog = await Blogs.deleteOne({ _id: req.params.id.toString() });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/comment/:id", isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;
    const blog = await Blogs.findById(postId);
    if (!blog) return res.status(404).json({ data: "Blog not found" });

    const newComment = {
      user: req.user._id,
      text: req.body.text,
      postId,
    };

    blog.comments.unshift(newComment);
    await blog.save();

    // Notify the user who posted the blog about the new comment
    const notificationMessage = "New comment on your blog post";
    const user = await Users.findById(blog.user);

    if (user) {
      user.notifications.push({ message: notificationMessage });
      await user.save();
    }

    res.status(200).json({ data: newComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notifis.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json({ data: notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

export const blogsRouter = router;
