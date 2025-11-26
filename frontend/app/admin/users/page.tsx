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
import { Loader2, Mail, Search, Shield, User, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "jobseeker" | "employer" | "admin";
  isBlocked: boolean;
  joinedAt: string;
}

export default function ManageUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toggleLoading, setToggleLoading] = useState<number | null>(null);

  // Mock data - replace with actual API call
  const [users, setUsers] = useState<UserData[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "jobseeker",
      isBlocked: false,
      joinedAt: "2025-10-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@techcorp.com",
      role: "employer",
      isBlocked: false,
      joinedAt: "2025-10-20",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "jobseeker",
      isBlocked: true,
      joinedAt: "2025-11-01",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@startup.io",
      role: "employer",
      isBlocked: false,
      joinedAt: "2025-11-05",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "jobseeker",
      isBlocked: false,
      joinedAt: "2025-11-10",
    },
    {
      id: 6,
      name: "Diana Martinez",
      email: "diana@digital.com",
      role: "employer",
      isBlocked: true,
      joinedAt: "2025-11-12",
    },
    {
      id: 7,
      name: "Admin User",
      email: "admin@jobportal.com",
      role: "admin",
      isBlocked: false,
      joinedAt: "2025-09-01",
    },
  ]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.isBlocked) ||
      (statusFilter === "blocked" && user.isBlocked);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleBlock = async (userId: number) => {
    setToggleLoading(userId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
    setToggleLoading(null);
  };

  const getRoleBadgeVariant = (
    role: string
  ): "default" | "secondary" | "outline" => {
    switch (role) {
      case "admin":
        return "default";
      case "employer":
        return "secondary";
      case "jobseeker":
        return "outline";
      default:
        return "outline";
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
              Manage Users
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-2'>
              View and manage all platform users
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
                  placeholder='Search users...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='blocked'>Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Count */}
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          Showing {filteredUsers.length} of {users.length} users
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Users className='h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                No Users Found
              </h3>
              <p className='text-gray-500 dark:text-gray-400 text-center'>
                Try adjusting your filters to see more results.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className='p-6'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <div className='flex-1 space-y-3'>
                      <div className='flex items-start gap-3'>
                        <div className='bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg'>
                          {user.role === "admin" ? (
                            <Shield className='h-5 w-5 text-blue-600' />
                          ) : (
                            <User className='h-5 w-5 text-blue-600' />
                          )}
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-2'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                              {user.name}
                            </h3>
                            {user.isBlocked && (
                              <Badge variant='destructive'>Blocked</Badge>
                            )}
                          </div>
                          <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2'>
                            <Mail className='h-4 w-4' />
                            <a
                              href={`mailto:${user.email}`}
                              className='hover:text-blue-600 dark:hover:text-blue-400'>
                              {user.email}
                            </a>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role}
                            </Badge>
                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                              Joined {formatDate(user.joinedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='sm:min-w-32'>
                      {user.role !== "admin" && (
                        <Button
                          onClick={() => handleToggleBlock(user.id)}
                          disabled={toggleLoading === user.id}
                          variant={user.isBlocked ? "default" : "destructive"}
                          className='w-full sm:w-auto'>
                          {toggleLoading === user.id ? (
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
