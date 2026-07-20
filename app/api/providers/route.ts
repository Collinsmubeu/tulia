import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const users = await db.user.findMany();
    const providers = users.filter((u) => u.isProvider).map(({ password: _password, ...rest }) => rest);
    return NextResponse.json(providers);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
