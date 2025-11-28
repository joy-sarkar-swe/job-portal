"use client";

import {
  getJobApplicantsAction,
  Applicant as ServerApplicant,
} from "@/actions/employer/applicant-list";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Mail,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      const res = await getJobApplicantsAction(jobId);

      if (!res.success) {
        if (res.statusCode === 403) setNotAuthorized(true);
        else toast.error(res.message || "Failed to load applicants");
        setLoading(false);
        return;
      }

      const mapped = (res.applicants || []).map((app: ServerApplicant) => ({
        id: app.applicationId,
        name: app.applicant.name,
        email: app.applicant.email,
        skills: app.applicant.skills,
        resumeUrl: app.applicant.resume,
        appliedAt: app.appliedAt,
        approved: app.approved,
      }));

      setApplicants(mapped);
      setLoading(false);
    };

    fetchApplicants();
  }, [jobId]);

  if (loading) {
    return (
      <DashboardLayout userRole='employer'>
        <div className='flex flex-col items-center justify-center py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4' />
          <p className='text-gray-500'>Loading applicants...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (notAuthorized) {
    return (
      <DashboardLayout userRole='employer'>
        <div className='max-w-2xl mx-auto text-center py-20'>
          <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-6' />
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Access Denied
          </h2>
          <p className='text-gray-600 mb-8'>
            You are not authorized to view applicants for this job. Only the
            employer who created this job can access this page.
          </p>
          <Button size='lg' onClick={() => router.push("/employer/jobs")}>
            Back to My Jobs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole='employer'>
      <div className='mx-auto space-y-10 pb-12'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => router.back()}
              className='rounded-full hover:bg-gray-100'>
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h1 className='text-4xl font-bold text-gray-900'>
                Job Applicants
              </h1>
              <p className='text-lg text-gray-600 mt-2'>
                {applicants.length} candidate{applicants.length !== 1 && "s"}{" "}
                applied
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {applicants.length === 0 && (
          <Card className='border-dashed border-2'>
            <CardContent className='flex flex-col items-center justify-center py-20 text-center'>
              <div className='bg-gray-100 rounded-full p-8 mb-6'>
                <FileText className='h-16 w-16 text-gray-400' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                No Applications Yet
              </h3>
              <p className='text-gray-600 max-w-md'>
                When candidates apply to your job, their profiles will appear
                here for review.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Applicants Grid */}
        {applicants.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {applicants.map((applicant) => (
              <Card
                key={applicant.id}
                className='group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden'>
                <CardContent className='p-8'>
                  <div className='flex items-start justify-between mb-6'>
                    <div className='flex items-center gap-5'>
                      <Avatar className='h-20 w-20 ring-4 ring-white shadow-xl'>
                        <AvatarFallback className='text-2xl font-bold bg-linear-to-br from-blue-500 to-purple-600 text-white'>
                          {applicant.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='text-2xl font-bold text-gray-900'>
                          {applicant.name}
                        </h3>
                        <div className='flex items-center gap-2 text-gray-600 mt-1'>
                          <Calendar className='h-4 w-4' />
                          <span className='text-sm'>
                            Applied{" "}
                            {new Date(applicant.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      className={`text-lg px-4 py-2 font-medium ${
                        applicant.approved
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}>
                      {applicant.approved ? (
                        <>
                          <CheckCircle2 className='h-4 w-4 mr-2' />
                          Approved
                        </>
                      ) : (
                        <>
                          <Clock className='h-4 w-4 mr-2' />
                          Under Review
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className='space-y-5'>
                    {/* Email */}
                    <div className='flex items-center gap-3 text-gray-700'>
                      <Mail className='h-5 w-5 text-gray-500' />
                      <a
                        href={`mailto:${applicant.email}`}
                        className='font-medium hover:text-primary transition-colors hover:underline'>
                        {applicant.email}
                      </a>
                    </div>

                    {/* Skills */}
                    {applicant.skills.length > 0 && (
                      <div>
                        <p className='text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                          <span>Top Skills</span>
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {applicant.skills
                            .slice(0, 6)
                            .map((skill: string, i: number) => (
                              <Badge
                                key={i}
                                variant='secondary'
                                className='bg-gray-100 text-gray-700 hover:bg-gray-200'>
                                {skill}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Resume */}
                    {applicant.resumeUrl && (
                      <Button
                        asChild
                        className='w-full mt-4 font-semibold shadow-md cursor-pointer'
                        size='lg'>
                        <a
                          href={applicant.resumeUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center justify-center gap-3'>
                          <Download className='h-5 w-5' />
                          Download Resume
                          <ExternalLink className='h-4 w-4' />
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
