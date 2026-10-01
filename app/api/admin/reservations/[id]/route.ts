import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const allowedStatuses = ["CONFIRMED", "REJECTED"] as const;

type AllowedStatus = (typeof allowedStatuses)[number];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const body = (await request.json()) as {
      status?: AllowedStatus;
    };

    if (!body.status || !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 }
      );
    }

    const existing = await prisma.reservation.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Réservation introuvable." },
        { status: 404 }
      );
    }

    if (existing.status !== "PENDING") {
      return NextResponse.json(
        { error: "Cette réservation a déjà été traitée." },
        { status: 409 }
      );
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({
      message:
        body.status === "CONFIRMED"
          ? "Réservation confirmée."
          : "Réservation refusée.",
      reservation,
    });
  } catch (error) {
    console.error("Reservation status update error:", error);

    return NextResponse.json(
      { error: "Impossible de mettre à jour la réservation." },
      { status: 500 }
    );
  }
}