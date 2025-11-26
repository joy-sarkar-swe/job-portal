"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  skills: string;
  resumeUrl: string;
}

export default function EditProfilePage() {
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock initial data - replace with actual data from API/localStorage
  const [formData, setFormData] = useState<ProfileData>({
    name: "John Doe",
    email: "john@example.com",
    bio: "",
    skills: "",
    resumeUrl: "",
  });

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setShowSuccess(false);

    // Simulate API call
    setTimeout(() => {
      // TODO: Save to API/localStorage
      console.log("Saving profile:", formData);

      setSaving(false);
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <DashboardLayout userRole='jobseeker'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Edit Profile
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Update your professional information
          </p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'>
            <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
            <AlertDescription className='text-green-800 dark:text-green-200'>
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Name */}
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  disabled={saving}
                  placeholder='Enter your full name'
                />
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={saving}
                  placeholder='your.email@example.com'
                />
              </div>

              {/* Bio */}
              <div className='space-y-2'>
                <Label htmlFor='bio'>Professional Bio</Label>
                <Textarea
                  id='bio'
                  value={formData.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("bio", e.target.value)
                  }
                  disabled={saving}
                  placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                  rows={6}
                  className='resize-none'
                />
                <p className='text-xs text-muted-foreground'>
                  {formData.bio.length} / 500 characters
                </p>
              </div>

              {/* Skills */}
              <div className='space-y-2'>
                <Label htmlFor='skills'>Skills</Label>
                <Input
                  id='skills'
                  type='text'
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  disabled={saving}
                  placeholder='React, Node.js, Python, SQL, etc.'
                />
                <p className='text-xs text-muted-foreground'>
                  Separate skills with commas
                </p>
              </div>

              {/* Resume URL */}
              <div className='space-y-2'>
                <Label htmlFor='resumeUrl'>Resume URL</Label>
                <Input
                  id='resumeUrl'
                  type='url'
                  value={formData.resumeUrl}
                  onChange={(e) =>
                    handleInputChange("resumeUrl", e.target.value)
                  }
                  disabled={saving}
                  placeholder='https://example.com/resume.pdf'
                />
                <p className='text-xs text-muted-foreground'>
                  Link to your resume (Google Drive, Dropbox, personal website,
                  etc.)
                </p>
              </div>

              {/* Submit Button */}
              <div className='flex gap-4 pt-4'>
                <Button
                  type='submit'
                  disabled={saving}
                  className='w-full sm:w-auto'>
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
                  disabled={saving}
                  onClick={() => {
                    // Reset to initial values
                    setFormData({
                      name: "John Doe",
                      email: "john@example.com",
                      bio: "",
                      skills: "",
                      resumeUrl: "",
                    });
                  }}>
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
