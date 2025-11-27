"use server";

import { cookies } from "next/headers";

interface Employer {
  _id: string;
  name: string;
  email: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: "full-time" | "part-time" | "remote";
  salaryRange: string;
  description: string;
  employer: Employer;
}

export interface GetJobsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  jobs?: Job[];
  nextCursor?: string | null;
  hasMore?: boolean;
}

export async function getJobsAction(
  location?: string | undefined,
  jobType?: "full-time" | "part-time" | "remote" | undefined,
  cursor?: string | undefined,
  limit?: string | undefined,
  search?: string | undefined
): Promise<GetJobsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { statusCode: 401, success: false, message: "Not authenticated" };
    }

    // Build URL with query params
    const params = new URLSearchParams({
      limit: limit || "10",
    });

    if (location) params.append("location", location);
    if (jobType) params.append("jobType", jobType);
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URI}/jobs?${params.toString()}`,
      {
        method: "GET",
        headers: {
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
        message: data.message || "Failed to fetch jobs",
      };
    }

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Jobs fetched successfully",
      jobs: data.jobs,
      nextCursor: data.nextCursor ?? null,
      hasMore: data.hasMore ?? false,
    };
  } catch (err) {
    console.error("Get jobs error:", err);
    return { statusCode: 500, success: false, message: "Server error" };
  }
}
