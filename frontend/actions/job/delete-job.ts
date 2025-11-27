"use server";

import { cookies } from "next/headers";

export async function deleteJobAction(jobId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { statusCode: 401, success: false, message: "Not authenticated" };
    }

    const res = await fetch(`${process.env.NEXT_BACKEND_URI}/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete job",
      };
    }

    return {
      success: true,
      message: data.message || "Job deleted successfully",
    };
  } catch (error) {
    console.error("Delete Job Error:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the job",
    };
  }
}
