'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, Activity, Database } from 'lucide-react';
import { AuthUser, getSessionUser } from '@/lib/auth';

export default function AdminPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getSessionUser());
  }, []);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">Admin Control Center</h2>
            <p className="text-xs text-slate-500 mt-1">Restricted to administrator accounts.</p>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Account Access', value: 'Admin only', icon: Users },
          { label: 'Telemetry Service', value: 'Online', icon: Activity },
          { label: 'Data Source', value: 'Excel + Database', icon: Database },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5">
            <Icon className="w-5 h-5 text-slate-400" />
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-4">{label}</div>
            <div className="text-lg font-bold text-slate-900 mt-1">{value}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
