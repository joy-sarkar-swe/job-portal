"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PendingEmployer {
  id: number;
  name: string;
  email: string;
  company: string;
  submittedAt: string;
}

export default function PendingEmployersPage() {
  const [pendingEmployers, setPendingEmployers] = useState<PendingEmployer[]>([
    {
      id: 1,
      name: "John Smith",
      email: "john@techcorp.com",
      company: "Tech Corp",
      submittedAt: "2025-11-20",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@startup.io",
      company: "StartUp Inc",
      submittedAt: "2025-11-22",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@digital.com",
      company: "Digital Solutions",
      submittedAt: "2025-11-24",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@creative.agency",
      company: "Creative Agency",
      submittedAt: "2025-11-25",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@cloudsys.com",
      company: "Cloud Systems",
      submittedAt: "2025-11-26",
    },
  ]);

  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApprove = async (id: number, name: string) => {
    setApprovingId(id);
    setSuccessMessage(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setPendingEmployers((prev) => prev.filter((emp) => emp.id !== id));
    setApprovingId(null);
    setSuccessMessage(`${name} has been approved successfully!`);

    // Hide success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
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
              Pending Employers
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-2'>
              Review and approve employer registrations
            </p>
          </div>
          <Link href='/admin'>
            <Button variant='outline'>← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800 dark:text-green-200'>
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Count */}
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          {pendingEmployers.length} pending approval
          {pendingEmployers.length !== 1 ? "s" : ""}
        </div>

        {/* Employers List */}
        {pendingEmployers.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <CheckCircle className='h-12 w-12 text-green-500 mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                All Caught Up!
              </h3>
              <p className='text-gray-500 dark:text-gray-400 text-center'>
                There are no pending employer approvals at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {pendingEmployers.map((employer) => (
              <Card key={employer.id}>
                <CardContent className='p-6'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <div className='flex-1 space-y-3'>
                      <div className='flex items-start gap-3'>
                        <div className='bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg'>
                          <User className='h-5 w-5 text-blue-600' />
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                            {employer.name}
                          </h3>
                          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                            {employer.company}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                        <Mail className='h-4 w-4' />
                        <a
                          href={`mailto:${employer.email}`}
                          className='hover:text-blue-600 dark:hover:text-blue-400'>
                          {employer.email}
                        </a>
                      </div>

                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Submitted on {formatDate(employer.submittedAt)}
                      </p>
                    </div>

                    <div className='sm:min-w-32'>
                      <Button
                        onClick={() =>
                          handleApprove(employer.id, employer.name)
                        }
                        disabled={approvingId === employer.id}
                        className='w-full sm:w-auto'>
                        {approvingId === employer.id ? (
                          <>
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className='h-4 w-4 mr-2' />
                            Approve
                          </>
                        )}
                      </Button>
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
