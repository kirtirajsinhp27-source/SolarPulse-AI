'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Loader2,
  Radio,
  Server,
  Wifi,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://solarpulse-api.onrender.com';

export default function AddInverterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    inverter_id: '',
    name: '',
    manufacturer: '',
    model: '',
    rated_capacity_kw: '',
    connection_type: 'Modbus TCP',
    host: '',
    port: '502',
    unit_id: '1',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setSuccess(false);

    if (!form.inverter_id.trim()) {
      setError('Please enter an inverter ID.');
      return;
    }

    if (!form.name.trim()) {
      setError('Please enter an inverter name.');
      return;
    }

    if (!form.manufacturer.trim()) {
      setError('Please enter the manufacturer.');
      return;
    }

    if (!form.model.trim()) {
      setError('Please enter the inverter model.');
      return;
    }

    if (!form.rated_capacity_kw || Number(form.rated_capacity_kw) <= 0) {
      setError('Please enter a valid rated capacity.');
      return;
    }

    if (
      form.connection_type === 'Modbus TCP' &&
      !form.host.trim()
    ) {
      setError('Please enter the inverter IP address / host.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/inverters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inverter_id: form.inverter_id.trim(),
          name: form.name.trim(),
          manufacturer: form.manufacturer.trim(),
          model: form.model.trim(),
          rated_capacity_kw: Number(form.rated_capacity_kw),
          connection_type: form.connection_type,
          host: form.host.trim() || null,
          port: form.port.trim() || null,
          unit_id: form.unit_id.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || 'Unable to register the inverter.'
        );
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/monitoring');
        router.refresh();
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while registering the inverter.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-5"
        >
          <ArrowLeft size={17} />
          Back to Monitoring
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Cpu size={21} />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Add Inverter
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Register a new inverter with SolarPulse
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Connection Ready
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Server size={18} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Inverter Configuration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter the identification and communication details of the inverter.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            {/* Inverter ID */}
            <FormField
              label="Inverter ID"
              required
              placeholder="e.g. INV-05"
              value={form.inverter_id}
              onChange={(value) => updateField('inverter_id', value)}
            />

            {/* Name */}
            <FormField
              label="Inverter Name"
              required
              placeholder="e.g. Inverter #05"
              value={form.name}
              onChange={(value) => updateField('name', value)}
            />

            {/* Manufacturer */}
            <FormField
              label="Manufacturer"
              required
              placeholder="e.g. Sungrow"
              value={form.manufacturer}
              onChange={(value) => updateField('manufacturer', value)}
            />

            {/* Model */}
            <FormField
              label="Model"
              required
              placeholder="e.g. SG50CX"
              value={form.model}
              onChange={(value) => updateField('model', value)}
            />

            {/* Capacity */}
            <FormField
              label="Rated Capacity"
              required
              type="number"
              placeholder="e.g. 50"
              suffix="kW"
              value={form.rated_capacity_kw}
              onChange={(value) =>
                updateField('rated_capacity_kw', value)
              }
            />

            {/* Connection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Connection Type <span className="text-rose-500">*</span>
              </label>

              <select
                value={form.connection_type}
                onChange={(event) =>
                  updateField('connection_type', event.target.value)
                }
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="Modbus TCP">Modbus TCP</option>
                <option value="Modbus RTU">Modbus RTU</option>
                <option value="MQTT">MQTT</option>
                <option value="API">API</option>
              </select>
            </div>

            {/* Host */}
            <FormField
              label="Host / IP Address"
              placeholder="e.g. 192.168.1.105"
              value={form.host}
              onChange={(value) => updateField('host', value)}
            />

            {/* Port */}
            <FormField
              label="Port"
              placeholder="e.g. 502"
              value={form.port}
              onChange={(value) => updateField('port', value)}
            />

            {/* Unit ID */}
            <FormField
              label="Unit ID"
              placeholder="e.g. 1"
              value={form.unit_id}
              onChange={(value) => updateField('unit_id', value)}
            />
          </div>

          {/* Connection information */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Wifi className="text-slate-600 mt-0.5" size={18} />

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Telemetry Connection
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  These communication details identify the inverter or gateway
                  that SolarPulse will use for telemetry integration.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={18} />
              Inverter registered successfully. Returning to Monitoring...
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || success}
              className="h-11 px-5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Radio size={17} />
                  Save Inverter
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  required = false,
  type = 'text',
  placeholder,
  value,
  onChange,
  suffix,
}: {
  label: string;
  required?: boolean;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 ${
            suffix ? 'pr-12' : ''
          } text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-100`}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}