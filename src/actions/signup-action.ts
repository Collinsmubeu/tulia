"use server";

import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function signupAction(
  prevState: { message: string; type: string },
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const isProvider = formData.get("isProvider") === "true";

  if (!name || !email || !password) {
    return { message: "All fields are required.", type: "error" };
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { message: "Email already exists.", type: "error" };
    }

    const hashedPassword = await hash(password, 12);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
        isProvider: isProvider || false,
        providerBio: "",
        providerServices: [],
      },
    });

    db.activity.add(user.id, "Signed up", `User created account from ${formData.get("_action") || "web"}`);

    return { message: "Account created! Please log in.", type: "success" };
  } catch {
    return { message: "Failed to create account.", type: "error" };
  }
}
