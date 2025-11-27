"use client";

import { postJobAction } from "@/actions/employer/post-job";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
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
    company: "Tech Corp", // prefill if needed
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
      setErrorMessage(result.message || "Failed to create job");
      return;
    }

    setSuccessMessage(result.message || "Job created successfully!");

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push("/employer/jobs");
    }, 2000);
  };

  return (
    <DashboardLayout userRole='employer'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Create New Job
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Post a new job listing to attract candidates
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'>
            <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
            <AlertDescription className='text-green-800 dark:text-green-200'>
              {successMessage} Redirecting...
            </AlertDescription>
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
                <Label htmlFor='title'>Job Title *</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder='e.g., Senior Frontend Developer'
                />
              </div>

              {/* Company */}
              <div className='space-y-2'>
                <Label htmlFor='company'>Company Name *</Label>
                <Input
                  id='company'
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder='Your company name'
                />
              </div>

              {/* Location */}
              <div className='space-y-2'>
                <Label htmlFor='location'>Location *</Label>
                <Input
                  id='location'
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  disabled={isLoading}
                  required
                  placeholder='e.g., Remote or New York, NY'
                />
              </div>

              {/* Job Type */}
              <div className='space-y-2'>
                <Label htmlFor='jobType'>Job Type *</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => handleInputChange("jobType", value)}
                  disabled={isLoading}
                  required>
                  <SelectTrigger id='jobType'>
                    <SelectValue placeholder='Select job type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='full-time'>Full-time</SelectItem>
                    <SelectItem value='part-time'>Part-time</SelectItem>
                    <SelectItem value='remote'>Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range */}
              <div className='space-y-2'>
                <Label htmlFor='salaryRange'>Salary Range</Label>
                <Input
                  id='salaryRange'
                  value={formData.salaryRange}
                  onChange={(e) =>
                    handleInputChange("salaryRange", e.target.value)
                  }
                  disabled={isLoading}
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
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={isLoading}
                  required
                  placeholder='Describe responsibilities, requirements, benefits...'
                  rows={8}
                  className='resize-none'
                />
                <p className='text-xs text-muted-foreground'>
                  {formData.description.length} characters
                </p>
              </div>
            </CardContent>

            <CardFooter className='flex gap-4'>
              <Button type='submit' disabled={isLoading} className='flex-1'>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Creating
                    Job...
                  </>
                ) : (
                  "Create Job"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
