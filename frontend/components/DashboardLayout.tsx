"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "jobseeker" | "employer";
}

const jobSeekerNav = [
  {
    title: "Dashboard",
    href: "/jobseeker",
    icon: LayoutDashboard,
  },
  {
    title: "Edit Profile",
    href: "/jobseeker/profile",
    icon: User,
  },
  {
    title: "Applied Jobs",
    href: "/jobseeker/applied-jobs",
    icon: FileText,
  },
];

const employerNav = [
  {
    title: "Dashboard",
    href: "/employer",
    icon: LayoutDashboard,
  },
  {
    title: "Post Job",
    href: "/employer/post-job",
    icon: Briefcase,
  },
  {
    title: "My Jobs",
    href: "/employer/jobs",
    icon: FileText,
  },
];

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = userRole === "jobseeker" ? jobSeekerNav : employerNav;
  const dashboardTitle = userRole === "jobseeker" ? "Job Seeker" : "Employer";

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...");
    window.location.href = "/";
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Mobile menu button */}
      <div className='lg:hidden fixed top-4 left-4 z-50'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='bg-white dark:bg-gray-800'>
          {sidebarOpen ? (
            <X className='h-5 w-5' />
          ) : (
            <Menu className='h-5 w-5' />
          )}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
        <div className='flex flex-col h-full'>
          {/* Logo/Brand */}
          <div className='flex items-center gap-2 p-6 border-b border-gray-200 dark:border-gray-700'>
            <Briefcase className='h-8 w-8 text-primary' />
            <div>
              <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
                Job Portal
              </h1>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {dashboardTitle} Dashboard
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}>
                  <Icon className='h-5 w-5' />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Footer - Logout */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
            <Button
              variant='ghost'
              className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
              onClick={handleLogout}>
              <LogOut className='h-5 w-5 mr-3' />
              Logout
            </Button>
            <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <Button
                variant='link'
                asChild
                className='w-full justify-start p-0 h-auto text-xs'>
                <Link href='/'>← Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className='lg:ml-64 min-h-screen'>
        <div className='p-4 sm:p-6 lg:p-8'>
          <div className='max-w-7xl mx-auto'>{children}</div>
        </div>
      </main>
    </div>
  );
}
