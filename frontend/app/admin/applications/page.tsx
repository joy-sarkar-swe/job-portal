"use client";

import { getAllApplications } from "@/actions/admin/get-all-applications";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Calendar,
  FileText,
  Mail,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  jobseeker: {
    _id: string;
    name: string;
    email: string;
  };
  approved: boolean;
  appliedAt: string;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const res = await getAllApplications({
      page,
      limit: 10,
      search: search.trim(),
    });

    if (res.success) {
      setApplications(res.applications || []);
      setPagination(res.pagination);
    } else {
      toast.error(res.message || "Failed to load applications");
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout userRole='admin'>
      <div className='space-y-8'>
        {/* Header */}
        <div>
          <h1 className='text-4xl font-bold text-gray-900'>Job Applications</h1>
          <p className='text-gray-600 mt-2'>
            View all applications submitted by job seekers
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col sm:flex-row gap-4 items-center'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  placeholder='Search by applicant name, job title, or company...'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className='pl-11 h-12'
                />
              </div>
              <div className='text-sm text-gray-600'>
                Total: <strong>{pagination?.total || 0}</strong> applications
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className='border shadow-sm'>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Applied For</TableHead>
                  <TableHead>Company & Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <div className='h-16 bg-gray-100 animate-pulse rounded' />
                        </TableCell>
                      </TableRow>
                    ))
                ) : applications.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='text-center py-16 text-gray-500'>
                      <FileText className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                      <p>No applications found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app._id} className='hover:bg-gray-50'>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold'>
                            {app.jobseeker.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className='font-medium text-gray-900'>
                              {app.jobseeker.name}
                            </p>
                            <a
                              href={`mailto:${app.jobseeker.email}`}
                              className='text-sm text-blue-600 hover:underline flex items-center gap-1'>
                              <Mail className='h-3 w-3' />
                              {app.jobseeker.email}
                            </a>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className='font-medium text-gray-900'>
                            {app.job.title}
                          </p>
                          <Link
                            href={`/jobs/${app.job._id}`}
                            className='text-sm text-blue-600 hover:underline'>
                            View Job →
                          </Link>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className='flex flex-col gap-1 text-sm'>
                          <div className='flex items-center gap-2 text-gray-700'>
                            <Building2 className='h-4 w-4' />
                            {app.job.company}
                          </div>
                          <div className='flex items-center gap-2 text-gray-600'>
                            <MapPin className='h-4 w-4' />
                            {app.job.location}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={app.approved ? "default" : "secondary"}
                          className={
                            app.approved
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }>
                          {app.approved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <Calendar className='h-4 w-4' />
                          {formatDate(app.appliedAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className='flex items-center justify-between'>
            <Button
              variant='outline'
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <p className='text-sm text-gray-600'>
              Page <strong>{page}</strong> of{" "}
              <strong>{pagination.totalPages}</strong>
            </p>
            <Button
              variant='outline'
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
