"use server";
import { cookies } from "next/headers";

export interface ApplicationItem {
  applicationId: string;
  appliedAt: string;
  approved?: boolean;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    jobType: string;
    salaryRange: string;
    description: string;
    employer: {
      _id: string;
      name: string;
      email: string;
    };
  };
}

export interface GetMyApplicationsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data?: ApplicationItem[];
}

export async function getMyApplicationsAction(query: {
  page?: number;
  limit?: number;
}): Promise<GetMyApplicationsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { statusCode: 401, success: false, message: "Not authenticated" };
    }

    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));

    const res = await fetch(
      `${process.env.NEXT_BACKEND_URI}/applications/my?${params.toString()}`,
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
        message: data.message || "Failed to fetch applications",
      };
    }

    return {
      statusCode: 200,
      success: true,
      message: data.message || "Applications retrieved successfully",
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
      data: data.data,
    };
  } catch (err) {
    console.error("Get my applications error:", err);
    return { statusCode: 500, success: false, message: "Server error" };
  }
}
