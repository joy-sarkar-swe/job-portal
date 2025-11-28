"use client";

import { applyJobAction } from "@/actions/job/apply-job";
import { getJobByIdAction, JobDetails } from "@/actions/job/get-job-by-id";
import { getProfileAction } from "@/actions/profile/get-profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  DollarSign,
  Loader2,
  MapPin,
  Sparkles,
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch job
      const jobRes = await getJobByIdAction(jobId as string);
      if (jobRes.success && jobRes.job) {
        setJob(jobRes.job);
      } else {
        setJob(null);
      }

      // Fetch user
      try {
        const profileRes = await getProfileAction();
        if (profileRes.success && profileRes.user) {
          setUser(profileRes.user);
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    if (jobId) fetchData();
  }, [jobId]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 4000);
      return;
    }

    setApplying(true);
    const res = await applyJobAction(jobId!);
    setApplying(false);

    if (res.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      alert(res.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-6'></div>
          <p className='text-xl text-gray-600'>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6'>
        <div className='text-center max-w-md'>
          <Briefcase className='h-24 w-24 text-gray-300 mx-auto mb-8' />
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Job Not Found
          </h1>
          <p className='text-lg text-gray-600 mb-10'>
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button size='lg' asChild className='font-bold shadow-lg'>
            <Link href='/'>
              <ArrowLeft className='h-5 w-5 mr-2' />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Back Button */}
      <div className='max-w-5xl mx-auto px-6 pt-8'>
        <Button variant='ghost' size='lg' asChild className='font-medium'>
          <Link href='/'>
            <ArrowLeft className='h-5 w-5 mr-2' />
            Back to Jobs
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className='max-w-5xl mx-auto px-6 pb-20'>
        {/* Login Alert */}
        {showLoginAlert && (
          <Alert className='mt-6 bg-amber-50 border-amber-200 dark:bg-amber-900/30'>
            <AlertCircle className='h-5 w-5 text-amber-600' />
            <AlertDescription className='text-amber-800 font-medium'>
              You need to be logged in to apply.{" "}
              <Link href='/login' className='underline font-bold'>
                Login now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {showSuccess && (
          <Alert className='mt-6 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30'>
            <CheckCircle2 className='h-6 w-6 text-emerald-600' />
            <AlertDescription className='text-emerald-800 font-bold text-lg'>
              Application submitted successfully! 🎉
              <br />
              <span className='text-base font-normal'>
                The employer will review your profile and contact you soon.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Job Card */}
        <Card className='mt-8 border-0 shadow-2xl overflow-hidden'>
          <CardContent className='p-10 md:p-12'>
            <div className='flex flex-col md:flex-row items-start justify-between gap-8'>
              {/* Left: Job Info */}
              <div className='flex-1'>
                <div className='flex items-center gap-4 mb-6'>
                  <Avatar className='h-20 w-20 ring-4 ring-white shadow-xl'>
                    <AvatarFallback className='bg-linear-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold'>
                      {job.company.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className='text-4xl font-bold text-gray-900'>
                      {job.title}
                    </h1>
                    <p className='text-2xl font-medium text-gray-700 mt-1'>
                      {job.company}
                    </p>
                  </div>
                </div>

                <div className='flex flex-wrap gap-3 mb-8'>
                  <Badge className='text-lg px-5 py-2 font-medium bg-blue-100 text-blue-700'>
                    {job.jobType}
                  </Badge>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg'>
                  <div className='flex items-center gap-3 text-gray-700'>
                    <MapPin className='h-6 w-6 text-gray-500' />
                    <span className='font-medium'>{job.location}</span>
                  </div>
                  {job.salaryRange && (
                    <div className='flex items-center gap-3 text-gray-700'>
                      <DollarSign className='h-6 w-6 text-green-600' />
                      <span className='font-bold text-green-700'>
                        {job.salaryRange}
                      </span>
                    </div>
                  )}
                  <div className='flex items-center gap-3 text-gray-700'>
                    <Calendar className='h-6 w-6 text-gray-500' />
                    <span>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Apply Button */}
              <div className='w-full md:w-auto'>
                {
                  <Button
                    onClick={handleApply}
                    disabled={applying}
                    className='w-full text-lg py-8 font-bold shadow-2xl hover:shadow-3xl cursor-pointer'
                    size='lg'>
                    {applying ? (
                      <>
                        <Loader2 className='h-6 w-6 mr-3 animate-spin' />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className='h-6 w-6 mr-3' />
                        Apply Now
                      </>
                    )}
                  </Button>
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card className='mt-10 border-0 shadow-xl'>
          <CardContent className='p-10 md:p-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3'>
              <Briefcase className='h-8 w-8 text-primary' />
              Job Description
            </h2>
            <div className='prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed'>
              <p className='whitespace-pre-line'>{job.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
