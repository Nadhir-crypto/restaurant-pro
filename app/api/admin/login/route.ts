import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const COOKIE_NAME = "restaurant_admin_session";

function createSessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!password || !secret) {
    throw new Error("Admin environment variables are missing.");
  }

  return createHmac("sha256", secret)
    .update(`admin:${password}`)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || !process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.json(
        { error: "Admin authentication is not configured." },
        { status: 500 }
      );
    }

    if (typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 }
      );
    }

    const provided = Buffer.from(password);
    const expected = Buffer.from(adminPassword);

    const valid =
      provided.length === expected.length &&
      timingSafeEqual(provided, expected);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to sign in." },
      { status: 500 }
    );
  }
}