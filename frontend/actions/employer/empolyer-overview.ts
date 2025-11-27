"use server";

import { cookies } from "next/headers";

export interface EmployerOverview {
  totalJobsPosted: number;
  totalApplicants: number;
  notApprovedApplications: number;
}

export interface GetEmployerOverviewResponse {
  statusCode: number;
  success: boolean;
  message?: string;
  overview?: EmployerOverview;
}

export async function getEmployerOverview(): Promise<GetEmployerOverviewResponse> {
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

    const response = await fetch(
      `${process.env.NEXT_BACKEND_URI}/employer/overview`,
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
        message: data.message || "Failed to fetch employer overview",
      };
    }

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Employer overview fetched successfully",
      overview: data.overview,
    };
  } catch (err: any) {
    console.error("Error fetching employer overview:", err);
    return {
      statusCode: 500,
      success: false,
      message:
        err.message || "An error occurred while fetching employer overview",
    };
  }
}
