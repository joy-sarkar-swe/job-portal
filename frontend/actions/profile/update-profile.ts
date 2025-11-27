"use server";

import { UpdateProfileDto, updateProfileSchema } from "@/lib/validations/auth";
import { cookies } from "next/headers";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
}

export interface UpdateProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  user?: UserProfile;
}

export async function updateProfileAction(
  payload: UpdateProfileDto
): Promise<UpdateProfileResponse> {
  try {
    // Validate payload
    const updateProfileDto: UpdateProfileDto =
      updateProfileSchema.parse(payload);

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { statusCode: 401, success: false, message: "Not authenticated" };
    }

    const res = await fetch(`${process.env.NEXT_BACKEND_URI}/user/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateProfileDto),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: data.statusCode || res.status,
        success: false,
        message: data.message || "Failed to update profile",
      };
    }

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Profile updated successfully",
      user: data.user,
    };
  } catch (err: any) {
    if (err?.errors) {
      // Zod validation errors
      return {
        statusCode: 400,
        success: false,
        message: err.errors[0]?.message || "Invalid input",
      };
    }
    console.error("Update profile error:", err);
    return { statusCode: 500, success: false, message: "Server error" };
  }
}
