import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
  // Dummy categories with dynamic fields structure
  const dummyProducts = [
    {
      id: "7551b6f9e2c4d5a8f7e3b2c1",
      name: "SN7400 Quad NAND Gate",
      categoryId: "6531a7f8d4e8b1a9f3e2b1a1",
      attributes: {
        ic_code: "SN7400",
        voltage_rating: 5,
        package_type: "DIP-14"
      }
    },
    {
      id: "7551b6f9e2c4d5a8f7e3b2c2",
      name: "1/4W Carbon Film Resistor",
      categoryId: "6531a7f8d4e8b1a9f3e2b1a2",
      attributes: {
        resistance: 1000,
        tolerance: 5,
        power_rating: 0.25
      }
    },
    {
      id: "7551b6f9e2c4d5a8f7e3b2c3",
      name: "100µF Electrolytic Capacitor",
      categoryId: "6531a7f8d4e8b1a9f3e2b1a3",
      attributes: {
        capacitance: 0.0001,
        voltage_rating: 50,
        dielectric_type: "Aluminum Electrolytic"
      }
    }
  ];

export async function GET() {
    // const categories = await prisma.category.findMany();
    // return NextResponse.json(categories);
    return NextResponse.json(dummyProducts);
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