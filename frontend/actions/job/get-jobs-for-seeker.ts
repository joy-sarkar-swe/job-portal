"use server";

export type JobType = "full-time" | "part-time" | "remote";

export interface Employer {
  _id: string;
  name: string;
  email: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  salaryRange: string;
  description: string;
  skills?: string[];
  applicantsCount: number;
  employer: Employer;
}

export interface GetJobsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  jobs?: Job[];
  nextCursor?: string | null;
  hasMore?: boolean;
}

export async function getJobsForSeekerAction(
  jobType?: JobType,
  cursor?: string,
  limit?: string,
  search?: string
): Promise<GetJobsResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit || "10",
    });

    if (jobType) params.append("jobType", jobType);
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);

    const res = await fetch(
      `${process.env.NEXT_BACKEND_URI}/jobs?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: data.statusCode || res.status,
        success: false,
        message: data.message || "Failed to fetch jobs",
      };
    }

    // Map jobs to include applicantsCount if not already
    const jobsWithApplicants: Job[] = data.jobs.map((job: any) => ({
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      salaryRange: job.salaryRange,
      description: job.description,
      skills: job.skills || [],
      applicantsCount: job.applicantsCount || 0,
      employer: job.employer,
    }));

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Jobs retrieved successfully",
      jobs: jobsWithApplicants,
      nextCursor: data.nextCursor ?? null,
      hasMore: data.hasMore ?? false,
    };
  } catch (err) {
    console.error("Get jobs error:", err);
    return { statusCode: 500, success: false, message: "Server error" };
  }
}
