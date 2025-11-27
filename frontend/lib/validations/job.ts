import { z } from "zod";

export enum JobType {
  FULL_TIME = "full-time",
  PART_TIME = "part-time",
  REMOTE = "remote",
}

/**
 * Create Job validation schema
 */
export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  company: z.string().min(1, "Company is required").trim(),
  location: z.string().min(1, "Location is required").trim(),
  jobType: z.enum(JobType, {
    message: "Job type must be one of: full-time, part-time, remote",
  }),
  salaryRange: z.string().min(1, "Salary range is required").trim(),
  description: z.string().min(1, "Description is required").trim(),
});

export const updateJobSchema = createJobSchema.partial();

// TypeScript type inferred from schema
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
