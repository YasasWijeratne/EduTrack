import mongoose, { Schema } from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index(
  {
    student: 1,
    assignment: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Submission",
  submissionSchema
);