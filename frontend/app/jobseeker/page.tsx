"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/mockData";
import { Briefcase, FileText, User } from "lucide-react";
import Link from "next/link";

export default function JobSeekerDashboard() {
  const user = getCurrentUser();

  return (
    <DashboardLayout userRole='jobseeker'>
      <div className='space-y-6'>
        {/* Welcome Section */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Welcome back, {user.name || "Job Seeker"}!
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Here&apos;s your job search overview
          </p>
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
              <Link href='/jobseeker/profile'>
                <User className='h-6 w-6' />
                <span className='font-semibold'>Edit Profile</span>
                <span className='text-xs text-muted-foreground'>
                  Update your information
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant='outline'
              className='h-auto py-6 flex-col gap-2'>
              <Link href='/jobseeker/applied-jobs'>
                <FileText className='h-6 w-6' />
                <span className='font-semibold'>Applied Jobs</span>
                <span className='text-xs text-muted-foreground'>
                  View your applications
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant='outline'
              className='h-auto py-6 flex-col gap-2'>
              <Link href='/'>
                <Briefcase className='h-6 w-6' />
                <span className='font-semibold'>Browse Jobs</span>
                <span className='text-xs text-muted-foreground'>
                  Find new opportunities
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
