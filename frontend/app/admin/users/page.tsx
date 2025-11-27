"use client";

import { approveEmployer } from "@/actions/admin/approve-employer"; // <- new
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState<
    "all" | "jobseeker" | "employer" | "admin"
  >("all");
  const [statusFilter, setStatusFilter] = useState<"all" | true | false>("all");

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers({
        page,
        limit: 10,
        search: search.trim(),
        role: roleFilter === "all" ? undefined : roleFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
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
  };

  // Fetch when page, search, role, or status changes
  useEffect(() => {
    const t = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(t);
  }, [page, search, roleFilter, statusFilter]);

  // Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      setSearch(searchText);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  const handleBlockToggle = async (user: User) => {
    setToggleLoading(user._id);
    try {
      const res = await toggleBlockUser(user._id);

      if (res.success && res.user) {
        toast.success(
          `${res.user.name} has been ${
            res.user.isBlocked ? "blocked" : "unblocked"
          }`
        );
        setUsers((prev) =>
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

  const handleApprove = async (id: string, name: string) => {
    setApprovingId(id);
    try {
      const res = await approveEmployer(id);

      if (res.success) {
        toast.success(`${name} approved successfully!`);

        // Remove approved employer from state
        setUsers((prev) => prev.filter((u) => u._id !== id));

        // Update pagination
        if (pagination) {
          setPagination((prev: any) => ({
            ...prev,
            total: prev.total - 1,
            totalPages: Math.ceil((prev.total - 1) / 10),
          }));
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-500 text-white";
      case "employer":
        return "bg-green-500 text-white";
      case "jobseeker":
        return "bg-gray-300 text-black";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <DashboardLayout userRole='admin'>
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>All Users</h1>

        {/* Filters */}
        <div className='flex flex-col md:flex-row gap-4 md:items-center md:justify-between'>
          <div className='relative w-full md:w-80'>
            <Input
              placeholder='Search users...'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className='pl-3'
            />
          </div>

          <div className='flex gap-4'>
            <Select
              value={roleFilter}
              onValueChange={(v) =>
                setRoleFilter(v as "all" | "jobseeker" | "employer" | "admin")
              }>
              <SelectTrigger>
                <SelectValue placeholder='Filter by role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Roles</SelectItem>
                <SelectItem value='jobseeker'>Job Seeker</SelectItem>
                <SelectItem value='employer'>Employer</SelectItem>
                <SelectItem value='admin'>Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={String(statusFilter)}
              onValueChange={(v) =>
                setStatusFilter(v === "all" ? "all" : v === "true")
              }>
              <SelectTrigger>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='false'>Active</SelectItem>
                <SelectItem value='true'>Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead className='text-right'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className='text-center py-10'>
                  <Loader2 className='h-6 w-6 animate-spin mx-auto' />
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className='text-center py-10'>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className='flex items-center gap-2'>
                    {user.role === "admin" ? (
                      <Shield className='h-4 w-4 text-blue-500' />
                    ) : (
                      <User className='h-4 w-4 text-gray-500' />
                    )}
                    {user.name}
                  </TableCell>

                  <TableCell>
                    <a
                      href={`mailto:${user.email}`}
                      className='hover:text-blue-600 flex items-center gap-1'>
                      <Mail className='h-4 w-4' />
                      {user.email}
                    </a>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded ${getRoleBadgeColor(
                        user.role
                      )}`}>
                      {user.role}
                    </span>
                  </TableCell>

                  <TableCell>{user.isBlocked ? "Blocked" : "Active"}</TableCell>

                  <TableCell>
                    {user.role === "employer"
                      ? user.isEmployerApproved
                        ? "Approved"
                        : "Pending"
                      : "-"}
                  </TableCell>

                  <TableCell className='text-right flex justify-end gap-2'>
                    {/* Block Toggle */}
                    {user.role !== "admin" && (
                      <Button
                        onClick={() => handleBlockToggle(user)}
                        disabled={toggleLoading === user._id}
                        variant={user.isBlocked ? "default" : "destructive"}>
                        {toggleLoading === user._id ? (
                          <>
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                            {user.isBlocked ? "Unblocking..." : "Blocking..."}
                          </>
                        ) : user.isBlocked ? (
                          "Unblock"
                        ) : (
                          "Block"
                        )}
                      </Button>
                    )}

                    {/* Approve button for employer */}
                    {user.role === "employer" && !user.isEmployerApproved && (
                      <Button
                        onClick={() => handleApprove(user._id, user.name)}
                        disabled={approvingId === user._id}
                        variant='default'>
                        {approvingId === user._id ? (
                          <>
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                            Approving...
                          </>
                        ) : (
                          "Approve"
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
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
              <strong>{users.length}</strong> of{" "}
              <strong>{pagination.total}</strong> users
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
