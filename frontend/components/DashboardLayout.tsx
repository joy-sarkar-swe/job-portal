"use client";

import { logoutAction } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  ChevronRight,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "jobseeker" | "employer" | "admin";
  isEmployerApproved?: boolean;
}

const jobSeekerNav = [
  { title: "Dashboard", href: "/jobseeker", icon: LayoutDashboard },
  { title: "My Profile", href: "/jobseeker/profile", icon: User },
  { title: "Applied Jobs", href: "/jobseeker/applied-jobs", icon: FileText },
];

const employerNav = [
  { title: "Dashboard", href: "/employer", icon: LayoutDashboard },
  { title: "Post New Job", href: "/employer/jobs/create", icon: Briefcase },
  { title: "My Jobs", href: "/employer/jobs", icon: FileText },
];

const adminNav = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    title: "Pending Employers",
    href: "/admin/employers/pending",
    icon: Shield,
  },
  { title: "All Jobs", href: "/admin/jobs", icon: Briefcase },
  { title: "Manage Users", href: "/admin/users", icon: Users },
];

export function DashboardLayout({
  children,
  userRole,
  isEmployerApproved,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getNavigation = () => {
    if (userRole === "employer" && isEmployerApproved === false) {
      return employerNav.filter((item) => item.href === "/employer");
    }
    return userRole === "jobseeker"
      ? jobSeekerNav
      : userRole === "employer"
      ? employerNav
      : adminNav;
  };

  const navigation = getNavigation();

  const roleConfig = {
    jobseeker: {
      name: "Job Seeker",
      color: "from-emerald-500 to-teal-600",
      icon: User,
    },
    employer: {
      name: "Employer",
      color: "from-blue-500 to-indigo-600",
      icon: Briefcase,
    },
    admin: {
      name: "Administrator",
      color: "from-purple-600 to-pink-600",
      icon: Shield,
    },
  };

  const config = roleConfig[userRole];
  const RoleIcon = config.icon;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push("/");
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-black'>
      <Toaster position='top-center' richColors />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-300 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='p-6 border-b border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className={`p-3 rounded-xl bg-linear-to-br ${config.color} shadow-lg`}>
                  <RoleIcon className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    JobPortal
                  </h1>
                  <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                    {config.name} Panel
                  </p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden'
                onClick={() => setSidebarOpen(false)}>
                <X className='h-5 w-5' />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-4 space-y-1.5'>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const isPendingEmployer =
                userRole === "employer" &&
                isEmployerApproved === false &&
                item.href !== "/employer";

              return (
                <Link
                  key={item.href}
                  href={isPendingEmployer ? "#" : item.href}
                  onClick={(e) => {
                    if (isPendingEmployer) e.preventDefault();
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "group relative flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-linear-to-r from-primary/10 to-primary/5 text-primary shadow-md border border-primary/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm",
                    isPendingEmployer && "opacity-50 cursor-not-allowed"
                  )}>
                  <div className='flex items-center gap-3'>
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isActive && "bg-primary/10"
                      )}>
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isActive ? "text-primary" : "text-gray-500"
                        )}
                      />
                    </div>
                    <span>{item.title}</span>
                  </div>

                  {isActive && (
                    <ChevronRight className='h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity' />
                  )}

                  {isPendingEmployer && (
                    <span className='text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full'>
                      Approval Pending
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-800 space-y-3'>
            <div className='px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl'>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Logged in as
              </p>
              <p className='text-sm font-semibold text-gray-900 dark:text-white capitalize'>
                {userRole === "jobseeker" ? "Job Seeker" : userRole}
              </p>
            </div>

            <Button
              variant='ghost'
              className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl cursor-pointer'
              onClick={handleLogout}
              disabled={isLoggingOut}>
              <LogOut className='h-5 w-5 mr-3' />
              {isLoggingOut ? "Signing out..." : "Logout"}
            </Button>

            <Button
              variant='ghost'
              asChild
              className='w-full justify-start text-gray-600 dark:text-gray-400'>
              <Link href='/' className='flex items-center text-sm'>
                <Home className='h-4 w-4 mr-2' />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className='lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800'>
        <div className='flex items-center justify-between p-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setSidebarOpen(true)}
            className='rounded-xl'>
            <Menu className='h-6 w-6' />
          </Button>
          <div className='flex items-center gap-2'>
            <div className={`p-2 rounded-lg bg-linear-to-br ${config.color}`}>
              <RoleIcon className='h-5 w-5 text-white' />
            </div>
            <span className='font-semibold text-gray-900 dark:text-white'>
              {config.name}
            </span>
          </div>
          <div className='w-10' />
        </div>
      </div>

      {/* Main Content */}
      <main className='lg:ml-72 min-h-screen pt-16 lg:pt-0'>
        <div className='p-4 sm:p-6 lg:p-8 xl:p-10'>
          <div className='max-w-7xl mx-auto'>{children}</div>
        </div>
      </main>
    </div>
  );
}
