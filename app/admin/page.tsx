"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/hooks/useAuth";
import { getUsers, getUserActivity } from "@/actions/admin-actions";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Activity {
  id: string;
  action: string;
  detail: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    const userActivities = await getUserActivity(user.id);
    setActivities(userActivities as Activity[]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Monitor users and platform activity</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Active Users</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">1</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Admins</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{users.filter((u) => u.role === "admin").length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Registered Users</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserClick(user)}
                className={`w-full text-left px-6 py-4 transition hover:bg-slate-50 ${
                  selectedUser?.id === user.id ? "bg-slate-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <span className="text-xs text-slate-400">Click to view activity</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedUser ? `${selectedUser.name}'s Activity` : "Select a user to view activity"}
            </h2>
          </div>
          <div className="p-6">
            {selectedUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{selectedUser.name}</p>
                    <p className="text-xs text-slate-500">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
                  {activities.length === 0 ? (
                    <p className="text-sm text-slate-500">No activity recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {activities.map((activity) => (
                        <div key={activity.id} className="rounded-lg border border-slate-100 p-3">
                          <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                          <p className="text-xs text-slate-500">{activity.detail}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Click on a user from the list to see their activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
