"use client";

import { getJobsAction, Job } from "@/actions/job/get-job";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  DollarSign,
  Edit,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface EmployerJob extends Job {
  applicantsCount: number;
  status: "active" | "closed";
  createdAt: string;
}

// Debounce Hook
function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

const getJobTypeBadgeVariant = (
  jobType: string
): "default" | "secondary" | "outline" | "destructive" => {
  switch (jobType.toLowerCase()) {
    case "full-time":
      return "default";
    case "remote":
      return "secondary";
    case "part-time":
      return "outline";
    default:
      return "default";
  }
};

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Filters
  const [searchJob, setSearchJob] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState<
    "full-time" | "part-time" | "remote" | ""
  >("");

  // 🔥 Debounced values
  const debouncedSearch = useDebounce(searchJob, 400);
  const debouncedJobType = useDebounce(jobTypeFilter, 300);

  const fetchJobs = async (cursor?: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await getJobsAction(
        undefined,
        jobTypeFilter || undefined,
        cursor,
        "10",
        searchJob || undefined
      );

      if (!res.success) {
        setError(res.message);
        setLoading(false);
        return;
      }

      const mappedJobs: EmployerJob[] = (res.jobs || []).map((job: Job) => ({
        ...job,
        applicantsCount: (job as any).applicantsCount || 0,
        status: (job as any).status || "active",
        createdAt: (job as any).createdAt || new Date().toISOString(),
      }));

      setJobs((prev) => (cursor ? [...prev, ...mappedJobs] : mappedJobs));
      setNextCursor(res.nextCursor ?? null);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Auto fetch on search or type filter change
  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, debouncedJobType]);

  // Initial load
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = (jobId: string | number) => {
    if (confirm("Are you sure you want to delete this job?")) {
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      // TODO: API delete
    }
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchJobs(nextCursor);
    }
  };

  return (
    <DashboardLayout userRole='employer'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              My Jobs
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Manage your job postings
            </p>
          </div>
          <Button asChild>
            <Link href='/employer/jobs/create'>Create New Job</Link>
          </Button>
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-4 items-center'>
          <input
            type='text'
            placeholder='Search Jobs'
            value={searchJob}
            onChange={(e) => setSearchJob(e.target.value)}
            className='border rounded px-3 py-2 w-full sm:w-60'
          />

          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value as any)}
            className='border rounded px-3 py-2 w-full sm:w-60'>
            <option value=''>All Job Types</option>
            <option value='full-time'>Full-time</option>
            <option value='part-time'>Part-time</option>
            <option value='remote'>Remote</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className='text-red-600 dark:text-red-400 text-center py-4'>
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && jobs.length === 0 && !error && (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <div className='text-center space-y-4'>
                <div className='text-6xl'>📋</div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  No Jobs Found
                </h3>
                <p className='text-gray-600 dark:text-gray-400 max-w-md'>
                  Try adjusting your search or filters.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        {!loading && jobs.length > 0 && (
          <>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
            </div>

            <div className='grid grid-cols-1 gap-4'>
              {jobs.map((job) => (
                <Card
                  key={job._id}
                  className='hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
                      {/* Info */}
                      <div className='flex-1 space-y-3'>
                        <div className='flex items-start gap-3 flex-wrap'>
                          <Badge variant={getJobTypeBadgeVariant(job.jobType)}>
                            {job.jobType}
                          </Badge>
                          <Badge
                            variant={
                              job.status === "active" ? "default" : "secondary"
                            }>
                            {job.status === "active" ? "Active" : "Closed"}
                          </Badge>
                        </div>

                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                          {job.title}
                        </h3>

                        <div className='flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400'>
                          <div className='flex items-center gap-2'>
                            <Building2 className='h-4 w-4' />
                            <span>{job.company}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            <span>{job.location}</span>
                          </div>
                          {job.salaryRange && (
                            <div className='flex items-center gap-2'>
                              <DollarSign className='h-4 w-4' />
                              <span>{job.salaryRange}</span>
                            </div>
                          )}
                          <div className='flex items-center gap-2'>
                            <Users className='h-4 w-4' />
                            <span>{job.applicantsCount} applicants</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='flex flex-wrap gap-2 lg:flex-col lg:min-w-40'>
                        <Button
                          variant='outline'
                          size='sm'
                          asChild
                          className='flex-1 lg:flex-initial lg:w-full'>
                          <Link href={`/employer/jobs/${job._id}/applicants`}>
                            <Users className='h-4 w-4 mr-2' />
                            Applicants ({job.applicantsCount})
                          </Link>
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          asChild
                          className='flex-1 lg:flex-initial lg:w-full'>
                          <Link href={`/employer/jobs/${job._id}/edit`}>
                            <Edit className='h-4 w-4 mr-2' />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDelete(job._id)}
                          className='flex-1 lg:flex-initial lg:w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'>
                          <Trash2 className='h-4 w-4 mr-2' />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {nextCursor && (
              <div className='flex justify-center mt-4'>
                <Button onClick={handleLoadMore}>Load More</Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
