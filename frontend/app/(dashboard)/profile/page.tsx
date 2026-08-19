'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Phone, User, Building2, BadgeCheck, ShieldCheck } from 'lucide-react';
import { AuthUser, getSessionUser } from '@/lib/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getSessionUser());
  }, []);

  if (!user) return null;

  const details = [
    { label: 'Full Name', value: user.fullName, icon: User },
    { label: 'Email Address', value: user.email || 'Not provided', icon: Mail },
    { label: 'Phone Number', value: user.phone || 'Not provided', icon: Phone },
    { label: 'Workspace', value: user.workspaceName, icon: Building2 },
    { label: 'Role', value: user.roleTitle, icon: BadgeCheck },
    { label: 'Access Level', value: user.role === 'admin' ? 'Administrator' : 'Standard user', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
        <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
        <p className="text-xs text-slate-500 mt-1">Your signed-in account and workspace details.</p>
      </section>
      <section className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {details.map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <Icon className="w-5 h-5 text-slate-400" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">{value}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
