"use client";

import { postJobAction } from "@/actions/employer/post-job";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Briefcase,
  Building2,
  CheckCircle,
  DollarSign,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryRange: string;
  description: string;
}

export default function CreateJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salaryRange: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await postJobAction(
      formData.title,
      formData.company,
      formData.location,
      formData.jobType,
      formData.salaryRange,
      formData.description
    );

    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(
        result.message || "Failed to post job. Please try again."
      );
      return;
    }

    setSuccessMessage("Job posted successfully! Redirecting to your jobs...");
    setTimeout(() => router.push("/employer/jobs"), 2200);
  };

  return (
    <DashboardLayout userRole='employer'>
      <div className='mx-auto space-y-8 pb-12'>
        {/* Header */}
        <div className='text-center sm:text-left'>
          <div className='flex items-center gap-3 mb-4 justify-center sm:justify-start'>
            <div className='p-3 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg'>
              <Briefcase className='h-8 w-8 text-white' />
            </div>
            <div>
              <h1 className='text-4xl font-bold text-gray-900'>
                Post a New Job
              </h1>
              <p className='text-lg text-gray-600 mt-2'>
                Attract top talent with a compelling job listing
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert className='border-green-200 bg-green-50 dark:bg-green-900/20 shadow-lg'>
            <CheckCircle className='h-5 w-5 text-green-600' />
            <AlertDescription className='text-green-800 font-medium'>
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant='destructive' className='shadow-lg'>
            <AlertCircle className='h-5 w-5' />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card className='border-0 shadow-xl p-0'>
            <CardHeader className='bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-t-xl py-5'>
              <CardTitle className='text-2xl flex items-center gap-3'>
                <Sparkles className='h-6 w-6' />
                Job Details
              </CardTitle>
              <CardDescription className='text-blue-100'>
                Fill in the information below to create your job posting
              </CardDescription>
            </CardHeader>

            <CardContent className='p-8 space-y-8'>
              {/* Job Title */}
              <div className='space-y-3'>
                <Label
                  htmlFor='title'
                  className='text-lg font-semibold flex items-center gap-2'>
                  Job Title <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='title'
                  placeholder='e.g., Senior React Developer'
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={isLoading}
                  required
                  className='h-14 text-lg border-2 focus:border-blue-500 transition-all'
                />
              </div>

              <div className='grid md:grid-cols-2 gap-8'>
                {/* Company */}
                <div className='space-y-3'>
                  <Label
                    htmlFor='company'
                    className='text-lg font-semibold flex items-center gap-2'>
                    <Building2 className='h-5 w-5' />
                    Company Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='company'
                    placeholder='Acme Inc.'
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    disabled={isLoading}
                    required
                    className='h-14 text-lg'
                  />
                </div>

                {/* Location */}
                <div className='space-y-3'>
                  <Label
                    htmlFor='location'
                    className='text-lg font-semibold flex items-center gap-2'>
                    <MapPin className='h-5 w-5' />
                    Location <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='location'
                    placeholder='San Francisco, CA or Remote'
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    disabled={isLoading}
                    required
                    className='h-14 text-lg'
                  />
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-8'>
                {/* Job Type */}
                <div className='space-y-3'>
                  <Label className='text-lg font-semibold flex items-center gap-2'>
                    Job Type <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(v) => handleInputChange("jobType", v)}
                    disabled={isLoading}
                    required>
                    <SelectTrigger className='h-14 text-lg'>
                      <SelectValue placeholder='Choose job type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='full-time'>
                        <div className='flex items-center gap-2'>
                          <Badge className='bg-blue-100 text-blue-700'>
                            Full-time
                          </Badge>
                          Full-time
                        </div>
                      </SelectItem>
                      <SelectItem value='part-time'>
                        <div className='flex items-center gap-2'>
                          <Badge className='bg-purple-100 text-purple-700'>
                            Part-time
                          </Badge>
                          Part-time
                        </div>
                      </SelectItem>
                      <SelectItem value='remote'>
                        <div className='flex items-center gap-2'>
                          <Badge className='bg-emerald-100 text-emerald-700'>
                            Remote
                          </Badge>
                          Remote
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Salary Range */}
                <div className='space-y-3'>
                  <Label
                    htmlFor='salaryRange'
                    className='text-lg font-semibold flex items-center gap-2'>
                    <DollarSign className='h-5 w-5 text-green-600' />
                    Salary Range{" "}
                    <span className='text-gray-400 text-sm'>(Optional)</span>
                  </Label>
                  <Input
                    id='salaryRange'
                    placeholder='e.g., $120,000 - $180,000'
                    value={formData.salaryRange}
                    onChange={(e) =>
                      handleInputChange("salaryRange", e.target.value)
                    }
                    disabled={isLoading}
                    className='h-14 text-lg'
                  />
                </div>
              </div>

              {/* Description */}
              <div className='space-y-3'>
                <Label
                  htmlFor='description'
                  className='text-lg font-semibold flex items-center justify-between'>
                  <span>
                    Full Job Description <span className='text-red-500'>*</span>
                  </span>
                  <span className='text-sm text-gray-500 font-normal'>
                    {formData.description.length} characters
                  </span>
                </Label>
                <Textarea
                  id='description'
                  placeholder='Describe the role, responsibilities, required skills, benefits, and what makes your company great...'
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={isLoading}
                  required
                  rows={12}
                  className='resize-none text-base leading-relaxed border-2 focus:border-blue-500 transition-all'
                />
              </div>
            </CardContent>

            <CardContent className='bg-gray-50 dark:bg-gray-900/50 border-t p-8'>
              <div className='flex flex-col sm:flex-row gap-4 justify-between items-center'>
                <p className='text-sm text-gray-600'>
                  Your job will be live immediately after posting
                </p>
                <Button
                  type='submit'
                  size='lg'
                  disabled={isLoading}
                  className='min-w-64 text-lg font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer'>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-3 h-6 w-6 animate-spin' />
                      Posting Job...
                    </>
                  ) : (
                    <>
                      <Sparkles className='mr-2 h-5 w-5' />
                      Post Job Listing
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
