"use client";

import { JobFilters } from "@/components/JobFilters";
import { JobList } from "@/components/JobList";
import { Button } from "@/components/ui/button";
import { useInfiniteJobs } from "@/hooks/useInfiniteJobs";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const {
    jobs,
    allJobsCount,
    isLoading,
    hasMore,
    filters,
    loadMoreJobs,
    handleFilterChange,
  } = useInfiniteJobs();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
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

        {/* Filters with Search */}
        <JobFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Jobs Count */}
        <div className='mb-4'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Showing {jobs.length} of {allJobsCount} jobs loaded
          </p>
        </div>

        {/* Job Listings with Infinite Scroll */}
        <JobList
          jobs={jobs}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMoreJobs}
        />
      </main>
    </div>
  );
}
