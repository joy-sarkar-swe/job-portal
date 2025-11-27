"use client";

import {
  getJobApplicantsAction,
  Applicant as ServerApplicant,
} from "@/actions/employer/applicant-list";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [notAuthorized, setNotAuthorized] = useState(false);

  // Fetch applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);

      const res = await getJobApplicantsAction(jobId);

      if (!res.success) {
        if (res.statusCode === 403) {
          setNotAuthorized(true);
        }
        setLoading(false);
        return;
      }

      const mappedApplicants: any[] =
        res.applicants?.map((app: ServerApplicant) => ({
          id: app.applicationId,
          name: app.applicant.name,
          email: app.applicant.email,
          skills: app.applicant.skills.join(", "),
          resumeUrl: app.applicant.resume,
          appliedAt: app.appliedAt,
          approved: app.approved,
        })) || [];

      setApplicants(mappedApplicants);
      setLoading(false);
    };

    fetchApplicants();
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
        </div>

        {applicants.length === 0 && (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <div className='text-center space-y-4'>
                <div className='text-6xl'>👥</div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  No Applicants Yet
                </h3>
              </div>
            </CardContent>
          </Card>
        )}

        {applicants.length > 0 && (
          <div className='grid grid-cols-1 gap-4'>
            {applicants.map((applicant) => (
              <Card
                key={applicant.id}
                className='hover:shadow-lg transition-shadow'>
                <CardContent className='p-6 space-y-4'>
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
                      {applicant.approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
                      <Mail className='h-4 w-4' />
                      <a
                        href={`mailto:${applicant.email}`}
                        className='hover:underline'>
                        {applicant.email}
                      </a>
                    </div>

                    <div>
                      <div className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                        <User className='h-4 w-4' />
                        Skills:
                      </div>
                      <div className='flex flex-wrap gap-2 mt-1'>
                        {applicant.skills
                          .split(",")
                          .map((skill: string, idx: number) => (
                            <Badge key={idx} variant='outline'>
                              {skill.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    {applicant.resumeUrl && (
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
                    )}
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
