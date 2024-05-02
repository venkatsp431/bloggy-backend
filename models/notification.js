import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "users",
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notifis = mongoose.model("notifications", notificationSchema);
export { Notifis };
