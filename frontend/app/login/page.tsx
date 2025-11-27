"use client";

import { loginAction } from "@/actions/auth/login";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccess(null);

    const result = await loginAction(formData.email, formData.password);

    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || "Login failed");
      return;
    }

    // Check if user is blocked (shouldn't happen if backend handles it, but double-check)
    if (result.user?.isBlocked) {
      setErrorMessage(
        "Your account has been blocked. Please contact support for assistance."
      );
      return;
    }

    setSuccess(result.message || "Login successful!");

    // Redirect based on user role after 1 second
    setTimeout(() => {
      if (result.user?.role === "admin") {
        router.push("/admin");
      } else if (result.user?.role === "employer") {
        router.push("/employer");
      } else {
        router.push("/jobseeker");
      }
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Welcome back
          </CardTitle>
          <CardDescription className='text-center'>
            Sign in to your Job Portal account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4 mb-4'>
            {errorMessage && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'>
                <CheckCircle className='h-4 w-4 text-green-600' />
                <AlertDescription className='text-green-800 dark:text-green-200'>
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
              </div>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button
              type='submit'
              className='w-full cursor-pointer'
              disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <p className='text-sm text-center text-muted-foreground'>
              Don&apos;t have an account?{" "}
              <Link
                href='/register'
                className='text-primary hover:underline font-medium'>
                Create account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
