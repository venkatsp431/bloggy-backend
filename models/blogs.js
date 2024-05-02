import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const getDateOnly = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  category: {
    type: String,
  },
  body: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: getDateOnly,
  },
  user: {
    type: ObjectId,
    ref: "users", // Reference to the User model
  },
  comments: [
    {
      user: {
        type: ObjectId,
        ref: "users",
      },
      postId: {
        type: String,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Blogs = mongoose.model("blogs", blogSchema);
export { Blogs };
