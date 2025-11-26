"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, Users, UserX } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  // Mock data - replace with actual API calls
  const stats = {
    pendingEmployers: 5,
    totalJobs: 127,
    totalApplications: 486,
    blockedUsers: 3,
  };

  const summaryCards = [
    {
      title: "Pending Employers",
      value: stats.pendingEmployers,
      icon: Users,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      href: "/admin/employers/pending",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      href: "/admin/jobs",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      href: "/admin/applications",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      href: "/admin/users",
    },
  ];

  return (
    <DashboardLayout userRole='admin'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Admin Dashboard
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mt-2'>
            System overview and management
          </p>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href}>
                <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                          {card.title}
                        </p>
                        <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
                          {card.value}
                        </p>
                      </div>
                      <div className={`${card.bgColor} p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className='mt-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Link href='/admin/employers/pending'>
              <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <Users className='h-5 w-5 text-yellow-600' />
                    <span className='font-medium text-gray-900 dark:text-white'>
                      Review Employers
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href='/admin/jobs'>
              <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <Briefcase className='h-5 w-5 text-blue-600' />
                    <span className='font-medium text-gray-900 dark:text-white'>
                      View All Jobs
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href='/admin/applications'>
              <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <FileText className='h-5 w-5 text-green-600' />
                    <span className='font-medium text-gray-900 dark:text-white'>
                      View Applications
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href='/admin/users'>
              <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <Users className='h-5 w-5 text-purple-600' />
                    <span className='font-medium text-gray-900 dark:text-white'>
                      Manage Users
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
