"use server";

import { cookies } from "next/headers";

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  jobseeker: {
    _id: string;
    name: string;
    email: string;
  };
  approved: boolean;
  appliedAt: string;
}

interface Response {
  success: boolean;
  applications?: Application[];
  message?: string;
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export async function getAllApplications({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
    });

    const res = await fetch(
      `${process.env.NEXT_BACKEND_URI}/admin/applications?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch applications",
      };
    }

    return {
      success: true,
      applications: data.applications,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Get applications error:", error);
    return { success: false, message: "Something went wrong" };
  }
}
