"use server";

import { db } from "@/lib/db";

export async function getUsers() {
  const users = await db.user.findMany();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return users.map(({ password: _password, ...rest }) => rest);
}

export async function getActiveUsers() {
  const activeIds = await db.session.activeIds();
  const allUsers = await db.user.findMany();
  const activeUsers = allUsers.filter((u) => activeIds.includes(u.id));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return activeUsers.map(({ password: _password, ...rest }) => rest);
}

export async function getActiveCount() {
  return db.session.activeCount();
}

export async function getUserActivity(userId: string) {
  return db.activity.findByUser(userId);
}
