"use client";

import { approveEmployer } from "@/actions/admin/approve-employer";
import { getPendingEmployers } from "@/actions/admin/get-pending-employers";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";

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
  const fetchData = async () => {
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
  };

  // Fetch data when page or search changes
  useEffect(() => {
    const t = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(t);
  }, [page, search]);

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

        // Remove approved employer from state
        setData((prev) => prev.filter((emp) => emp._id !== id));

        // Update pagination total
        setPagination((prev: any) => {
          if (!prev) return prev;
          const newTotal = prev.total - 1;
          const newTotalPages = Math.ceil(newTotal / 10);
          return {
            ...prev,
            total: newTotal,
            totalPages: newTotalPages,
            page: page > newTotalPages ? newTotalPages : page,
          };
        });
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
          prev.map((u) => (u._id === res.user!._id ? res.user! : u))
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

        {/* SEARCH BAR & TOTAL COUNT */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='relative w-full md:w-80'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-500' />
            <input
              type='text'
              placeholder='Search employers...'
              className='w-full pl-10 pr-3 py-2 border rounded-md'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <p className='text-gray-600 text-sm'>
            Total: {pagination?.total || 0} pending employers
          </p>
        </div>

        {/* TABLE */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Is Blocked</TableHead>
              <TableHead className='text-right'>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-10'>
                  <Loader2 className='h-6 w-6 animate-spin mx-auto' />
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-10'>
                  No pending employers
                </TableCell>
              </TableRow>
            ) : (
              data.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell className='font-medium flex items-center gap-2'>
                    <User className='h-4 w-4 text-blue-600' />
                    {emp.name}
                  </TableCell>

                  <TableCell>
                    <a
                      href={`mailto:${emp.email}`}
                      className='flex items-center gap-2 hover:text-blue-600'>
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
                      className='cursor-pointer'
                      disabled={
                        emp.isEmployerApproved || approvingId === emp._id
                      }
                      onClick={() => handleApprove(emp._id, emp.name)}>
                      {approvingId === emp._id ? (
                        <>
                          <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className='h-4 w-4 mr-2' />
                          Click To Approve
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        {pagination && pagination.totalPages > 1 && (
          <div className='flex items-center justify-between mt-4'>
            <Button
              variant='outline'
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>

            <p>
              Page {pagination.page} of {pagination.totalPages} — Showing{" "}
              <strong>{data.length}</strong> out of{" "}
              <strong>{pagination.total}</strong>
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
