"use server";

import { db } from "@/lib/db";
import { compare } from "bcryptjs";

export async function loginAction(
  prevState: { message: string; type: string },
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { message: "Email and password are required.", type: "error" };
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { message: "Invalid email or password.", type: "error" };
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return { message: "Invalid email or password.", type: "error" };
    }

    db.session.add(user.id);
    db.activity.add(user.id, "Logged in", `User logged in from web`);

    return { message: "Login successful!", type: "success", user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  } catch {
    return { message: "Something went wrong.", type: "error" };
  }
}
