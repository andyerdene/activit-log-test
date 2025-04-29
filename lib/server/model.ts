import { Schema, model, models } from "mongoose";

const LogEntrySchema = new Schema(
  {
    app: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const activityLog = new Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    date: String,
    logs: [LogEntrySchema],
  },
  { timestamps: true }
);

export const ActivityLog =
  models.activityLog || model("activityLog", activityLog);
