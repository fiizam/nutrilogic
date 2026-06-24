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

    const { planData, nama } = await req.json();

    if (!planData) {
      return NextResponse.json({ message: "Plan data is required" }, { status: 400 });
    }

    // Save the plan
    const plan = await prisma.nutritionPlan.create({
      data: {
        userId: (session.user as any).id,
        nama: nama || null,
        data: JSON.stringify(planData)
      }
    });

    return NextResponse.json({ message: "Plan saved successfully", planId: plan.id }, { status: 201 });
  } catch (error) {
    console.error("Save plan error:", error);
    return NextResponse.json({ message: "An error occurred while saving the plan" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.nutritionPlan.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ plans }, { status: 200 });
  } catch (error) {
    console.error("Get plans error:", error);
    return NextResponse.json({ message: "An error occurred while fetching plans" }, { status: 500 });
  }
}
