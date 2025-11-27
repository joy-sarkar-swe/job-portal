"use server";

import { updateJobSchema } from "@/lib/validations/job";
import { cookies } from "next/headers";

interface JobUpdateResponse {
  statusCode?: number;
  success: boolean;
  message?: string;
  job?: any;
}

export async function updateJobByIdAction(
  jobId: string,
  payload: {
    title?: string;
    company?: string;
    location?: string;
    jobType?: string;
    salaryRange?: string;
    description?: string;
  }
): Promise<JobUpdateResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Validate with Zod (partial schema)
    const validationResult = updateJobSchema.safeParse(payload);

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
      `${process.env.NEXT_BACKEND_URI}/jobs/${jobId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validatedData),
      }
    );

    const data = await response.json();

    // Backend error
    if (!response.ok) {
      return {
        statusCode: data.statusCode || response.status,
        success: false,
        message: data.message || "Failed to update job",
      };
    }

    // Successful update
    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Job updated successfully",
      job: data.job,
    };
  } catch (error) {
    console.error("Update job error:", error);

    return {
      statusCode: 500,
      success: false,
      message: "An error occurred while updating the job. Please try again.",
    };
  }
}
