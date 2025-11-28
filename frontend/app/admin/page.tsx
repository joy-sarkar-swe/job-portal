"use client";

import { getAdminOverview } from "@/actions/admin/admin-overview";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  FileText,
  ShieldCheck,
  Users,
  UserX,
} from "lucide-react";
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
          setError(result.message || "Failed to fetch dashboard data");
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const statCards = [
    {
      title: "Pending Employers",
      value: stats.pendingEmployers,
      icon: Users,
      color: "text-amber-600",
      bgGradient:
        "from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      href: "/admin/employers/pending",
      badge: stats.pendingEmployers > 0 ? "warning" : "default",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "text-blue-600",
      bgGradient:
        "from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      href: "/admin/jobs",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-emerald-600",
      bgGradient:
        "from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      href: "/admin/applications",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserX,
      color: "text-red-600",
      bgGradient:
        "from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      href: "/admin/users",
    },
  ];

  const quickActions = [
    {
      title: "Review Pending Employers",
      icon: ShieldCheck,
      href: "/admin/employers/pending",
      color: "text-amber-600",
    },
    {
      title: "View All Jobs",
      icon: Briefcase,
      href: "/admin/jobs",
      color: "text-blue-600",
    },
    {
      title: "Manage All Users",
      icon: Users,
      href: "/admin/users",
      color: "text-purple-600",
    },
    {
      title: "View Applications",
      icon: FileText,
      href: "/admin/applications",
      color: "text-emerald-600",
    },
  ];

  return (
    <DashboardLayout userRole='admin'>
      <div className='space-y-10 pb-12'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900'>
              Admin Dashboard
            </h1>
            <p className='text-lg text-gray-600 mt-2'>
              Welcome back! Here's your platform overview.
            </p>
          </div>
          <div className='text-sm text-gray-500'>
            Last updated: {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className='border-red-200 bg-red-50 dark:bg-red-900/20'>
            <CardContent className='p-6 text-center'>
              <p className='text-red-700 dark:text-red-400 font-medium'>
                {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href}>
                <Card
                  className={`group relative overflow-hidden border-2 ${card.borderColor} hover:shadow-xl transition-all duration-300  cursor-pointer`}>
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${card.bgGradient} opacity-70`}
                  />
                  <CardContent className='relative p-6 z-10'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='p-3 rounded-xl bg-white/70 dark:bg-gray-800/70 shadow-sm'>
                        <Icon className={`h-7 w-7 ${card.color}`} />
                      </div>
                      {card.title === "Pending Employers" &&
                        stats.pendingEmployers > 0 && (
                          <span className='px-2 py-1 text-xs font-bold text-amber-700 bg-amber-100 rounded-full animate-pulse'>
                            Action Needed
                          </span>
                        )}
                    </div>

                    <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                      {card.title}
                    </p>
                    <div className='flex items-baseline gap-2 mt-2'>
                      <p className='text-4xl font-bold text-gray-900 dark:text-white'>
                        {isLoading ? "—" : card.value.toLocaleString()}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <span>View details</span>
                      <ArrowRight className='h-4 w-4' />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Card className='hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700'>
                    <CardContent className='p-5'>
                      <div className='flex items-center gap-4'>
                        <div
                          className={`p-3 rounded-lg bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900`}>
                          <Icon className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <div>
                          <p className='font-semibold text-gray-900 dark:text-white'>
                            {action.title}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            Go to section
                          </p>
                        </div>
                        <ArrowRight className='ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors' />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className='text-center text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800'>
          <p>
            You are logged in as{" "}
            <span className='font-medium text-gray-700 dark:text-gray-300'>
              Administrator
            </span>{" "}
            • All actions are logged
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
