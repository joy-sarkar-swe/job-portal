"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateMockJob } from "@/lib/mockData";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryRange: string;
  description: string;
}

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notAuthorized, setNotAuthorized] = useState(false);

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salaryRange: "",
    description: "",
  });

  useEffect(() => {
    // Simulate API call to fetch job data
    setTimeout(() => {
      // Check if employer owns this job (mock check)
      const employerOwnsJob = true; // TODO: Replace with actual ownership check

      if (!employerOwnsJob) {
        setNotAuthorized(true);
        setLoading(false);
        return;
      }

      // Fetch job data
      const job = generateMockJob(jobId);
      if (job) {
        setFormData({
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          salaryRange: job.salaryRange || "",
          description: job.description || "",
        });
      }

      setLoading(false);
    }, 500);
  }, [jobId]);

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setShowSuccess(false);

    // Simulate API call
    setTimeout(() => {
      // TODO: Update job via API
      console.log("Updating job:", formData);

      setSaving(false);
      setShowSuccess(true);

      // Redirect to jobs list after 2 seconds
      setTimeout(() => {
        router.push("/employer/jobs");
      }, 2000);
    }, 1000);
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
              You are not authorized to edit this job. Only the employer who
              created this job can edit it.
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
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Edit Job
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Update your job listing details
          </p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'>
            <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
            <AlertDescription className='text-green-800 dark:text-green-200'>
              Job updated successfully! Redirecting to your jobs...
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Title */}
              <div className='space-y-2'>
                <Label htmlFor='title'>Job Title *</Label>
                <Input
                  id='title'
                  type='text'
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  disabled={saving}
                  placeholder='e.g., Senior Frontend Developer'
                />
              </div>

              {/* Company */}
              <div className='space-y-2'>
                <Label htmlFor='company'>Company Name *</Label>
                <Input
                  id='company'
                  type='text'
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  required
                  disabled={saving}
                  placeholder='Your company name'
                />
              </div>

              {/* Location */}
              <div className='space-y-2'>
                <Label htmlFor='location'>Location *</Label>
                <Input
                  id='location'
                  type='text'
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  required
                  disabled={saving}
                  placeholder='e.g., New York, NY or Remote'
                />
              </div>

              {/* Job Type */}
              <div className='space-y-2'>
                <Label htmlFor='jobType'>Job Type *</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => handleInputChange("jobType", value)}
                  required
                  disabled={saving}>
                  <SelectTrigger id='jobType'>
                    <SelectValue placeholder='Select job type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Full-time'>Full-time</SelectItem>
                    <SelectItem value='Part-time'>Part-time</SelectItem>
                    <SelectItem value='Remote'>Remote</SelectItem>
                    <SelectItem value='Contract'>Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range */}
              <div className='space-y-2'>
                <Label htmlFor='salaryRange'>Salary Range</Label>
                <Input
                  id='salaryRange'
                  type='text'
                  value={formData.salaryRange}
                  onChange={(e) =>
                    handleInputChange("salaryRange", e.target.value)
                  }
                  disabled={saving}
                  placeholder='e.g., $80,000 - $120,000'
                />
                <p className='text-xs text-muted-foreground'>Optional</p>
              </div>

              {/* Description */}
              <div className='space-y-2'>
                <Label htmlFor='description'>Job Description *</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("description", e.target.value)
                  }
                  required
                  disabled={saving}
                  placeholder='Describe the job role, responsibilities, requirements, and benefits...'
                  rows={10}
                  className='resize-none'
                />
                <p className='text-xs text-muted-foreground'>
                  {formData.description.length} characters
                </p>
              </div>

              {/* Submit Buttons */}
              <div className='flex gap-4 pt-4'>
                <Button
                  type='submit'
                  disabled={saving}
                  className='w-full sm:w-auto'>
                  {saving ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  disabled={saving}
                  onClick={() => router.push("/employer/jobs")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
