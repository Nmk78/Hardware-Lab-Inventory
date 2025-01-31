import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  }

  
export async function POST(req: NextRequest) {
  try {
    const { name, fields } = await req.json();

    const category = await prisma.category.create({
      data: { name, fields },
    });

    return NextResponse.json({ message: "Category created", category });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    const productCount = await prisma.product.count({ where: { categoryId: id } });
  
    if (productCount > 0) {
      return NextResponse.json({ message: "Cannot delete: Products exist" }, { status: 400 });
    }
  
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Category deleted" });
  }