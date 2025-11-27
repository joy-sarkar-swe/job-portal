"use client";

import { applyJobAction } from "@/actions/job/apply-job";
import { getJobByIdAction, JobDetails } from "@/actions/job/get-job-by-id";
import { getProfileAction } from "@/actions/profile/get-profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  DollarSign,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [user, setUser] = useState<any | null>(null);
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false); // <-- new state

  // Fetch job details and user profile
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setJob(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await getJobByIdAction(jobId);
      if (res.success && res.job) {
        setJob(res.job);
      } else {
        setJob(null);
      }
      setLoading(false);
    };

    const fetchUser = async () => {
      try {
        const res = await getProfileAction();
        if (res.success && res.user) {
          setUser(res.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    fetchUser();
    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 4000);
      return;
    }

    setApplying(true);

    const res = await applyJobAction(jobId!);

    console.log(res);

    setApplying(false);

    if (res.success) {
      setHasApplied(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      alert(res.message);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Job Not Found
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            The job you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href='/'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const canApply = !hasApplied;

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <Button variant='ghost' asChild className='mb-2'>
            <Link href='/'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Login Alert */}
        {showLoginAlert && (
          <Alert className='mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'>
            <AlertDescription className='text-yellow-800 dark:text-yellow-200'>
              You must be logged in to apply for this job.{" "}
              <Link href='/login' className='underline'>
                Login
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {showSuccess && (
          <Alert className='mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'>
            <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
            <AlertDescription className='text-green-800 dark:text-green-200'>
              Application submitted successfully! The employer will review your
              application and contact you soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Job Header Card */}
        <Card className='mb-6'>
          <CardHeader>
            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-3'>
                  <Badge variant='default'>{job.jobType.toUpperCase()}</Badge>
                </div>
                <CardTitle className='text-3xl mb-4'>{job.title}</CardTitle>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
                    <Building2 className='h-5 w-5' />
                    <span className='text-lg font-medium'>{job.company}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
                    <MapPin className='h-5 w-5' />
                    <span>{job.location}</span>
                  </div>
                  {job.salaryRange && (
                    <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
                      <DollarSign className='h-5 w-5' />
                      <span className='font-semibold text-gray-900 dark:text-white'>
                        {job.salaryRange}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Button */}
              <div className='sm:min-w-[200px]'>
                {hasApplied ? (
                  <Button className='w-full' size='lg' disabled>
                    <CheckCircle className='h-4 w-4 mr-2' />
                    Already Applied
                  </Button>
                ) : (
                  <Button
                    className='w-full cursor-pointer'
                    size='lg'
                    onClick={handleApply}
                    disabled={applying}>
                    {applying ? "Submitting..." : "Apply Now"}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Job Description Card */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='prose dark:prose-invert max-w-none'>
              <p className='whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed'>
                {job.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Apply Button for Mobile */}
        {canApply && (
          <div className='mt-6 sm:hidden'>
            <Button
              className='w-full cursor-pointer'
              size='lg'
              onClick={handleApply}
              disabled={applying}>
              {applying ? "Submitting..." : "Apply Now"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
