"use server";

import { cookies } from "next/headers";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "jobseeker" | "employer" | "admin";
  isBlocked: boolean;
}

interface GetAllUsersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  pagination?: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  users?: User[];
}

export async function getAllUsers({
  page = 1,
  limit = 10,
  search = "",
  role,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  role?: "jobseeker" | "employer" | "admin";
  status?: boolean | "all";
}): Promise<GetAllUsersResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { statusCode: 401, success: false, message: "Not authenticated" };
    }

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search,
    });

    if (role) query.append("role", role);

    // Only append status if it's true or false; skip if "all"
    if (status === true || status === false) {
      query.append("status", String(status));
    }

    const res = await fetch(
      `${process.env.NEXT_BACKEND_URI}/admin/users?${query.toString()}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: data.statusCode || res.status,
        success: false,
        message: data.message || "Failed to fetch users",
      };
    }

    return {
      statusCode: data.statusCode || 200,
      success: true,
      message: data.message || "Users fetched successfully",
      pagination: data.pagination,
      users: data.users,
    };
  } catch (err) {
    console.error("Get users error:", err);
    return { statusCode: 500, success: false, message: "Server error" };
  }
}
