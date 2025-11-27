"use client";

import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Briefcase className='h-8 w-8 text-primary' />
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Job Portal
            </h1>
          </div>
          <div className='flex gap-2'>
            <Button asChild variant='outline'>
              <Link href='/login'>Sign In</Link>
            </Button>
            <Button asChild>
              <Link href='/register'>Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <div className='mb-8 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3'>
            Find Your Dream Job
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Discover opportunities that match your skills and passion
          </p>
        </div>
      </main>
    </div>
  );
}
