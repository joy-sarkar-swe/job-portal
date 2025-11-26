"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Job, JobCard } from "./JobCard";
import { Button } from "./ui/button";

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function JobList({
  jobs,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}: JobListProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, []);

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  if (jobs.length === 0 && !isLoading) {
    return (
      <div className='col-span-full text-center py-12'>
        <p className='text-gray-500 dark:text-gray-400 text-lg'>
          No jobs found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div
          ref={loaderRef}
          className='flex justify-center items-center py-8 col-span-full'>
          {isLoading ? (
            <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
              <Loader2 className='h-6 w-6 animate-spin' />
              <span>Loading more jobs...</span>
            </div>
          ) : (
            <Button
              variant='outline'
              onClick={onLoadMore}
              className='min-w-[200px]'>
              Load More Jobs
            </Button>
          )}
        </div>
      )}

      {/* Initial Loading State */}
      {isLoading && jobs.length === 0 && (
        <div className='col-span-full flex justify-center items-center py-12'>
          <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span>Loading jobs...</span>
          </div>
        </div>
      )}
    </>
  );
}
