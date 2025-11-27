"use server";

import { cookies } from "next/headers";

interface ToggleBlockEmployerResponse {
  statusCode: number;
  success: boolean;
  message?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    isEmployerApproved: boolean;
  };
}

export async function toggleBlockUser(
  userId: string
): Promise<ToggleBlockEmployerResponse> {
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
      `${process.env.NEXT_BACKEND_URI}/admin/user/block/${userId}`,
      {
        method: "PATCH",
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
        message: data.message || "Failed to toggle block status",
      };
    }

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Employer block status updated successfully",
      user: data.user,
    };
  } catch (error) {
    console.error("Toggle block employer error:", error);
    return {
      statusCode: 500,
      success: false,
      message: "An error occurred while toggling block status",
    };
  }
}
