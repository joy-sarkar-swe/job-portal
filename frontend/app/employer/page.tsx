"use client";

import { getAccountApprovalStatus } from "@/actions/auth/account-approval-status";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  FileText,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployerDashboard() {
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock stats - replace with actual API calls
  const stats = {
    totalJobs: 12,
    totalApplicants: 48,
    activeJobs: 8,
    pendingApplications: 15,
  };

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        const result = await getAccountApprovalStatus();

        if (result.success) {
          setIsApproved(result.approvalStatus ?? false);
        } else {
          setError(result.message || "Failed to fetch approval status");
        }
      } catch {
        setError("An error occurred while fetching approval status");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovalStatus();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout userRole='employer' isEmployerApproved={undefined}>
        <div className='flex items-center justify-center min-h-[400px]'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userRole='employer'
      isEmployerApproved={isApproved ?? undefined}>
      <div className='space-y-6'>
        {/* Welcome Section */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Welcome back, Employer!
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Manage your job postings and applicants
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-5 w-5' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Approval Status */}
        {!isApproved ? (
          <Alert className='bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'>
            <AlertCircle className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
            <AlertTitle className='text-yellow-800 dark:text-yellow-200 font-semibold'>
              Account Pending Approval
            </AlertTitle>
            <AlertDescription className='text-yellow-700 dark:text-yellow-300'>
              Your account is pending approval by the admin. You will be able to
              post jobs and manage applicants once your account is approved.
              This typically takes 1-2 business days.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Approval Success Message */}
            <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'>
              <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
              <AlertDescription className='text-green-800 dark:text-green-200'>
                Your account is approved and active!
              </AlertDescription>
            </Alert>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Jobs Posted
                  </CardTitle>
                  <Briefcase className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.totalJobs}</div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    All job listings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Applicants
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats.totalApplicants}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Across all jobs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Active Jobs
                  </CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.activeJobs}</div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Currently accepting applications
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pending Reviews
                  </CardTitle>
                  <FileText className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats.pendingApplications}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    New applications to review
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <Button
                  asChild
                  variant='outline'
                  className='h-auto py-6 flex-col gap-2'>
                  <Link href='/employer/jobs/create'>
                    <Briefcase className='h-6 w-6' />
                    <span className='font-semibold'>Post New Job</span>
                    <span className='text-xs text-muted-foreground'>
                      Create a job listing
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant='outline'
                  className='h-auto py-6 flex-col gap-2'>
                  <Link href='/employer/jobs'>
                    <FileText className='h-6 w-6' />
                    <span className='font-semibold'>My Jobs</span>
                    <span className='text-xs text-muted-foreground'>
                      Manage job postings
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant='outline'
                  className='h-auto py-6 flex-col gap-2'>
                  <Link href='/'>
                    <Users className='h-6 w-6' />
                    <span className='font-semibold'>View Applicants</span>
                    <span className='text-xs text-muted-foreground'>
                      Review applications
                    </span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
