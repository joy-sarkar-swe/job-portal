"use server";

import { cookies } from "next/headers";

interface ApprovedEmployer {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmployerApproved: boolean;
  isBlocked: boolean;
}

interface ApproveEmployerResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  user?: ApprovedEmployer;
}

export async function approveEmployer(
  id: string
): Promise<ApproveEmployerResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(
      `${process.env.NEXT_BACKEND_URI}/admin/employers/approve/${id}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        message: data.message || "Employer approved",
        user: data.user,
      };
    } else {
      return { success: false, message: data.message || "Failed to approve" };
    }
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}
