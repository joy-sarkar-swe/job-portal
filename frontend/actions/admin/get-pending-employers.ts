"use server";

import { cookies } from "next/headers";

interface PendingEmployer {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmployerApproved: boolean;
  isBlocked: boolean;
}

interface PendingEmployersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  users?: PendingEmployer[];
}

export async function getPendingEmployers({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PendingEmployersResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        statusCode: 401,
        success: false,
        message: "Not authenticated",
      };
    }

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search,
    });

    const response = await fetch(
      `${
        process.env.NEXT_BACKEND_URI
      }/admin/employers/pending?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: data.statusCode || response.status,
        success: false,
        message: data.message || "Failed to fetch pending employers",
      };
    }

    return {
      statusCode: data.statusCode,
      success: true,
      message: data.message,
      pagination: data.pagination,
      users: data.users,
    };
  } catch (error) {
    console.error("Get pending employers error:", error);
    return {
      statusCode: 500,
      success: false,
      message: "An error occurred while fetching pending employers",
    };
  }
}
