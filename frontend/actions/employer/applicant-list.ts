"use server";

import { cookies } from "next/headers";

export interface Applicant {
  applicationId: string;
  appliedAt: string;
  approved?: string;
  applicant: {
    name: string;
    email: string;
    skills: string[];
    resume?: string;
  };
}

export interface GetJobApplicantsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  applicants?: Applicant[];
}

export async function getJobApplicantsAction(
  jobId: string
): Promise<GetJobApplicantsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        statusCode: 401,
        success: false,
        message: "Not authenticated",
      };
    }

    const res = await fetch(
      `${process.env.NEXT_BACKEND_URI}/jobs/${jobId}/applicants`,
      {
        method: "GET",
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
        message: data.message || "Failed to fetch applicants",
      };
    }

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Applicants retrieved successfully",
      applicants: data.applicants || [],
    };
  } catch (err) {
    console.error("Get job applicants error:", err);
    return {
      statusCode: 500,
      success: false,
      message: "Server error",
    };
  }
}
