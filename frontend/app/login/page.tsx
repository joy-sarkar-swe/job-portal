"use client";

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
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsBlocked(false);
    setErrorMessage("");

    // TODO: Implement login logic
    console.log("Login data:", formData);

    // Simulate API call
    setTimeout(() => {
      // Example: Check if user is blocked
      // This should be replaced with actual API response
      const userBlocked = false; // Set to true to test blocked message

      if (userBlocked) {
        setIsBlocked(true);
        setErrorMessage(
          "Your account has been blocked. Please contact support."
        );
      } else {
        // Handle successful login
        console.log("Login successful");
      }
      setIsLoading(false);
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
            {isBlocked && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{errorMessage}</AlertDescription>
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
                {/* <Link
                  href='/forgot-password'
                  className='text-sm text-primary hover:underline'>
                  Forgot password?
                </Link> */}
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
              disabled={isLoading || isBlocked}>
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
