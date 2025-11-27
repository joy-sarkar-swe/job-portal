"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateMockJob } from "@/lib/mockData";
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  FileText,
  Mail,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Applicant {
  id: number;
  name: string;
  email: string;
  skills: string;
  resumeUrl: string;
  appliedAt: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
}

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch applicants
    setTimeout(() => {
      // Check if employer owns this job (mock check)
      const employerOwnsJob = true; // TODO: Replace with actual ownership check

      if (!employerOwnsJob) {
        setNotAuthorized(true);
        setLoading(false);
        return;
      }

      // Fetch job details
      const job = generateMockJob(jobId);
      if (job) {
        setJobTitle(job.title);
      }

      // Mock applicants data - replace with actual API call
      const mockApplicants: Applicant[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          skills: "React, TypeScript, Node.js, MongoDB",
          resumeUrl: "https://example.com/resume/john-doe.pdf",
          appliedAt: "2025-11-20",
          status: "pending",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          skills: "JavaScript, Vue.js, Python, PostgreSQL",
          resumeUrl: "https://example.com/resume/jane-smith.pdf",
          appliedAt: "2025-11-18",
          status: "reviewed",
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          skills: "Angular, Java, Spring Boot, MySQL",
          resumeUrl: "https://example.com/resume/mike-johnson.pdf",
          appliedAt: "2025-11-15",
          status: "pending",
        },
        {
          id: 4,
          name: "Sarah Williams",
          email: "sarah.williams@example.com",
          skills: "React Native, Swift, Kotlin, Firebase",
          resumeUrl: "https://example.com/resume/sarah-williams.pdf",
          appliedAt: "2025-11-12",
          status: "reviewed",
        },
      ];

      setApplicants(mockApplicants);
      setLoading(false);
    }, 500);
  }, [jobId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <DashboardLayout userRole='employer'>
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      </DashboardLayout>
    );
  }

  if (notAuthorized) {
    return (
      <DashboardLayout userRole='employer'>
        <div className='space-y-6'>
          <Alert className='bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'>
            <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400' />
            <AlertDescription className='text-red-800 dark:text-red-200'>
              You are not authorized to view applicants for this job. Only the
              employer who created this job can view applicants.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/employer/jobs")}>
            Back to My Jobs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole='employer'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <Button
            variant='ghost'
            onClick={() => router.push("/employer/jobs")}
            className='mb-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to My Jobs
          </Button>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Applicants
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            {jobTitle && `for "${jobTitle}"`}
          </p>
        </div>

        {/* Empty State */}
        {applicants.length === 0 && (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <div className='text-center space-y-4'>
                <div className='text-6xl'>👥</div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  No Applicants Yet
                </h3>
                <p className='text-gray-600 dark:text-gray-400 max-w-md'>
                  This job hasn&apos;t received any applications yet. Check back
                  later or share your job posting to attract more candidates.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applicants List */}
        {applicants.length > 0 && (
          <>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Showing {applicants.length} applicant
              {applicants.length !== 1 ? "s" : ""}
            </div>

            <div className='grid grid-cols-1 gap-4'>
              {applicants.map((applicant) => (
                <Card
                  key={applicant.id}
                  className='hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='space-y-4'>
                      {/* Header with Status */}
                      <div className='flex items-start justify-between'>
                        <div>
                          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                            {applicant.name}
                          </h3>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Applied on {formatDate(applicant.appliedAt)}
                          </p>
                        </div>
                        <Badge variant='default'>
                          {applicant.status.charAt(0).toUpperCase() +
                            applicant.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Contact Info */}
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
                          <Mail className='h-4 w-4' />
                          <a
                            href={`mailto:${applicant.email}`}
                            className='hover:underline'>
                            {applicant.email}
                          </a>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                          <User className='h-4 w-4' />
                          Skills:
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {applicant.skills.split(",").map((skill, index) => (
                            <Badge key={index} variant='outline'>
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Resume */}
                      {applicant.resumeUrl && (
                        <div>
                          <Button
                            variant='outline'
                            size='sm'
                            asChild
                            className='w-full sm:w-auto'>
                            <a
                              href={applicant.resumeUrl}
                              target='_blank'
                              rel='noopener noreferrer'>
                              <FileText className='h-4 w-4 mr-2' />
                              View Resume
                              <ExternalLink className='h-3 w-3 ml-2' />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
