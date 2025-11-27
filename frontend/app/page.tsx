"use client";

import { logoutAction } from "@/actions/auth/logout";
import { getJobsForSeekerAction } from "@/actions/job/get-jobs-for-seeker";
import { getProfileAction } from "@/actions/profile/get-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState<
    "full-time" | "part-time" | "remote" | undefined
  >(undefined);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileAction();
        if (res.success && res.user) {
          setUser(res.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch jobs
  const fetchJobs = async (cursor?: string, append = false) => {
    setJobsLoading(true);
    try {
      const res = await getJobsForSeekerAction(jobTypeFilter, cursor, "10");
      if (res.success && res.jobs) {
        setJobs((prev) => (append ? [...prev, ...res.jobs!] : res.jobs!));
        setNextCursor(res.nextCursor ?? null);
        setHasMore(res.hasMore ?? false);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setJobsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, [jobTypeFilter]);

  const handleLogout = async () => {
    await logoutAction();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLoadMore = () => {
    if (hasMore && nextCursor) fetchJobs(nextCursor, true);
  };

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
            {!loading &&
              (!isAuthenticated ? (
                <>
                  <Button asChild variant='outline'>
                    <Link href='/login'>Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href='/register'>Get Started</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage
                        src={user?.profilePicture || "/default-avatar.png"}
                        alt='User Avatar'
                      />
                      <AvatarFallback>
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href='/admin'>Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {user.role === "employer" && (
                      <DropdownMenuItem asChild>
                        <Link href='/employer'>Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {user.role === "jobseeker" && (
                      <DropdownMenuItem asChild>
                        <Link href='/jobseeker'>Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3'>
            Find Your Dream Job
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Discover opportunities that match your skills and passion
          </p>
        </div>

        {/* Job Type Filter */}
        <div className='flex gap-2 mb-4 justify-center'>
          {["full-time", "part-time", "remote"].map((type) => (
            <Button
              key={type}
              variant={jobTypeFilter === type ? "default" : "outline"}
              onClick={() =>
                setJobTypeFilter((prev) =>
                  prev === type ? undefined : (type as any)
                )
              }>
              {type.replace("-", " ").toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Job List */}
        {jobsLoading ? (
          <div className='flex justify-center py-10'>
            <Loader2 className='h-6 w-6 animate-spin text-gray-600 dark:text-gray-400' />
          </div>
        ) : jobs.length === 0 ? (
          <p className='text-center text-gray-500 dark:text-gray-400'>
            No jobs found.
          </p>
        ) : (
          <div className='grid gap-4'>
            {jobs.map((job) => (
              <div
                key={job._id}
                className='border rounded p-4 bg-white dark:bg-gray-800 shadow-sm'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {job.title}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {job.company}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {job.jobType.toUpperCase()} | Applicants:{" "}
                  {job.applicantsCount}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                  {job.description}
                </p>
                <Link
                  href={`/jobs/${job._id}`}
                  className='text-primary mt-2 inline-block'>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !jobsLoading && (
          <div className='flex justify-center mt-6'>
            <Button onClick={handleLoadMore}>Load More</Button>
          </div>
        )}
      </main>
    </div>
  );
}
