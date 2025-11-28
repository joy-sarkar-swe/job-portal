"use client";

import { getJobByIdAction } from "@/actions/job/get-job-by-id";
import { updateJobByIdAction } from "@/actions/job/update-job-by-id";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  FileText,
  Loader2,
  MapPin,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  jobType: "full-time" | "part-time" | "remote" | "";
  salaryRange?: string;
  description: string;
}

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salaryRange: "",
    description: "",
  });

  // Fetch job details
  const fetchJobDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getJobByIdAction(jobId);

      if (!response.success || !response.job) {
        setError(response.message || "Job not found");
        return;
      }

      const job = response.job;
      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        jobType: job.jobType || "",
        salaryRange: job.salaryRange || "",
        description: job.description || "",
      });
    } catch {
      setError("Failed to load job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchJobDetails();
  }, [jobId]);

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.jobType ||
      !formData.description
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateJobByIdAction(jobId, {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        salaryRange: formData.salaryRange?.trim() || undefined,
        description: formData.description.trim(),
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to update job");
      }

      setSuccess("Job updated successfully! Redirecting...");
      setTimeout(() => router.push("/employer/jobs"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole='employer'>
        <div className='flex flex-col items-center justify-center py-20'>
          <Loader2 className='h-12 w-12 animate-spin text-primary mb-4' />
          <p className='text-gray-500'>Loading job details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole='employer'>
      <div className='mx-auto space-y-8 pb-12'>
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
                Edit Job Listing
              </h1>
              <p className='text-gray-600 mt-2'>
                Make changes to your job post
              </p>
            </div>
          </div>

          {formData.jobType && (
            <Badge
              className={`text-lg px-6 py-2 font-medium ${
                formData.jobType === "full-time"
                  ? "bg-blue-100 text-blue-700"
                  : formData.jobType === "part-time"
                  ? "bg-purple-100 text-purple-700"
                  : formData.jobType === "remote"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
              {formData.jobType
                ? formData.jobType.replace("-", " ").toUpperCase()
                : "JOB TYPE"}
            </Badge>
          )}
        </div>

        {/* Messages */}
        {success && (
          <Alert className='border-green-200 bg-green-50 dark:bg-green-900/20'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            <AlertDescription className='text-green-800 font-medium'>
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className='border-red-200 bg-red-50 dark:bg-red-900/20'>
            <AlertCircle className='h-5 w-5 text-red-600' />
            <AlertDescription className='text-red-800 font-medium'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-8'>
          <Card className='border-0 shadow-xl'>
            <CardContent className='p-8 space-y-10'>
              {/* Title & Company */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-2'>
                  <Label className='text-base font-semibold flex items-center gap-2'>
                    <Briefcase className='h-5 w-5 text-gray-500' />
                    Job Title <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder='e.g. Senior React Developer'
                    className='h-12 text-lg'
                    required
                    disabled={saving}
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='text-base font-semibold flex items-center gap-2'>
                    <Building2 className='h-5 w-5 text-gray-500' />
                    Company Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    placeholder='e.g. TechCorp Inc.'
                    className='h-12 text-lg'
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Location & Job Type */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-2'>
                  <Label className='text-base font-semibold flex items-center gap-2'>
                    <MapPin className='h-5 w-5 text-gray-500' />
                    Location <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder='e.g. San Francisco, CA or Remote'
                    className='h-12'
                    required
                    disabled={saving}
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='text-base font-semibold flex items-center gap-2'>
                    <Briefcase className='h-5 w-5 text-gray-500' />
                    Job Type <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(v) => handleInputChange("jobType", v)}
                    disabled={saving}>
                    <SelectTrigger className='h-12'>
                      <SelectValue placeholder='Choose job type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='full-time'>Full-time</SelectItem>
                      <SelectItem value='part-time'>Part-time</SelectItem>
                      <SelectItem value='remote'>Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Salary Range */}
              <div className='space-y-2'>
                <Label className='text-base font-semibold flex items-center gap-2'>
                  <DollarSign className='h-5 w-5 text-gray-500' />
                  Salary Range (Optional)
                </Label>
                <Input
                  value={formData.salaryRange}
                  onChange={(e) =>
                    handleInputChange("salaryRange", e.target.value)
                  }
                  placeholder='e.g. $80,000 - $120,000 / year'
                  className='h-12'
                  disabled={saving}
                />
                <p className='text-sm text-gray-500'>
                  Include currency and time period for clarity
                </p>
              </div>

              {/* Description */}
              <div className='space-y-2'>
                <Label className='text-base font-semibold flex items-center gap-2'>
                  <FileText className='h-5 w-5 text-gray-500' />
                  Job Description <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder='Describe the role, responsibilities, requirements, and what makes your company great...'
                  rows={12}
                  className='text-base resize-none'
                  required
                  disabled={saving}
                />
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-800'>
                <Button
                  type='submit'
                  size='lg'
                  className='flex-1 font-semibold shadow-lg cursor-pointer'
                  disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className='mr-3 h-5 w-5 animate-spin' />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='mr-3 h-5 w-5' />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  size='lg'
                  onClick={() => router.push("/employer/jobs")}
                  disabled={saving}
                  className='flex-1 cursor-pointer'>
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
