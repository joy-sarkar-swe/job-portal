"use client";

import { Job } from "@/components/JobCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generateMockJob,
  getCurrentUser,
  hasUserApplied,
  markJobAsApplied,
} from "@/lib/mockData";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle,
  DollarSign,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params.id);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (jobId < 1 || jobId > 50) {
        setJob(null);
        setLoading(false);
        return;
      }

      const fetchedJob = generateMockJob(jobId);
      setJob(fetchedJob);
      setLoading(false);

      if (fetchedJob && currentUser.isLoggedIn) {
        setHasApplied(hasUserApplied(currentUser.id, jobId));
      }
    }, 500);
  }, [jobId, currentUser.id, currentUser.isLoggedIn]);

  const handleApply = async () => {
    if (!currentUser.isLoggedIn) {
      router.push("/login");
      return;
    }

    if (currentUser.role !== "jobseeker") {
      return;
    }

    setApplying(true);

    // Simulate API call
    setTimeout(() => {
      markJobAsApplied(jobId);
      setHasApplied(true);
      setApplying(false);
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
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

  const canApply =
    currentUser.isLoggedIn && currentUser.role === "jobseeker" && !hasApplied;

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
                  <Badge variant={getJobTypeBadgeVariant(job.jobType)}>
                    {job.jobType}
                  </Badge>
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
                {!currentUser.isLoggedIn ? (
                  <Button className='w-full' size='lg' asChild>
                    <Link href='/login'>Sign In to Apply</Link>
                  </Button>
                ) : currentUser.role !== "jobseeker" ? (
                  <Alert>
                    <Briefcase className='h-4 w-4' />
                    <AlertDescription>
                      Only job seekers can apply for jobs.
                    </AlertDescription>
                  </Alert>
                ) : hasApplied ? (
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
