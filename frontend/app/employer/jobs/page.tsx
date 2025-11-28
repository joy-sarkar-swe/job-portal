"use client";

import { deleteJobAction } from "@/actions/job/delete-job";
import { getJobsAction, Job } from "@/actions/job/get-job";
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
  Edit,
  Eye,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EmployerJob extends Job {
  status: "active" | "closed";
  createdAt: string;
  applicantsCount?: number;
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "full-time" | "part-time" | "remote" | ""
  >("");

  const fetchJobs = async (cursor?: string) => {
    setLoading(true);
    try {
      const res = await getJobsAction(
        undefined,
        typeFilter || undefined,
        cursor,
        "12",
        searchQuery || undefined
      );

      if (!res.success || !res.jobs) {
        toast.error(res.message || "Failed to load jobs");
        setLoading(false);
        return;
      }

      const mappedJobs: EmployerJob[] = res.jobs.map((job: any) => ({
        ...job,
        status: job.status || "active",
        createdAt: job.createdAt || new Date().toISOString(),
        applicantsCount: job.applicantsCount || 0,
      }));

      setJobs((prev) => (cursor ? [...prev, ...mappedJobs] : mappedJobs));
      setNextCursor(res.nextCursor || null);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, typeFilter]);

  const handleDelete = async (jobId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this job posting? This cannot be undone."
      )
    )
      return;

    setDeletingId(jobId);
    const previousJobs = [...jobs];

    // Optimistic UI
    setJobs((prev) => prev.filter((j) => j._id !== jobId));

    const result = await deleteJobAction(jobId);
    if (!result.success) {
      toast.error(result.message || "Failed to delete job");
      setJobs(previousJobs);
    } else {
      toast.success("Job deleted successfully");
    }
    setDeletingId(null);
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "part-time":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "remote":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30)
      return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout userRole='employer'>
      <div className='space-y-10 pb-12'>
        {/* Hero Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900'>
              My Job Postings
            </h1>
            <p className='text-lg text-gray-600 mt-2'>
              Manage, track, and grow your hiring pipeline
            </p>
          </div>
          <Button size='lg' className='shadow-lg font-semibold' asChild>
            <Link href='/employer/jobs/create'>
              <Plus className='h-5 w-5 mr-2' />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className='border-0 shadow-sm'>
          <CardContent className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  placeholder='Search your jobs...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-11 h-12'
                />
              </div>
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as any)}>
                <SelectTrigger className='h-12'>
                  <SelectValue placeholder='Choose job type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='full-time'>Full-time</SelectItem>
                  <SelectItem value='part-time'>Part-time</SelectItem>
                  <SelectItem value='remote'>Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className='text-sm text-gray-600'>
          Showing <strong>{jobs.length}</strong> job{jobs.length !== 1 && "s"}
        </div>

        {/* Loading State */}
        {loading && jobs.length === 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className='animate-pulse'>
                <CardContent className='p-6'>
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
        {jobs.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
            {jobs.map((job) => (
              <Card
                key={job._id}
                className='group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden'>
                <CardContent className='p-6'>
                  <div className='flex justify-between items-start mb-4'>
                    <Badge
                      className={`font-medium ${getJobTypeColor(job.jobType)}`}>
                      {job.jobType.replace("-", " ")}
                    </Badge>
                  </div>

                  <h3 className='text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors'>
                    {job.title}
                  </h3>

                  <div className='space-y-3 text-sm text-gray-600 mb-6'>
                    <div className='flex items-center gap-2'>
                      <Building2 className='h-4 w-4' />
                      <span className='font-medium'>{job.company}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      <span>{job.location}</span>
                    </div>
                    {job.salaryRange && (
                      <div className='flex items-center gap-2'>
                        <DollarSign className='h-4 w-4 text-green-600' />
                        <span className='font-medium'>{job.salaryRange}</span>
                      </div>
                    )}
                    <div className='flex items-center gap-2 text-gray-500'>
                      <Calendar className='h-4 w-4' />
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-3'>
                    <Button
                      asChild
                      className='flex-1 font-medium cursor-pointer'
                      size='sm'>
                      <Link href={`/employer/jobs/${job._id}/applicants`}>
                        <Eye className='h-4 w-4 mr-2' />
                        View Applicants
                      </Link>
                    </Button>

                    <Button
                      variant='outline'
                      size='sm'
                      asChild
                      className='cursor-pointer'>
                      <Link href={`/employer/jobs/${job._id}/edit`}>
                        <Edit className='h-4 w-4' />
                      </Link>
                    </Button>

                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDelete(job._id)}
                      disabled={deletingId === job._id}
                      className='text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {nextCursor && (
          <div className='flex justify-center mt-8'>
            <Button
              className='cursor-pointer'
              variant='outline'
              size='lg'
              onClick={() => fetchJobs(nextCursor)}
              disabled={loading}>
              {loading ? "Loading..." : "Load More Jobs"}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <Card className='border-dashed border-2'>
            <CardContent className='flex flex-col items-center justify-center py-20 text-center'>
              <div className='bg-gray-100 rounded-full p-8 mb-6'>
                <Briefcase className='h-16 w-16 text-gray-400' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                No Jobs Posted Yet
              </h3>
              <p className='text-gray-600 max-w-md mb-8'>
                Start attracting top talent by posting your first job opening
                today.
              </p>
              <Button size='lg' asChild>
                <Link href='/employer/jobs/create'>
                  <Plus className='h-5 w-5 mr-2' />
                  Post Your First Job
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
