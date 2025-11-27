"use server";

import { cookies } from "next/headers";

interface ApprovalStatusResponse {
  success: boolean;
  approvalStatus?: boolean;
  message?: string;
}

export async function getAccountApprovalStatus(): Promise<ApprovalStatusResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Call backend API to get approval status
    const response = await fetch(
      `${process.env.NEXT_BACKEND_URI}/employer/status`,
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
        success: false,
        message: data.message || "Failed to fetch approval status",
      };
    }

    return {
      success: true,
      approvalStatus: data.approvalStatus,
      message: data.message,
    };
  } catch (error) {
    console.error("Get approval status error:", error);
    return {
      success: false,
      message: "An error occurred while fetching approval status",
    };
  }
}
