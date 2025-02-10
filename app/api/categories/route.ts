// import prisma from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
// Dummy categories with dynamic fields structure
const dummyCategories = [
  {
    id: "6531a7f8d4e8b1a9f3e2b1a1",
    name: "Integrated Circuits",
    fields: [
      { name: "ic_code", type: "string", label: "IC Code" },
      { name: "voltage_rating", type: "number", label: "Voltage Rating (V)" },
      { name: "package_type", type: "string", label: "Package Type" },
    ],
  },
  {
    id: "6531a7f8d4e8b1a9f3e2b1a2",
    name: "Resistors",
    fields: [
      { name: "resistance", type: "number", label: "Resistance (Ω)" },
      { name: "tolerance", type: "number", label: "Tolerance (%)" },
      { name: "power_rating", type: "number", label: "Power Rating (W)" },
    ],
  },
  {
    id: "6531a7f8d4e8b1a9f3e2b1a3",
    name: "Capacitors",
    fields: [
      { name: "capacitance", type: "number", label: "Capacitance (F)" },
      { name: "voltage_rating", type: "number", label: "Voltage Rating (V)" },
      { name: "dielectric_type", type: "string", label: "Dielectric Type" },
    ],
  },
];

export async function GET() {
  // const categories = await prisma.category.findMany();
  // return NextResponse.json(categories);
  return NextResponse.json(dummyCategories);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🚀 ~ POST ~ body:", body);
    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }
    const { name, fields } = body;

    console.log("🚀 ~ POST ~ name, fields:", name, fields);
    if (!name || !fields) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = { name, attributeDefinitions: fields };
    console.log("🚀 ~ POST ~ payload:", payload);

    const category = await prisma.category
      .create({ data: payload })
      .catch((error) => {
        console.error("Prisma error:", error);
        throw new Error("Database error");
      });
    console.log("🚀 ~ POST ~ category:", category);

    return NextResponse.json({ message: "Category created", category });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const productCount = await prisma.category.count({ where: { id } });

  if (productCount > 0) {
    return NextResponse.json(
      { message: "Cannot delete: Products exist" },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ message: "Category deleted" });
}
