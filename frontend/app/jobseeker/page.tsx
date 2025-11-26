"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/mockData";
import { Briefcase, FileText, TrendingUp, User } from "lucide-react";
import Link from "next/link";

export default function JobSeekerDashboard() {
  const user = getCurrentUser();

  // Mock data - replace with actual API calls
  const stats = {
    appliedJobs: 5,
    profileViews: 24,
    savedJobs: 8,
  };

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

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Applied Jobs
              </CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.appliedJobs}</div>
              <p className='text-xs text-muted-foreground mt-1'>
                Total applications submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Profile Views
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.profileViews}</div>
              <p className='text-xs text-muted-foreground mt-1'>
                Employers viewed your profile
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Saved Jobs</CardTitle>
              <Briefcase className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.savedJobs}</div>
              <p className='text-xs text-muted-foreground mt-1'>
                Jobs you&apos;re interested in
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

        {/* Profile Completion */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium'>Profile Strength</span>
                  <span className='text-sm text-muted-foreground'>75%</span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all'
                    style={{ width: "75%" }}
                  />
                </div>
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                <p className='mb-2'>
                  Complete your profile to increase visibility:
                </p>
                <ul className='list-disc list-inside space-y-1 ml-2'>
                  <li>Add a professional bio</li>
                  <li>Upload your resume</li>
                  <li>List your skills</li>
                </ul>
              </div>
              <Button asChild className='w-full sm:w-auto'>
                <Link href='/jobseeker/profile'>Complete Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
