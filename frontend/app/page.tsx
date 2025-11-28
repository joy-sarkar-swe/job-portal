"use client";

import { logoutAction } from "@/actions/auth/logout";
import { getJobsForSeekerAction } from "@/actions/job/get-jobs-for-seeker";
import { getProfileAction } from "@/actions/profile/get-profile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Clock,
  Globe,
  MapPin,
  Sparkles,
} from "lucide-react";
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

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileAction();
        if (res.success && res.user) {
          setUser(res.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
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
      const res = await getJobsForSeekerAction(jobTypeFilter, cursor, "12");
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

  useEffect(() => {
    fetchJobs();
  }, [jobTypeFilter]);

  const handleLogout = async () => {
    await logoutAction();
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
  };

  const handleLoadMore = () => {
    if (hasMore && nextCursor) fetchJobs(nextCursor, true);
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Header */}
      <header className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-3 group'>
            <div className='p-3 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform'>
              <Briefcase className='h-8 w-8 text-white' />
            </div>
            <h1 className='text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              JobPortal
            </h1>
          </Link>

          <div className='flex items-center gap-4'>
            {!loading &&
              (!isAuthenticated ? (
                <div className='flex gap-3'>
                  <Button variant='ghost' size='lg' asChild>
                    <Link href='/login'>Sign In</Link>
                  </Button>
                  <Button size='lg' className='font-bold shadow-lg' asChild>
                    <Link href='/register'>
                      <Sparkles className='h-5 w-5 mr-2' />
                      Get Started Free
                    </Link>
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className='flex items-center justify-between gap-4 cursor-pointer'>
                      <Avatar className='h-10 w-10 ring-white'>
                        <AvatarFallback className='bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold'>
                          {user?.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='hidden sm:block font-medium'>
                        {user?.name}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href='/admin'>Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {user?.role === "employer" && (
                      <DropdownMenuItem asChild>
                        <Link href='/employer'>Employer Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {user?.role === "jobseeker" && (
                      <DropdownMenuItem asChild>
                        <Link href='/jobseeker'>My Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className='text-red-600'>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='pt-10 pb-32 px-6 text-center relative overflow-hidden'>
        <div className='mx-auto'>
          <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight'>
            Find Your Dream Job Today
          </h1>
          <p className='text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto'>
            Connect with top companies hiring for roles that match your skills
            and passion
          </p>
        </div>
        <div className='absolute inset-0 -z-10'>
          <div className='absolute top-20 left-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl' />
        </div>
      </section>

      {/* Job Type Filter — FIXED & BEAUTIFUL */}
      <div className='max-w-7xl mx-auto px-6 -mt-20 mb-16'>
        <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border border-gray-200 dark:border-gray-700'>
          <div className='flex flex-wrap justify-center gap-6'>
            {/* All Jobs */}
            <Button
              size='lg'
              variant={jobTypeFilter === undefined ? "default" : "outline"}
              className='font-bold text-lg px-10 py-7 gap-3 cursor-pointer'
              onClick={() => setJobTypeFilter(undefined)}>
              All Jobs
            </Button>

            {/* Full-Time */}
            <Button
              size='lg'
              variant={jobTypeFilter === "full-time" ? "default" : "outline"}
              className='font-bold text-lg px-10 py-7 gap-3 cursor-pointer'
              onClick={() =>
                setJobTypeFilter((prev) =>
                  prev === "full-time" ? undefined : "full-time"
                )
              }>
              <Building2 className='h-6 w-6' />
              Full-Time
            </Button>

            {/* Part-Time */}
            <Button
              size='lg'
              variant={jobTypeFilter === "part-time" ? "default" : "outline"}
              className='font-bold text-lg px-10 py-7 gap-3 cursor-pointer'
              onClick={() =>
                setJobTypeFilter((prev) =>
                  prev === "part-time" ? undefined : "part-time"
                )
              }>
              <Clock className='h-6 w-6' />
              Part-Time
            </Button>

            {/* Remote */}
            <Button
              size='lg'
              variant={jobTypeFilter === "remote" ? "default" : "outline"}
              className='font-bold text-lg px-10 py-7 gap-3 cursor-pointer'
              onClick={() =>
                setJobTypeFilter((prev) =>
                  prev === "remote" ? undefined : "remote"
                )
              }>
              <Globe className='h-6 w-6' />
              Remote
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <section className='max-w-7xl mx-auto px-6 pb-20'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Latest Job Opportunities
          </h2>
        </div>

        {/* Loading */}
        {jobsLoading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className='animate-pulse'>
                <CardContent className='p-8'>
                  <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='space-y-3'>
                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                    <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Jobs Grid */}
        {!jobsLoading && jobs.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {jobs.map((job) => (
              <Card
                key={job._id}
                className='group hover:shadow-2xl transition-all duration-300 border-0 shadow-xl overflow-hidden'>
                <CardContent className='p-8'>
                  <div className='flex items-start justify-between mb-6'>
                    <div className='flex items-center gap-4'>
                      <div className='w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl'>
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className='text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
                          {job.title}
                        </h3>
                        <p className='text-lg font-medium text-gray-700'>
                          {job.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4 text-gray-600 mb-8'>
                    <div className='flex items-center gap-3'>
                      <MapPin className='h-5 w-5 text-gray-500' />
                      <span>{job.location}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Clock className='h-5 w-5 text-gray-500' />
                      <Badge className='font-medium'>{job.jobType}</Badge>
                    </div>
                  </div>

                  <Button
                    asChild
                    className='w-full font-bold text-lg py-7 shadow-lg'>
                    <Link href={`/jobs/${job._id}`}>
                      View Details
                      <ArrowRight className='h-5 w-5 ml-2' />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !jobsLoading && (
          <div className='text-center mt-16'>
            <Button
              size='lg'
              variant='outline'
              onClick={handleLoadMore}
              className='font-bold px-12 py-7 cursor-pointer'>
              Load More Jobs
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!jobsLoading && jobs.length === 0 && (
          <div className='text-center py-20'>
            <Briefcase className='h-24 w-24 text-gray-300 mx-auto mb-8' />
            <h3 className='text-3xl font-bold text-gray-900 mb-4'>
              No jobs found
            </h3>
            <p className='text-xl text-gray-600'>Try adjusting your filters</p>
          </div>
        )}
      </section>
    </div>
  );
}
