import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      orderBy: [
        {
          date: "asc",
        },
        {
          time: "asc",
        },
      ],
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Failed to fetch reservations:", error);

    return NextResponse.json(
      { error: "Impossible de charger les réservations." },
      { status: 500 }
    );
  }
}