"use client";

import { getMyApplicationsAction } from "@/actions/job/my-applied-jobs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AppliedJob {
  applicationId: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  dateApplied: string;
  status: string;
  _id: string;
}

export default function AppliedJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setLoading(true);

      // Replace with actual token logic
      const token = localStorage.getItem("token") || "";

      const res = await getMyApplicationsAction({ page: 1, limit: 50 });

      if (res.success && res.data) {
        const mappedJobs: AppliedJob[] = res.data.map((app) => ({
          applicationId: app.applicationId,
          title: app.job.title,
          company: app.job.company,
          location: app.job.location,
          jobType: app.job.jobType,
          dateApplied: app.appliedAt,
          status: app.approved ? "Short Listed" : "Pending",
          _id: app.job._id,
        }));

        setAppliedJobs(mappedJobs);
      } else {
        setAppliedJobs([]);
      }

      setLoading(false);
    };

    fetchAppliedJobs();
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
                  key={job.applicationId}
                  className='hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                      {/* Job Info */}
                      <div className='flex-1 space-y-3'>
                        <div className='flex items-start gap-3 flex-wrap'>
                          <Badge variant='default'>{job.jobType}</Badge>
                          <Badge variant='default'>
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
                          <Link href={`/jobs/${job._id}`}>
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
