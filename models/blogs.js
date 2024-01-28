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
});

const Blogs = mongoose.model("blogs", blogSchema);
export { Blogs };
