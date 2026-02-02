import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  language: String,
  code: String,
  formattedCode: String,
});

const codeSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    files: [fileSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Code", codeSchema);
