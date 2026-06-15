import mongoose, { Schema } from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    code: { type: String, required: true, unique: true, trim: true },

    description: { type: String, default: "" },

    lecturer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);