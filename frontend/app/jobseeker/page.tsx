"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Briefcase, FileText, Sparkles, User } from "lucide-react";
import Link from "next/link";

export default function JobSeekerDashboard() {
  return (
    <DashboardLayout userRole='jobseeker'>
      <div className='space-y-12 pb-16'>
        {/* Hero Welcome Section */}
        <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-500 via-teal-600 to-cyan-700 p-10 text-white shadow-2xl'>
          <div className='absolute inset-0 bg-black/20' />
          <div className='relative z-10 max-w-4xl'>
            <div className='flex items-center gap-3 mb-4'>
              <Sparkles className='h-10 w-10 text-yellow-300' />
              <Badge className='bg-white/20 backdrop-blur-sm text-white border-white/30'>
                Ready to level up
              </Badge>
            </div>
            <h1 className='text-5xl font-bold mb-4'>
              Welcome back, JobPortal!
            </h1>
            <p className='text-xl text-white/90 max-w-2xl'>
              Your next career move is waiting. Let’s make it happen — together.
            </p>
          </div>
          <div className='absolute -bottom-10 -right-10 opacity-20'>
            <div className='w-96 h-96 bg-white/10 rounded-full blur-3xl' />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Quick Links</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Edit Profile */}
            <Link href='/jobseeker/profile'>
              <Card className='relative overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all duration-300 hover:shadow-2xl cursor-pointer bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'>
                <CardContent className='p-10 text-center'>
                  <div className='mx-auto w-24 h-24 bg-linear-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-6 transition-transform'>
                    <User className='h-12 w-12 text-white' />
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                    Complete Your Profile
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    Stand out to employers with a 100% complete profile
                  </p>
                  <div className='flex items-center justify-center text-emerald-600 font-bold transition-all'>
                    <span>Edit Profile</span>
                    <ArrowRight className='h-6 w-6' />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Applied Jobs */}
            <Link href='/jobseeker/applied-jobs'>
              <Card className='relative overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-2xl cursor-pointer bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
                <CardContent className='p-10 text-center'>
                  <div className='mx-auto w-24 h-24 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 transition-transform'>
                    <FileText className='h-12 w-12 text-white' />
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                    Track Applications
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    See where you’ve applied and follow up
                  </p>
                  <div className='flex items-center justify-center text-blue-600 font-bold transition-all'>
                    <span>View Applications</span>
                    <ArrowRight className='h-6 w-6' />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Browse Jobs */}
            <Link href='/'>
              <Card className='relative overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-300 hover:shadow-2xl cursor-pointer bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'>
                <CardContent className='p-10 text-center'>
                  <div className='mx-auto w-24 h-24 bg-linear-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6 transition-transform'>
                    <Briefcase className='h-12 w-12 text-white' />
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                    Discover Jobs
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    Explore thousands of opportunities waiting for you
                  </p>
                  <div className='flex items-center justify-center text-purple-600 font-bold transition-all'>
                    <span>Browse Jobs Now</span>
                    <ArrowRight className='h-6 w-6' />
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
