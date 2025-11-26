"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AppliedJob {
  id: number;
  jobId: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  dateApplied: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
}

const getStatusColor = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "pending":
      return "secondary";
    case "reviewed":
      return "default";
    case "accepted":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

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

export default function AppliedJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch applied jobs
    setTimeout(() => {
      // Mock data - replace with actual API call
      const mockAppliedJobs: AppliedJob[] = [
        {
          id: 1,
          jobId: 2,
          title: "Backend Engineer",
          company: "StartUp Inc",
          location: "San Francisco, CA",
          jobType: "Remote",
          dateApplied: "2025-11-20",
          status: "pending",
        },
        {
          id: 2,
          jobId: 4,
          title: "UI/UX Designer",
          company: "Creative Agency",
          location: "Los Angeles, CA",
          jobType: "Part-time",
          dateApplied: "2025-11-18",
          status: "reviewed",
        },
        {
          id: 3,
          jobId: 6,
          title: "Product Manager",
          company: "Innovation Labs",
          location: "Boston, MA",
          jobType: "Full-time",
          dateApplied: "2025-11-15",
          status: "pending",
        },
        {
          id: 4,
          jobId: 8,
          title: "Mobile Developer",
          company: "Mobile First",
          location: "New York, NY",
          jobType: "Full-time",
          dateApplied: "2025-11-10",
          status: "reviewed",
        },
        {
          id: 5,
          jobId: 10,
          title: "QA Engineer",
          company: "Quality Works",
          location: "Austin, TX",
          jobType: "Contract",
          dateApplied: "2025-11-05",
          status: "pending",
        },
      ];

      setAppliedJobs(mockAppliedJobs);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout userRole='jobseeker'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Applied Jobs
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Track your job applications
            </p>
          </div>
          <Button asChild>
            <Link href='/'>Browse More Jobs</Link>
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && appliedJobs.length === 0 && (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <div className='text-center space-y-4'>
                <div className='text-6xl'>📋</div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  No Applications Yet
                </h3>
                <p className='text-gray-600 dark:text-gray-400 max-w-md'>
                  You haven&apos;t applied to any jobs yet. Start browsing and
                  apply to jobs that match your skills.
                </p>
                <Button asChild className='mt-4'>
                  <Link href='/'>Browse Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        {!loading && appliedJobs.length > 0 && (
          <>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Showing {appliedJobs.length} application
              {appliedJobs.length !== 1 ? "s" : ""}
            </div>

            <div className='grid grid-cols-1 gap-4'>
              {appliedJobs.map((job) => (
                <Card
                  key={job.id}
                  className='hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                      {/* Job Info */}
                      <div className='flex-1 space-y-3'>
                        <div className='flex items-start gap-3 flex-wrap'>
                          <Badge variant={getJobTypeBadgeVariant(job.jobType)}>
                            {job.jobType}
                          </Badge>
                          <Badge variant={getStatusColor(job.status)}>
                            {job.status.charAt(0).toUpperCase() +
                              job.status.slice(1)}
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
                          <div className='flex items-center gap-2'>
                            <Calendar className='h-4 w-4' />
                            <span>
                              Applied on {formatDate(job.dateApplied)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='flex gap-2 lg:flex-col'>
                        <Button
                          variant='outline'
                          asChild
                          className='flex-1 lg:flex-initial'>
                          <Link href={`/jobs/${job.jobId}`}>
                            <ExternalLink className='h-4 w-4 mr-2' />
                            View Job
                          </Link>
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
