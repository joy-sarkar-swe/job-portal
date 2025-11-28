"use client";

import { approveEmployer } from "@/actions/admin/approve-employer";
import { getAllUsers } from "@/actions/admin/get-all-users";
import { toggleBlockUser } from "@/actions/admin/toggle-block-user";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, Search, Shield, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isEmployerApproved?: boolean;
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "jobseeker" | "employer" | "admin"
  >("all");

  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsers({
        page,
        limit: 10,
        search: search.trim(),
        role: roleFilter === "all" ? undefined : roleFilter,
      });

      if (res.success) {
        setUsers(res.users || []);
        setPagination(res.pagination);
      } else {
        toast.error(res.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching users");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      setSearch(searchText);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  // Toggle block/unblock
  const handleBlockToggle = async (user: User) => {
    if (user.role === "admin") return;

    setToggleLoading(user._id);
    try {
      const res = await toggleBlockUser(user._id);

      if (res.success) {
        toast.success(
          `${user.name} has been ${!user.isBlocked ? "blocked" : "unblocked"}`
        );

        setUsers((prev) =>
          prev.map((u) => {
            if (u._id === user._id) {
              return { ...u, isBlocked: !u.isBlocked };
            }
            return u;
          })
        );
      } else {
        toast.error(res.message || "Failed to update block status");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setToggleLoading(null);
    }
  };

  // Approve employer → refetch for consistency
  const handleApprove = async (id: string, name: string) => {
    setApprovingId(id);
    try {
      const res = await approveEmployer(id);

      if (res.success) {
        toast.success(`${name} approved successfully!`);

        const hadDataBefore = users.length > 0;
        const previousPage = page;

        await fetchUsers(); // Refetch to stay in sync with backend

        // If current page became empty after approval, go back
        if (users.length === 0 && hadDataBefore && previousPage > 1) {
          setPage(previousPage - 1);
        }
      } else {
        toast.error(res.message || "Failed to approve employer");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while approving");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <DashboardLayout userRole='admin'>
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>All Users</h1>

        {/* Filters */}
        <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
          {/* Search */}
          <div className='relative w-full md:w-80'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-gray-500' />
            <Input
              placeholder='Search by name or email...'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className='pl-10'
            />
          </div>

          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(v) => {
              setRoleFilter(v as any);
              setPage(1);
            }}>
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='Filter by role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              <SelectItem value='jobseeker'>Job Seeker</SelectItem>
              <SelectItem value='employer'>Employer</SelectItem>
              <SelectItem value='admin'>Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Total Count */}
        <p className='text-sm text-gray-600'>
          Showing <strong>{users.length}</strong> of{" "}
          <strong>{pagination?.total ?? 0}</strong> users
        </p>

        {/* Table */}
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className='text-center'>Blocked</TableHead>
                <TableHead>Employer Status</TableHead>
                <TableHead className='text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-16'>
                    <Loader2 className='h-8 w-8 animate-spin mx-auto text-blue-600' />
                    <p className='mt-3 text-gray-500'>Loading users...</p>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-center py-16 text-gray-500'>
                    {search || roleFilter !== "all"
                      ? "No users found matching your filters"
                      : "No users in the system yet"}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id} className='hover:bg-gray-50'>
                    <TableCell className='font-medium flex items-center gap-2'>
                      {user.role === "admin" ? (
                        <Shield className='h-5 w-5 text-purple-600' />
                      ) : (
                        <User className='h-5 w-5 text-gray-600' />
                      )}
                      {user.name}
                    </TableCell>

                    <TableCell>
                      <a
                        href={`mailto:${user.email}`}
                        className='text-blue-600 hover:underline flex items-center gap-2'>
                        <Mail className='h-4 w-4' />
                        {user.email}
                      </a>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "employer"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </TableCell>

                    <TableCell className='text-center'>
                      <Switch
                        className='cursor-pointer'
                        checked={user.isBlocked}
                        disabled={
                          toggleLoading === user._id || user.role === "admin"
                        }
                        onCheckedChange={() => handleBlockToggle(user)}
                      />
                    </TableCell>

                    <TableCell>
                      {user.role === "employer" ? (
                        user.isEmployerApproved ? (
                          <span className='text-green-600 font-medium'>
                            Approved
                          </span>
                        ) : (
                          <span className='text-orange-600 font-medium'>
                            Pending
                          </span>
                        )
                      ) : (
                        <span className='text-gray-400'>—</span>
                      )}
                    </TableCell>

                    <TableCell className='text-right'>
                      {user.role === "employer" && !user.isEmployerApproved && (
                        <Button
                          className='cursor-pointer'
                          size='sm'
                          onClick={() => handleApprove(user._id, user.name)}
                          disabled={approvingId === user._id}>
                          {approvingId === user._id ? (
                            <>
                              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                              Approving...
                            </>
                          ) : (
                            "Approve Employer"
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
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
