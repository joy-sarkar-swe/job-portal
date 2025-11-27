"use server";

import { cookies } from "next/headers";

export interface ApplyJobResponse {
  statusCode: number;
  success: boolean;
  message: string;
  application?: {
    id: string;
    jobId: string;
    appliedAt: string;
  };
}

export async function applyJobAction(jobId: string): Promise<ApplyJobResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { statusCode: 401, success: false, message: "Not authenticated" };
    }

    const res = await fetch(
      `${process.env.NEXT_BACKEND_URI}/applications/${jobId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: data.statusCode || res.status,
        success: false,
        message: data.message || "Failed to apply for job",
      };
    }

    return {
      statusCode: data.statusCode || 201,
      success: true,
      message: data.message || "Application submitted successfully",
      application: data.application,
    };
  } catch (err) {
    console.error("Apply job error:", err);
    return { statusCode: 500, success: false, message: "Server error" };
  }
}
