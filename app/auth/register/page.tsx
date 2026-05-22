'use client';

import { useActionState } from 'react';
import { registerUser } from '@/app/actions/auth';
import { CheckSquare, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 transition-colors py-3 rounded-xl font-medium flex items-center justify-center gap-2"
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Daftar'}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center p-4 text-slate-100">
      <div className="w-full max-w-md bg-[#0f0f0f] border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
        <Link href="/" className="absolute top-8 left-8 text-slate-500 hover:text-slate-300">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-500/10 p-3 rounded-full mb-4">
            <CheckSquare className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold">Daftar Akun Baru</h2>
          <p className="text-slate-400 text-sm mt-1 text-center">
            Pendaftar pertama otomatis menjadi Admin.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-[#0a0a0a] border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full bg-[#0a0a0a] border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm text-center">
              {state.success}
            </div>
          )}

          {!state?.success && <SubmitButton />}
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 font-medium">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
