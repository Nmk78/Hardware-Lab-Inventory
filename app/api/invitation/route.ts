import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

//@ts-nocheck
export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { message: "Email and role are required" },
        { status: 400 }
      );
    }

    const INVITATION_API_KEY = process.env.CLERK_SECRET_KEY; // ✅ Use Backend API Key
    const BASE_URL = process.env.BASE_URL;

    if (!INVITATION_API_KEY) {
      return NextResponse.json(
        { message: "API key not found" },
        { status: 500 }
      );
    }

    if (!BASE_URL || !BASE_URL.startsWith("http")) {
      return NextResponse.json(
        { message: "Invalid BASE_URL" },
        { status: 500 }
      );
    }

    // ✅ FIX: Use private_metadata instead of public_metadata
    const payload = {
      email_address: email,
      private_metadata: { role }, // ✅ Change here
      redirect_url: BASE_URL,
    };

    console.log("🚀 ~ Sending request to Clerk:", payload);

    const response = await axios.post(
      "https://api.clerk.com/v1/invitations",
      payload,
      {
        headers: {
          Authorization: `Bearer ${INVITATION_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🚀 ~ POST ~ response:", response.data);

    return NextResponse.json({
      message: "Invitation sent successfully",
      result: response.data,
    });
  } catch (error) {
    const err = error as AxiosError;
    console.error("🚀 ~ POST ~ Clerk API Error:", err.response?.data);
    return NextResponse.json(
      {
        message:
          err.response?.data &&
          typeof err.response.data === "object" &&
          "message" in err.response.data
            ? (err.response.data as { message: string }).message
            : "Unknown error",
        details: err.response?.data,
      },
      { status: err.response?.status || 500 }
    );
  }
}
