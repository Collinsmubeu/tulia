import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isProvider: boolean;
  providerBio: string;
  providerServices: string[];
  createdAt: string;
  profileImage?: string;
};

export type Session = {
  userId: string;
  loginAt: string;
};

export type Activity = {
  id: string;
  userId: string;
  action: string;
  detail: string;
  createdAt: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  isActive: boolean;
};

const dataFile = join(process.cwd(), "src", "lib", "data.json");
const sessionFile = join(process.cwd(), "src", "lib", "sessions.json");
const activityFile = join(process.cwd(), "src", "lib", "activities.json");
const servicesFile = join(process.cwd(), "src", "lib", "services.json");

function readJson<T>(path: string, fallback: T): T {
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, "utf-8")) as T;
    }
  } catch {
    // ignore
  }
  return fallback;
}

function writeJson(path: string, data: unknown) {
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  user: {
    create: async (data: { data: Omit<User, "id" | "createdAt"> }) => {
      const all = readJson<User[]>(dataFile, []);
      const user = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...data.data };
      all.push(user);
      writeJson(dataFile, all);
      return user;
    },
    findUnique: async (params: { where: { email: string } }) => {
      const all = readJson<User[]>(dataFile, []);
      return all.find((u) => u.email === params.where.email) ?? null;
    },
    findMany: async () => {
      const all = readJson<User[]>(dataFile, []);
      return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  },
  session: {
    add: (userId: string) => {
      const sessions = readJson<Session[]>(sessionFile, []);
      sessions.push({ userId, loginAt: new Date().toISOString() });
      writeJson(sessionFile, sessions);
    },
    remove: (userId: string) => {
      const sessions = readJson<Session[]>(sessionFile, []);
      const filtered = sessions.filter((s) => s.userId !== userId);
      writeJson(sessionFile, filtered);
    },
    activeIds: async () => {
      const sessions = readJson<Session[]>(sessionFile, []);
      return sessions.map((s) => s.userId);
    },
    activeCount: async () => {
      const sessions = readJson<Session[]>(sessionFile, []);
      return new Set(sessions.map((s) => s.userId)).size;
    },
  },
  activity: {
    add: (userId: string, action: string, detail: string) => {
      const activities = readJson<Activity[]>(activityFile, []);
      activities.push({ id: crypto.randomUUID(), userId, action, detail, createdAt: new Date().toISOString() });
      writeJson(activityFile, activities);
    },
    findByUser: async (userId: string) => {
      const activities = readJson<Activity[]>(activityFile, []);
      return activities.filter((a) => a.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  },
  service: {
    findMany: async () => {
      const services = readJson<Service[]>(servicesFile, []);
      return services.filter((s) => s.isActive);
    },
    findById: async (id: string) => {
      const services = readJson<Service[]>(servicesFile, []);
      return services.find((s) => s.id === id) ?? null;
    },
  },
};
