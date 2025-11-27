"use server";

import { cookies } from "next/headers";

export async function approveEmployer(id: string) {
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

    return res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}
