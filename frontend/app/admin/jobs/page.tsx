"use client";

import { getAllJobsAction } from "@/actions/admin/get-all-jobs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryRange?: string;
  postedBy: string;
  postedAt: string;
}

export default function AllJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getAllJobsAction({
        search: searchQuery || undefined,
        jobType: typeFilter !== "all" ? typeFilter.toLowerCase() : undefined,
        limit: 10,
      });

      if (!res.success) {
        setError(res.message || "Failed to fetch jobs");
        setJobs([]);
      } else {
        const formattedJobs: Job[] = res.jobs.map((job: any) => ({
          _id: job._id,
          title: job.title,
          company: job.employer?.name || "Unknown Company",
          location: job.location || "Remote",
          jobType: capitalizeFirstLetter(job.jobType || "full-time"),
          salaryRange: job.salaryRange,
          postedBy: job.employer?.name || "Unknown",
          postedAt: job.createdAt,
        }));

        setJobs(formattedJobs);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, typeFilter]);

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30)
      return `${Math.floor(diffInDays / 7)} week${
        diffInDays >= 14 ? "s" : ""
      } ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout userRole='admin'>
      <div className='space-y-8 pb-10'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900'>All Jobs</h1>
            <p className='text-gray-500 mt-2'>
              Browse and monitor all job postings across the platform
            </p>
          </div>
          <Link href='/admin'>
            <Button variant='outline' size='lg' className='hidden sm:flex'>
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className='border-0 shadow-sm'>
          <CardContent className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center'>
              <div className='relative lg:col-span-7'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  placeholder='Search by job title, company, or location...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-12 h-12 text-base border-gray-300 focus:border-blue-500'
                />
              </div>

              <div className='lg:col-span-3'>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className='h-12'>
                    <SelectValue placeholder='Job Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Job Types</SelectItem>
                    <SelectItem value='full-time'>Full-time</SelectItem>
                    <SelectItem value='part-time'>Part-time</SelectItem>
                    <SelectItem value='remote'>Remote</SelectItem>
                    <SelectItem value='contract'>Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='lg:col-span-2'>
                <div className='text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3 text-center font-medium'>
                  {filteredJobs.length}{" "}
                  {filteredJobs.length === 1 ? "job" : "jobs"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className='animate-pulse'>
                <CardContent className='p-6'>
                  <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2 mb-6'></div>
                  <div className='flex gap-4'>
                    <div className='h-8 bg-gray-200 rounded-full w-24'></div>
                    <div className='h-8 bg-gray-200 rounded-full w-32'></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className='border-red-200 bg-red-50'>
            <CardContent className='p-8 text-center'>
              <div className='text-red-600 font-medium'>{error}</div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <Card className='border-dashed border-2'>
            <CardContent className='flex flex-col items-center justify-center py-20 text-center'>
              <div className='bg-gray-100 rounded-full p-6 mb-6'>
                <Briefcase className='h-16 w-16 text-gray-400' />
              </div>
              <h3 className='text-2xl font-semibold text-gray-900 mb-3'>
                No Jobs Found
              </h3>
              <p className='text-gray-500 max-w-md'>
                {searchQuery || typeFilter !== "all"
                  ? "Try adjusting your search or filters to see more results."
                  : "There are currently no job postings on the platform."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                className='hover:shadow-lg transition-all duration-300 border-0 shadow-md'>
                <CardContent className='p-6'>
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex-1'>
                      <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                        {job.title}
                      </h3>
                      <div className='flex items-center gap-2 text-lg text-gray-700'>
                        <Building2 className='h-5 w-5 text-gray-500' />
                        <span className='font-medium'>{job.company}</span>
                      </div>
                    </div>
                    <Badge
                      variant='outline'
                      className={`text-sm font-medium px-3 py-1 border ${
                        job.jobType === "Full-time"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : job.jobType === "Part-time"
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : job.jobType === "Remote"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}>
                      {job.jobType}
                    </Badge>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm'>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <MapPin className='h-4 w-4 text-gray-500' />
                      <span>{job.location}</span>
                    </div>
                    {job.salaryRange && (
                      <div className='flex items-center gap-2 text-gray-600'>
                        <DollarSign className='h-4 w-4 text-green-600' />
                        <span className='font-medium'>{job.salaryRange}</span>
                      </div>
                    )}
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Calendar className='h-4 w-4 text-gray-500' />
                      <span>{formatDate(job.postedAt)}</span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                    <div className='text-sm text-gray-500'>
                      Posted by{" "}
                      <span className='font-medium text-gray-700'>
                        {job.postedBy}
                      </span>
                    </div>
                    <Link href={`/jobs/${job._id}`}>
                      <Button size='sm' className='font-medium cursor-pointer'>
                        View Details →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
