"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Job } from "@/components/JobCard";
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

const getJobTypeBadgeVariant = (
  jobType: string
): "default" | "secondary" | "outline" | "destructive" => {
  switch (jobType) {
    case "Full-time":
      return "default";
    case "Remote":
      return "secondary";
    case "Part-time":
      return "outline";
    case "Contract":
      return "destructive";
    default:
      return "default";
  }
};

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch employer's jobs
    setTimeout(() => {
      // Mock data - replace with actual API call
      const mockJobs: EmployerJob[] = [
        {
          id: 1,
          title: "Senior Frontend Developer",
          company: "Tech Corp",
          location: "New York, NY",
          jobType: "Full-time",
          salaryRange: "$100,000 - $150,000",
          description: "We are seeking a talented frontend developer...",
          applicantsCount: 12,
          status: "active",
          createdAt: "2025-11-15",
        },
        {
          id: 2,
          title: "Backend Engineer",
          company: "Tech Corp",
          location: "San Francisco, CA",
          jobType: "Remote",
          salaryRange: "$90,000 - $130,000",
          description: "Join our backend team...",
          applicantsCount: 8,
          status: "active",
          createdAt: "2025-11-10",
        },
        {
          id: 5,
          title: "DevOps Engineer",
          company: "Tech Corp",
          location: "Seattle, WA",
          jobType: "Full-time",
          salaryRange: "$120,000 - $180,000",
          description: "Looking for DevOps expert...",
          applicantsCount: 15,
          status: "active",
          createdAt: "2025-11-05",
        },
      ];

      setJobs(mockJobs);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = (jobId: number) => {
    // TODO: Implement delete with confirmation dialog
    if (confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== jobId));
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

        {/* Loading State */}
        {loading && (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <div className='text-center space-y-4'>
                <div className='text-6xl'>📋</div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  No Jobs Posted Yet
                </h3>
                <p className='text-gray-600 dark:text-gray-400 max-w-md'>
                  You haven&apos;t created any job postings yet. Create your
                  first job to start receiving applications.
                </p>
                <Button asChild className='mt-4'>
                  <Link href='/employer/jobs/create'>Post Your First Job</Link>
                </Button>
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
                  key={job.id}
                  className='hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
                      {/* Job Info */}
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
                          <Link href={`/employer/jobs/${job.id}/applicants`}>
                            <Users className='h-4 w-4 mr-2' />
                            Applicants ({job.applicantsCount})
                          </Link>
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          asChild
                          className='flex-1 lg:flex-initial lg:w-full'>
                          <Link href={`/employer/jobs/${job.id}/edit`}>
                            <Edit className='h-4 w-4 mr-2' />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDelete(job.id)}
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
