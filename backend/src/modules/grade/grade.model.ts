import mongoose, { Schema } from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    submission: {
      type: Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
      required: true,
    },

    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Grade",
  gradeSchema
);