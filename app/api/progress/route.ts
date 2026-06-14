import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { berat } = await req.json();

    if (!berat) {
      return NextResponse.json({ message: "Berat is required" }, { status: 400 });
    }

    const log = await prisma.progressLog.create({
      data: {
        userId: (session.user as any).id,
        berat: Number(berat)
      }
    });

    return NextResponse.json({ message: "Progress logged successfully", log }, { status: 201 });
  } catch (error) {
    console.error("Save progress error:", error);
    return NextResponse.json({ message: "An error occurred while saving progress" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const progress = await prisma.progressLog.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { tanggal: 'asc' }
    });

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json({ message: "An error occurred while fetching progress" }, { status: 500 });
  }
}
