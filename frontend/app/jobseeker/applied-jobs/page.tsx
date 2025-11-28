"use client";

import { getMyApplicationsAction } from "@/actions/job/my-applied-jobs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ExternalLink,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AppliedJob {
  applicationId: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  dateApplied: string;
  status: "Short Listed" | "Pending";
  _id: string;
}

export default function AppliedJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setLoading(true);
      const res = await getMyApplicationsAction({ page: 1, limit: 50 });

      if (res.success && res.data) {
        const application = res.data.map((app: any) => ({
          applicationId: app.applicationId,
          title: app.job.title,
          company: app.job.company,
          location: app.job.location,
          jobType: app.job.jobType,
          dateApplied: app.appliedAt,
          status: app.approved ? "Short Listed" : "Pending",
          _id: app.job._id,
        }));
        setAppliedJobs(application as any);
      } else {
        setAppliedJobs([]);
      }
      setLoading(false);
    };

    fetchAppliedJobs();
  }, []);

  return (
    <DashboardLayout userRole='jobseeker'>
      <div className='mx-auto space-y-10 pb-16'>
        {/* Hero Header */}
        <div className='text-center'>
          <h1 className='text-5xl font-bold text-gray-900 mb-4'>
            Your Applications
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Track every step of your job search journey — you’ve got this!
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className='animate-pulse'>
                <CardContent className='p-8'>
                  <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='space-y-3'>
                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                    <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && appliedJobs.length === 0 && (
          <Card className='border-dashed border-2'>
            <CardContent className='flex flex-col items-center justify-center py-24 text-center'>
              <div className='bg-gray-100 rounded-full p-10 mb-8'>
                <Briefcase className='h-20 w-20 text-gray-400' />
              </div>
              <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                No Applications Yet
              </h3>
              <p className='text-lg text-gray-600 max-w-md mb-10'>
                Your journey starts with the first application. Let’s find your
                dream job!
              </p>
              <Button size='lg' asChild className='font-bold shadow-lg'>
                <Link href='/'>
                  <ArrowRight className='h-5 w-5 mr-2' />
                  Start Applying Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Applications Grid */}
        {!loading && appliedJobs.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {appliedJobs.map((job) => (
              <Card
                key={job.applicationId}
                className='hover:shadow-2xl transition-all duration-300 border-0 shadow-xl overflow-hidden'>
                <CardContent className='p-8'>
                  <div className='flex items-start justify-between mb-6'>
                    <div className='flex items-center gap-5'>
                      <Avatar className='h-16 w-16 ring-4 ring-white shadow-lg'>
                        <AvatarFallback className='bg-linear-to-br from-purple-500 to-pink-600 text-white font-bold text-xl'>
                          {job.company.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='text-2xl font-bold text-gray-900 transition-colors'>
                          {job.title}
                        </h3>
                        <p className='text-lg font-medium text-gray-700'>
                          {job.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4 text-gray-600'>
                    <div className='flex items-center gap-3'>
                      <MapPin className='h-5 w-5 text-gray-500' />
                      <span>{job.location}</span>
                      <span className='mx-2'>•</span>
                      <Badge variant='outline' className='font-medium'>
                        {job.jobType}
                      </Badge>
                    </div>

                    <div className='flex items-center gap-3'>
                      <Calendar className='h-5 w-5 text-gray-500' />
                      <span className='font-medium'>
                        Applied {new Date(job.dateApplied).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className='mt-8 pt-6 border-t border-gray-200'>
                    <Button
                      asChild
                      className='w-full font-semibold shadow-md'
                      size='lg'>
                      <Link href={`/jobs/${job._id}`}>
                        <ExternalLink className='h-5 w-5 mr-2' />
                        View Job Posting
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
