import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
  name: String,
  url: String,
  publicId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Model", modelSchema);
