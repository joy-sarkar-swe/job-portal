"use server";

import { cookies } from "next/headers";

interface AdminOverviewResponse {
  statusCode: number;
  success: boolean;
  message?: string;
  overview?: {
    pendingEmployersCount: number;
    totalJobsCount: number;
    blockedUsersCount: number;
    totalApplicationsCount: number;
  };
}

export async function getAdminOverview(): Promise<AdminOverviewResponse> {
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

    // Call backend API to get admin overview
    const response = await fetch(
      `${process.env.NEXT_BACKEND_URI}/admin/overview`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: data.statusCode || response.status,
        success: false,
        message: data.message || "Failed to fetch admin overview",
      };
    }

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Admin overview retrieved successfully",
      overview: data.overview,
    };
  } catch (error) {
    console.error("Get admin overview error:", error);
    return {
      statusCode: 500,
      success: false,
      message: "An error occurred while fetching admin overview",
    };
  }
}
