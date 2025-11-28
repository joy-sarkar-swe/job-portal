"use client";

import { getProfileAction } from "@/actions/profile/get-profile";
import { updateProfileAction } from "@/actions/profile/update-profile";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  skills: string;
  resumeUrl: string;
}

export default function EditProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    bio: "",
    skills: "",
    resumeUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const res = await getProfileAction();
      if (res.success && res.user) {
        setFormData({
          name: res.user.name,
          email: res.user.email,
          bio: res.user.bio || "",
          skills: res.user.skills?.join(", ") || "",
          resumeUrl: res.user.resumeUrl || "",
        });
        setError(null);
      } else {
        setError(res.message || "Failed to load profile");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setShowSuccess(false);
    setError(null);

    const payload = {
      bio: formData.bio.trim(),
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      resumeUrl: formData.resumeUrl.trim() || undefined,
    };

    const res = await updateProfileAction(payload);

    if (res.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } else {
      setError(res.message || "Failed to update profile");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <DashboardLayout userRole='jobseeker'>
        <div className='flex flex-col items-center justify-center py-32'>
          <Loader2 className='h-12 w-12 animate-spin text-primary mb-4' />
          <p className='text-gray-500'>Loading your profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole='jobseeker'>
      <div className='mx-auto space-y-10 pb-16'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900'>
            Edit Your Profile
          </h1>
          <p className='text-xl text-gray-600 mt-3'>
            Stand out to employers — complete your profile to get noticed faster
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <Alert className='border-green-200 bg-green-50 dark:bg-green-900/20'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            <AlertDescription className='text-green-800 font-medium text-lg'>
              Profile updated successfully! Employers can now see your latest
              info
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

        {/* Profile Edit From */}
        <Card className='lg:col-span-2 border-0 shadow-xl'>
          <CardContent className='p-8'>
            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Not Editable Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-gray-500' />
                    Full Name
                  </Label>
                  <Input
                    value={formData.name}
                    disabled
                    className='bg-gray-50'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-gray-500' />
                    Email Address
                  </Label>
                  <Input
                    value={formData.email}
                    disabled
                    className='bg-gray-50'
                  />
                </div>
              </div>

              {/* Bio */}
              <div className='space-y-3'>
                <Label className='flex items-center gap-2 text-base font-semibold'>
                  <span>Professional Bio</span>
                  <Badge variant='secondary' className='text-xs'>
                    Recommended
                  </Badge>
                </Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder='Enter your bio...'
                  rows={6}
                  className='resize-none text-base'
                  disabled={saving}
                  maxLength={500}
                />
                <div className='flex justify-between text-sm'>
                  <span
                    className={
                      formData.bio.length > 450
                        ? "text-red-600"
                        : "text-gray-500"
                    }>
                    {formData.bio.length}/500
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className='space-y-3'>
                <Label className='flex items-center gap-2 text-base font-semibold'>
                  <span>Skills</span>
                  <Badge variant='secondary' className='text-xs'>
                    Highly Recommended
                  </Badge>
                </Label>
                <Input
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder='React, TypeScript, Node.js, Tailwind CSS, PostgreSQL'
                  disabled={saving}
                />
                <p className='text-sm text-gray-500'>
                  Separate with commas (e.g. JavaScript, Nest js, Node js)
                </p>
              </div>

              {/* Resume URL */}
              <div className='space-y-3'>
                <Label className='flex items-center gap-2'>
                  <FileText className='h-4 w-4 text-gray-500' />
                  Resume Link
                </Label>
                <Input
                  type='url'
                  value={formData.resumeUrl}
                  onChange={(e) =>
                    handleInputChange("resumeUrl", e.target.value)
                  }
                  placeholder='https://drive.google.com/file/d/abc123/view'
                  disabled={saving}
                />
                <p className='text-sm text-gray-500'>
                  Public link to your resume (Google Drive, Dropbox, etc.)
                </p>
              </div>

              {/* Submit */}
              <div className='pt-6 border-t'>
                <Button
                  type='submit'
                  size='lg'
                  className='w-full sm:w-auto font-bold shadow-lg'
                  disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className='mr-3 h-5 w-5 animate-spin' />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='mr-3 h-5 w-5' />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
