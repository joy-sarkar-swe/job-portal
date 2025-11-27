"use server";

import { cookies } from "next/headers";

interface GetJobsParams {
  location?: string;
  jobType?: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

export async function getAllJobsAction(params: GetJobsParams = {}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { statusCode: 401, success: false, message: "Not authenticated" };
    }

    const query = new URLSearchParams();

    if (params.location) query.append("location", params.location);
    if (params.jobType) query.append("jobType", params.jobType);
    if (params.cursor) query.append("cursor", params.cursor);
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);

    const res = await fetch(
      `${process.env.NEXT_BACKEND_URI}/admin/jobs?${query.toString()}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch jobs",
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
