"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CheckCircle, FileText, Users } from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
  return (
    <DashboardLayout userRole='employer'>
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

        {/* Approval Success Message */}
        <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'>
          <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
          <AlertDescription className='text-green-800 dark:text-green-200'>
            Your account is approved and active!
          </AlertDescription>
        </Alert>

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
              <Link href='/employer/applicants'>
                <Users className='h-6 w-6' />
                <span className='font-semibold'>View Applicants</span>
                <span className='text-xs text-muted-foreground'>
                  Review applications
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
