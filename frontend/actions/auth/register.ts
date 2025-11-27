"use server";

import { registerSchema } from "@/lib/validations/auth";

interface RegisterResponse {
  statusCode: number;
  success: boolean;
  message?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: "jobseeker" | "employer";
    isEmployerApproved?: boolean;
  };
}

export async function registerAction(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: "jobseeker" | "employer"
): Promise<RegisterResponse> {
  try {
    // Validate input with Zod
    const validationResult = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        statusCode: 400,
        success: false,
        message: firstError.message,
      };
    }

    const validatedData = validationResult.data;

    const response = await fetch(
      `${process.env.NEXT_BACKEND_URI}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
          role: validatedData.role,
        }),
      }
    );

    const data = await response.json();

    // Backend error: 409, 400, etc.
    if (!response.ok) {
      return {
        statusCode: data.statusCode || response.status,
        success: false,
        message: data.message || "Registration failed",
      };
    }

    // Success response
    return {
      statusCode: data.statusCode || 201,
      success: true,
      message: data.message || "User registered successfully",
      user: data.user,
    };
  } catch (error) {
    console.error("Registration error:", error);

    return {
      statusCode: 500,
      success: false,
      message: "An error occurred during registration. Please try again.",
    };
  }
}
