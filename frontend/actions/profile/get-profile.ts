"use server";

import { cookies } from "next/headers";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
  isEmployerApproved?: boolean;
  isBlocked?: boolean;
}

export interface GetProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  user?: UserProfile;
}

export async function getProfileAction(): Promise<GetProfileResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { statusCode: 401, success: false, message: "Not authenticated" };
    }

    const res = await fetch(`${process.env.NEXT_BACKEND_URI}/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: data.statusCode || res.status,
        success: false,
        message: data.message || "Failed to fetch user profile",
      };
    }

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "User profile fetched successfully",
      user: data.user,
    };
  } catch (err) {
    console.error("Get profile error:", err);
    return { statusCode: 500, success: false, message: "Server error" };
  }
}
