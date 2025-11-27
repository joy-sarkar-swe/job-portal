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
import {
  Briefcase,
  Calendar,
  FileText,
  Mail,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Application {
  id: number;
  jobTitle: string;
  jobId: number;
  company: string;
  applicantName: string;
  applicantEmail: string;
  appliedAt: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
}

export default function AllApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data - replace with actual API call
  const [allApplications] = useState<Application[]>([
    {
      id: 1,
      jobTitle: "Senior Frontend Developer",
      jobId: 1,
      company: "Tech Corp",
      applicantName: "John Doe",
      applicantEmail: "john.doe@example.com",
      appliedAt: "2025-11-20",
      status: "pending",
    },
    {
      id: 2,
      jobTitle: "Backend Engineer",
      jobId: 2,
      company: "StartUp Inc",
      applicantName: "Jane Smith",
      applicantEmail: "jane.smith@example.com",
      appliedAt: "2025-11-21",
      status: "reviewed",
    },
    {
      id: 3,
      jobTitle: "Full Stack Developer",
      jobId: 3,
      company: "Digital Solutions",
      applicantName: "Bob Johnson",
      applicantEmail: "bob.j@example.com",
      appliedAt: "2025-11-22",
      status: "accepted",
    },
    {
      id: 4,
      jobTitle: "UI/UX Designer",
      jobId: 4,
      company: "Creative Agency",
      applicantName: "Alice Brown",
      applicantEmail: "alice.b@example.com",
      appliedAt: "2025-11-23",
      status: "pending",
    },
    {
      id: 5,
      jobTitle: "DevOps Engineer",
      jobId: 5,
      company: "Cloud Systems",
      applicantName: "Charlie Wilson",
      applicantEmail: "charlie.w@example.com",
      appliedAt: "2025-11-24",
      status: "rejected",
    },
    {
      id: 6,
      jobTitle: "Product Manager",
      jobId: 6,
      company: "Innovation Labs",
      applicantName: "Diana Martinez",
      applicantEmail: "diana.m@example.com",
      appliedAt: "2025-11-25",
      status: "pending",
    },
    {
      id: 7,
      jobTitle: "Data Scientist",
      jobId: 7,
      company: "Data Dynamics",
      applicantName: "Eve Taylor",
      applicantEmail: "eve.t@example.com",
      appliedAt: "2025-11-26",
      status: "reviewed",
    },
  ]);

  // Filter applications
  const filteredApplications = allApplications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              All Applications
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-2'>
              Read-only view of all job applications
            </p>
          </div>
          <Link href='/admin'>
            <Button variant='outline'>← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className='p-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search applications...'
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
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='reviewed'>Reviewed</SelectItem>
                  <SelectItem value='accepted'>Accepted</SelectItem>
                  <SelectItem value='rejected'>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Count */}
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          Showing {filteredApplications.length} of {allApplications.length}{" "}
          applications
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <FileText className='h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                No Applications Found
              </h3>
              <p className='text-gray-500 dark:text-gray-400 text-center'>
                Try adjusting your filters to see more results.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {filteredApplications.map((app) => (
              <Card key={app.id}>
                <CardContent className='p-6'>
                  <div className='space-y-4'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-3'>
                          <Badge variant='secondary'>{app.status}</Badge>
                        </div>
                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                          {app.jobTitle}
                        </h3>
                        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3'>
                          <Briefcase className='h-4 w-4' />
                          <span>{app.company}</span>
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                          Applicant Information
                        </h4>
                        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                          <User className='h-4 w-4' />
                          <span>{app.applicantName}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                          <Mail className='h-4 w-4' />
                          <a
                            href={`mailto:${app.applicantEmail}`}
                            className='hover:text-blue-600 dark:hover:text-blue-400'>
                            {app.applicantEmail}
                          </a>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                          Application Details
                        </h4>
                        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                          <Calendar className='h-4 w-4' />
                          <span>Applied on {formatDate(app.appliedAt)}</span>
                        </div>
                        <div className='pt-2'>
                          <Link href={`/jobs/${app.jobId}`}>
                            <Button variant='outline' size='sm'>
                              View Job Post
                            </Button>
                          </Link>
                        </div>
                      </div>
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
