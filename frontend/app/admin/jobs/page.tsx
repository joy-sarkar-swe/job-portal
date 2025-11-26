"use client";

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
import { generateMockJobs } from "@/lib/mockData";
import { Briefcase, Building2, DollarSign, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryRange?: string;
  postedBy: string;
  postedAt: string;
  status: "active" | "closed";
}

export default function AllJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Mock data - replace with actual API call
  const mockJobs = generateMockJobs(15, 0);
  const [allJobs] = useState<Job[]>(
    mockJobs.map((job, index) => ({
      ...job,
      postedBy:
        index % 3 === 0
          ? "Tech Corp"
          : index % 3 === 1
          ? "StartUp Inc"
          : "Digital Solutions",
      postedAt: new Date(2025, 10, 15 + index).toISOString().split("T")[0],
      status: index % 5 === 0 ? "closed" : "active",
    }))
  );

  // Filter jobs
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesType = typeFilter === "all" || job.jobType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    return status === "active" ? "default" : "secondary";
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "default";
      case "Remote":
        return "secondary";
      case "Part-time":
        return "outline";
      case "Contract":
        return "destructive";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout userRole='admin'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              All Jobs
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-2'>
              Read-only view of all job postings
            </p>
          </div>
          <Link href='/admin'>
            <Button variant='outline'>← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className='p-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search jobs...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='closed'>Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='Filter by type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  <SelectItem value='Full-time'>Full-time</SelectItem>
                  <SelectItem value='Part-time'>Part-time</SelectItem>
                  <SelectItem value='Remote'>Remote</SelectItem>
                  <SelectItem value='Contract'>Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Count */}
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          Showing {filteredJobs.length} of {allJobs.length} jobs
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Briefcase className='h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                No Jobs Found
              </h3>
              <p className='text-gray-500 dark:text-gray-400 text-center'>
                Try adjusting your filters to see more results.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {filteredJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className='p-6'>
                  <div className='flex flex-col gap-4'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Badge variant={getJobTypeColor(job.jobType)}>
                            {job.jobType}
                          </Badge>
                          <Badge variant={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                          {job.title}
                        </h3>
                        <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                          <div className='flex items-center gap-1'>
                            <Building2 className='h-4 w-4' />
                            <span>{job.company}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <MapPin className='h-4 w-4' />
                            <span>{job.location}</span>
                          </div>
                          {job.salaryRange && (
                            <div className='flex items-center gap-1'>
                              <DollarSign className='h-4 w-4' />
                              <span>{job.salaryRange}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700'>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        Posted by{" "}
                        <span className='font-medium'>{job.postedBy}</span> on{" "}
                        {formatDate(job.postedAt)}
                      </div>
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant='outline' size='sm'>
                          View Details
                        </Button>
                      </Link>
                    </div>
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
