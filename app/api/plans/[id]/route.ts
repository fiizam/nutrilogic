import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Plan ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existingPlan = await prisma.nutritionPlan.findUnique({
      where: { id }
    });

    if (!existingPlan || existingPlan.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Plan not found or unauthorized" }, { status: 404 });
    }

    await prisma.nutritionPlan.delete({
      where: { id }
    });

    // Check if the user has any other plans left
    const remainingPlans = await prisma.nutritionPlan.count({
      where: { userId: existingPlan.userId }
    });

    // If no plans left, clear all progress logs as requested
    if (remainingPlans === 0) {
      await prisma.progressLog.deleteMany({
        where: { userId: existingPlan.userId }
      });
    }

    return NextResponse.json({ message: "Plan deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete plan error:", error);
    return NextResponse.json({ message: "An error occurred while deleting the plan" }, { status: 500 });
  }
}
