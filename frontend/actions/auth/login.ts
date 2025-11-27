"use server";

import { loginSchema } from "@/lib/validations/auth";
import { cookies } from "next/headers";

interface LoginResponse {
  statusCode: number;
  success: boolean;
  message?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: "jobseeker" | "employer" | "admin";
    isEmployerApproved?: boolean;
    isBlocked?: boolean;
  };
}

export async function loginAction(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    // Validate input with Zod
    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        statusCode: 400,
        success: false,
        message: firstError.message,
      };
    }

    const validatedData = validationResult.data;

    const response = await fetch(`${process.env.NEXT_BACKEND_URI}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    const data = await response.json();

    // Backend error (Unauthorized, Blocked, Not Approved...)
    if (!response.ok) {
      return {
        statusCode: data.statusCode || response.status,
        success: false,
        message: data.message || "Login failed",
      };
    }

    // Set access token in HTTP-only cookie
    if (data.accessToken) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    // Successful login
    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Login successful",
      user: data.user,
    };
  } catch (error) {
    console.error("Login error:", error);

    return {
      statusCode: 500,
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}
