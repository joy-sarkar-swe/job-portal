"use client";

import { approveEmployer } from "@/actions/admin/approve-employer";
import { getPendingEmployers } from "@/actions/admin/get-pending-employers";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

import { toggleBlockUser } from "@/actions/admin/toggle-block-user";
import { CheckCircle, Loader2, Mail, Search, User } from "lucide-react";

interface Employer {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isEmployerApproved: boolean;
}

export default function PendingEmployersPage() {
  const [data, setData] = useState<Employer[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  // Fetch pending employers
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPendingEmployers({
        page,
        limit: 10,
        search: search.trim(),
      });

      if (res.success) {
        setData(res.users || []);
        setPagination(res.pagination);
      } else {
        toast.error(res.message || "Failed to fetch employers");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching employers");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      setSearch(searchText);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  // Approve employer
  const handleApprove = async (id: string, name: string) => {
    setApprovingId(id);
    try {
      const res = await approveEmployer(id);

      if (res.success) {
        toast.success(`${name} approved successfully!`);

        const previousPage = page;
        const hadDataBefore = data.length > 0;

        await fetchData();

        if (data.length === 0 && hadDataBefore && previousPage > 1) {
          setPage(previousPage - 1);
        }
      } else {
        toast.error(res.message || "Failed to approve employer");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while approving employer");
    } finally {
      setApprovingId(null);
    }
  };

  // Toggle block/unblock
  const handleBlockToggle = async (emp: Employer) => {
    setToggleLoading(emp._id);
    try {
      const res = await toggleBlockUser(emp._id);

      if (res.success && res.user) {
        toast.success(
          `${emp.name} has been ${res.user.isBlocked ? "blocked" : "unblocked"}`
        );

        setData((prev) =>
          prev.map((u) => {
            if (u._id === emp._id) {
              return { ...u, isBlocked: res.user!.isBlocked };
            }
            return u;
          })
        );
      } else {
        toast.error(res.message || "Failed to toggle block status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while toggling block status");
    } finally {
      setToggleLoading(null);
    }
  };

  return (
    <DashboardLayout userRole='admin'>
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>Pending Employers</h1>

        {/* search bar and total count */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='relative w-full md:w-80'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-500' />
            <input
              type='text'
              placeholder='Search employers...'
              className='w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <p className='text-gray-600 text-sm'>
            Total: <strong>{pagination?.total ?? 0}</strong> pending employer
            {pagination?.total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* table */}
        <div className='border rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className='text-center'>Blocked</TableHead>
                <TableHead className='text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className='text-center py-12'>
                    <Loader2 className='h-8 w-8 animate-spin mx-auto text-blue-600' />
                    <p className='mt-2 text-gray-500'>
                      Loading pending employers...
                    </p>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='text-center py-12 text-gray-500'>
                    {search
                      ? `No employers found matching "${search}"`
                      : "No pending employers at the moment"}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((emp) => (
                  <TableRow key={emp._id} className='hover:bg-gray-50'>
                    <TableCell className='font-medium flex items-center gap-2'>
                      <User className='h-4 w-4 text-blue-600' />
                      {emp.name}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${emp.email}`}
                        className='flex items-center gap-2 text-blue-600 hover:underline'>
                        <Mail className='h-4 w-4' />
                        {emp.email}
                      </a>
                    </TableCell>

                    <TableCell className='text-center'>
                      <Switch
                        className='cursor-pointer'
                        checked={emp.isBlocked}
                        disabled={toggleLoading === emp._id}
                        onCheckedChange={() => handleBlockToggle(emp)}
                      />
                    </TableCell>

                    <TableCell className='text-right'>
                      <Button
                        size='sm'
                        disabled={approvingId === emp._id}
                        onClick={() => handleApprove(emp._id, emp.name)}
                        className='min-w-32 cursor-pointer '>
                        {approvingId === emp._id ? (
                          <>
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className='h-4 w-4 mr-2' />
                            Approve
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className='flex items-center justify-between mt-6'>
            <Button
              variant='outline'
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>

            <p className='text-sm text-gray-600'>
              Page <strong>{page}</strong> of{" "}
              <strong>{pagination.totalPages}</strong> — Showing{" "}
              <strong>{data.length}</strong> of{" "}
              <strong>{pagination.total}</strong> employers
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
