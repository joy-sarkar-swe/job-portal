"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Briefcase, CheckCircle2, Plus } from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
  return (
    <DashboardLayout userRole='employer'>
      <div className='space-y-10 pb-12'>
        {/* Hero Welcome Section */}
        <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 p-10 text-white shadow-2xl'>
          <div className='absolute inset-0 bg-black/20' />
          <div className='relative z-10 max-w-4xl'>
            <div className='flex items-center gap-3 mb-4'>
              <CheckCircle2 className='h-10 w-10 text-green-300' />
              <Badge className='bg-green-500/20 text-green-100 border-green-400'>
                Account Active & Approved
              </Badge>
            </div>
            <h1 className='text-5xl font-bold mb-4'>Welcome back, Employer!</h1>
            <p className='text-xl text-white/90 max-w-2xl'>
              You're all set to hire top talent. Post jobs, review applications,
              and build your dream team.
            </p>
          </div>
          <div className='absolute -bottom-10 -right-10 opacity-20'>
            <div className='w-80 h-80 bg-white/10 rounded-full blur-3xl' />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Post New Job */}
            <Link href='/employer/jobs/create'>
              <Card className='relative overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-2xl cursor-pointer bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
                <CardContent className='p-8 text-center'>
                  <div className='mx-auto w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 transition-transform'>
                    <Plus className='h-10 w-10 text-white' />
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                    Post a New Job
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Reach thousands of qualified candidates instantly
                  </p>
                  <div className='flex items-center justify-center text-blue-600 font-semibold transition-all'>
                    <span>Get Started</span>
                    <ArrowRight className='h-5 w-5 ml-2 transition-all' />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* My Jobs */}
            <Link href='/employer/jobs'>
              <Card className='relative overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-300 hover:shadow-2xl cursor-pointer bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'>
                <CardContent className='p-8 text-center'>
                  <div className='mx-auto w-20 h-20 bg-linear-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6 transition-transform'>
                    <Briefcase className='h-10 w-10 text-white' />
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                    Manage My Jobs
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Edit, pause, or boost your current job postings
                  </p>
                  <div className='flex items-center justify-center text-purple-600 font-semibold transition-all'>
                    <span>View All Jobs</span>
                    <ArrowRight className='h-5 w-5 ml-2 transition-all' />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
