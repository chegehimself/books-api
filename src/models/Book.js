import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  pages: { type: Number, required: true },
  goodreadsId: { type: String, required: true }
});

export default mongoose.model("Book", schema);
