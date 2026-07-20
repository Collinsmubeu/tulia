import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const services = await db.service.findMany();
    return NextResponse.json(services);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
