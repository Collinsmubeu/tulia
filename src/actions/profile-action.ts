"use server";

import { db } from "@/lib/db";
import { writeFileSync } from "fs";
import { join } from "path";

export async function updateProfileAction(userId: string, data: {
  name?: string;
  providerBio?: string;
  providerServices?: string[];
  isProvider?: boolean;
  location?: string;
  phone?: string;
  experience?: string;
  hourlyRate?: string;
  availability?: string;
  profileImage?: string;
}) {
  try {
    const users = await db.user.findMany();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { message: "User not found.", type: "error" };
    }

    const updatedUser = {
      ...users[userIndex],
      ...data,
    };

    const filtered = users.filter((u) => u.id !== userId);
    filtered.push(updatedUser);

    const dataFile = join(process.cwd(), "src", "lib", "data.json");
    writeFileSync(dataFile, JSON.stringify(filtered, null, 2), "utf-8");

    db.activity.add(userId, "Updated profile", "User updated their profile information");

    return { message: "Profile updated successfully!", type: "success", user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, isProvider: updatedUser.isProvider, providerBio: updatedUser.providerBio, providerServices: updatedUser.providerServices } };
  } catch {
    return { message: "Failed to update profile.", type: "error" };
  }
}
