import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedTimes = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

type ReservationBody = {
  date?: string;
  time?: string;
  guests?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  occasion?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReservationBody;

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const date = body.date?.trim();
    const time = body.time?.trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !date ||
      !time ||
      typeof body.guests !== "number"
    ) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return NextResponse.json(
        { error: "Le prénom et le nom sont invalides." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    if (phone.length < 6) {
      return NextResponse.json(
        { error: "Numéro de téléphone invalide." },
        { status: 400 }
      );
    }

    if (body.guests < 1 || body.guests > 12) {
      return NextResponse.json(
        { error: "Le nombre de convives doit être compris entre 1 et 12." },
        { status: 400 }
      );
    }

    if (!allowedTimes.includes(time)) {
      return NextResponse.json(
        { error: "Horaire de réservation invalide." },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Date de réservation invalide." },
        { status: 400 }
      );
    }

    const reservationDate = new Date(`${date}T12:00:00.000Z`);

    if (Number.isNaN(reservationDate.getTime())) {
      return NextResponse.json(
        { error: "Date de réservation invalide." },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        date: reservationDate,
        time,
        guests: body.guests,
        occasion: body.occasion?.trim() || null,
        notes: body.notes?.trim() || null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Votre demande de réservation a bien été reçue.",
        reservation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reservation creation error:", error);

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de l'envoi de votre réservation.",
      },
      { status: 500 }
    );
  }
}