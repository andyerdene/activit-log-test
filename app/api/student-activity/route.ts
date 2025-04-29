/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDatabase } from "@/lib/db";
import { createActivityLog, getActivityLogs } from "@/lib/server/services";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("POST request received");
  await connectDatabase();
  try {
    const data = await request.json();
    console.log("Received data:", data);
    // const today = '2025-04-26'
    const logDate = format(new Date(), "yyyy-MM-dd");
    const { studentId, logs } = data;
    const logData = logs[0].map((log: any) => ({
      app: log.data.app,
      duration: log.duration,
    }));
    console.log("logs", logData);
    await createActivityLog(studentId, logData, logDate);

    return NextResponse.json({ message: "Data received successfully" });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDatabase();
  try {
    const logs = await getActivityLogs();
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
