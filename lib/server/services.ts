import { ActivityLog } from "../server/model";

const checkLogExists = async (studentId: string, date: string) => {
  const log = await ActivityLog.findOne({ studentId, date });
  console.log(
    "Checking if log exists for student:",
    studentId,
    "on date:",
    date
  );
  console.log("Log found:", log);
  if (log) {
    console.log("Log already exists for this student and date");
    return true;
  }
  return false;
};
export async function createActivityLog(
  studentId: string,
  logs: { app: string; duration: number }[],
  date: string
) {
  console.log("Creating activity log for student:", studentId);
  console.log("Logs:", logs);
  console.log("Date:", date);
  try {
    const logExists = await checkLogExists(studentId, date);
    console.log("Log exists:", logExists);
    if (logExists) {
      //update the existing log
      console.log("Log already exists, updating...");
      const existingLog = await ActivityLog.findOneAndUpdate(
        { studentId, date },
        { $set: { logs: logs } },
        { new: true }
      );
      console.log("Log updated successfully:", existingLog);
      return existingLog;
    }

    console.log("Log does not exist, creating new log...");
    // Create a new activity log entry
    const activityLog = new ActivityLog({
      studentId,
      logs,
      date: date,
    });
    await activityLog.save();
    console.log("Activity log created successfully:", activityLog);
    return activityLog;
  } catch (error) {
    console.error("Error creating activity log:", error);
    throw new Error("Failed to create activity log");
  }
}
export async function getActivityLogs() {
  try {
    const activityLog = await ActivityLog.find();
    if (!activityLog) {
      throw new Error("Activity log not found");
    }
    return activityLog;
  } catch (error) {
    console.error("Error fetching activity log:", error);
    throw new Error("Failed to fetch activity log");
  }
}
