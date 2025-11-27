"use client";

import { getJobByIdAction } from "@/actions/job/get-job-by-id";
import { updateJobByIdAction } from "@/actions/job/update-job-by-id";
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
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  jobType: string;
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
    try {
      const response = await getJobByIdAction(jobId);

      if (!response.success) {
        setError(response.message || "Failed to load job");
        setLoading(false);
        return;
      }

      const data = response.job;

      setFormData({
        title: data?.title ?? "",
        company: data?.company ?? "",
        location: data?.location ?? "",
        jobType: data?.jobType ?? "",
        salaryRange: data?.salaryRange ?? "",
        description: data?.description ?? "",
      });

      setLoading(false);
    } catch {
      setError("Failed to load job details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  // Handle form input
  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit updated job data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateJobByIdAction(jobId, {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        salaryRange: formData.salaryRange,
        description: formData.description,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to update job");
      }

      setSaving(false);
      setSuccess("Job updated successfully!");

      setTimeout(() => {
        router.push("/employer/jobs");
      }, 1000);
    } catch (err: any) {
      setSaving(false);
      setError(err.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout userRole='employer'>
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole='employer'>
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>Edit Job</h1>
        <p className='text-gray-500'>Update your job listing details</p>

        {error && (
          <Alert className='bg-red-50 border-red-300'>
            <AlertCircle className='h-5 w-5 text-red-600' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className='bg-green-50 border-green-300'>
            <CheckCircle className='h-5 w-5 text-green-600' />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>

            <CardContent className='space-y-6'>
              {/* Title */}
              <div className='space-y-2'>
                <Label>Job Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  disabled={saving}
                />
              </div>

              {/* Company */}
              <div className='space-y-2'>
                <Label>Company *</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  required
                  disabled={saving}
                />
              </div>

              {/* Location */}
              <div className='space-y-2'>
                <Label>Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  required
                  disabled={saving}
                />
              </div>

              {/* Job Type */}
              <div className='space-y-2'>
                <Label>Job Type *</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) =>
                    handleInputChange("jobType", value)
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder='Select job type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='full-time'>Full-time</SelectItem>
                    <SelectItem value='part-time'>Part-time</SelectItem>
                    <SelectItem value='remote'>Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary */}
              <div className='space-y-2'>
                <Label>Salary Range</Label>
                <Input
                  value={formData.salaryRange}
                  onChange={(e) =>
                    handleInputChange("salaryRange", e.target.value)
                  }
                  disabled={saving}
                />
              </div>

              {/* Description */}
              <div className='space-y-2'>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={8}
                  required
                  disabled={saving}
                />
              </div>

              {/* Buttons */}
              <div className='flex gap-4 pt-4'>
                <Button type='submit' disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push("/employer/jobs")}
                  disabled={saving}>
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
