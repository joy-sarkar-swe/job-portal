"use client";

import { getAdminOverview } from "@/actions/admin/admin-overview";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, Users, UserX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
    blockedUsers: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setIsLoading(true);

      try {
        const result = await getAdminOverview();

        if (result.success && result.overview) {
          setStats({
            pendingEmployers: result.overview.pendingEmployersCount,
            totalJobs: result.overview.totalJobsCount,
            totalApplications: result.overview.totalApplicationsCount,
            blockedUsers: result.overview.blockedUsersCount,
          });
        } else {
          setError(result.message || "Failed to fetch admin overview");
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const summaryCards = [
    {
      title: "Pending Employers",
      key: "pendingEmployers",
      icon: Users,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      href: "/admin/employers/pending",
    },
    {
      title: "Total Jobs",
      key: "totalJobs",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      href: "/admin/jobs",
    },
    {
      title: "Total Applications",
      key: "totalApplications",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      href: "/admin/applications",
    },
    {
      title: "Blocked Users",
      key: "blockedUsers",
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

        {/* Loading UI */}
        {isLoading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse'>
            {summaryCards.map((card) => (
              <Card key={card.title}>
                <CardContent className='p-6 space-y-4'>
                  <div className='h-4 bg-gray-300 dark:bg-gray-700 w-1/2 rounded'></div>
                  <div className='h-8 bg-gray-300 dark:bg-gray-700 w-1/3 rounded'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error UI */}
        {!isLoading && error && (
          <div className='p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded'>
            <p className='text-red-700 dark:text-red-400 font-semibold'>
              {error}
            </p>
          </div>
        )}

        {/* Summary Cards */}
        {!isLoading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {summaryCards.map((card) => {
              const Icon = card.icon;
              const value = stats[card.key as keyof typeof stats];

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
                            {value}
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
        )}

        {/* Quick Actions */}
        {!isLoading && !error && (
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
        )}
      </div>
    </DashboardLayout>
  );
}
