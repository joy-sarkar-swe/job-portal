"use server";

import { createJobSchema } from "@/lib/validations/job";
import { cookies } from "next/headers";

interface JobResponse {
  statusCode?: number;
  success: boolean;
  message?: string;
  job?: any;
}

export async function postJobAction(
  title: string,
  company: string,
  location: string,
  jobType: string,
  salaryRange: string,
  description: string
): Promise<JobResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Validate input with Zod
    const validationResult = createJobSchema.safeParse({
      title,
      company,
      location,
      jobType,
      salaryRange,
      description,
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

    const response = await fetch(`${process.env.NEXT_BACKEND_URI}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validatedData),
    });

    const data = await response.json();

    // Backend error
    if (!response.ok) {
      return {
        statusCode: data.statusCode || response.status,
        success: false,
        message: data.message || "Failed to create job",
      };
    }

    // Successful job creation
    return {
      statusCode: data.statusCode || 201,
      success: true,
      message: data.message || "Job created successfully",
      job: data.job,
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
