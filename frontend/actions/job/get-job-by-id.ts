"use server";

interface Employer {
  _id: string;
  name: string;
  email: string;
}

export interface JobDetails {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: "full-time" | "part-time" | "remote";
  salaryRange: string;
  description: string;
  employer: Employer;
}

export interface GetJobByIdResponse {
  statusCode: number;
  success: boolean;
  message: string;
  job?: JobDetails;
}

export async function getJobByIdAction(
  jobId: string
): Promise<GetJobByIdResponse> {
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URI}/jobs/${jobId}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: data.statusCode || res.status,
        success: false,
        message: data.message || "Failed to fetch job",
      };
    }

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Job fetched successfully",
      job: data.job,
    };
  } catch (err) {
    console.error("Get job by ID error:", err);
    return { statusCode: 500, success: false, message: "Server error" };
  }
}
