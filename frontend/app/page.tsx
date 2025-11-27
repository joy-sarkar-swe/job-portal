"use client";

import { logoutAction } from "@/actions/auth/logout";
import { getProfileAction } from "@/actions/profile/get-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile to check if user is authenticated
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileAction();
        if (res.success && res.user) {
          setUser(res.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    // Call server action to clear cookie
    await logoutAction();
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Briefcase className='h-8 w-8 text-primary' />
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Job Portal
            </h1>
          </div>

          <div className='flex gap-2'>
            {!loading &&
              (!isAuthenticated ? (
                <>
                  <Button asChild variant='outline'>
                    <Link href='/login'>Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href='/register'>Get Started</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage
                        src={user?.profilePicture || "/default-avatar.png"}
                        alt='User Avatar'
                      />
                      <AvatarFallback>
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href='/admin'> Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {user.role === "employer" && (
                      <DropdownMenuItem asChild>
                        <Link href='/employer'>Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {user.role === "jobseeker" && (
                      <DropdownMenuItem asChild>
                        <Link href='/jobseeker'>Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3'>
            Find Your Dream Job
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Discover opportunities that match your skills and passion
          </p>
        </div>

        {/* Optionally add job list, filters, etc. here */}
      </main>
    </div>
  );
}
