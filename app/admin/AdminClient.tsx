'use client';

import { toggleUserActiveStatus, toggleUserRole, deleteUser } from '@/app/actions/admin';
import { Shield, ArrowLeft, User, CheckCircle2, XCircle, Trash2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminClient({ users, currentUser }: { users: any[], currentUser: any }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col">
      <header className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold tracking-tight text-white">ADMIN PANEL</h1>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 flex-1 max-w-6xl mx-auto w-full">
        <div className="bg-[#0f0f0f] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-slate-100">Manajemen Pengguna</h2>
            <p className="text-slate-500 text-sm mt-1">Aktifkan, nonaktifkan, atau ubah role pengguna.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Tanggal Daftar</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-800 p-2 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-100 text-sm">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(u.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter border ${
                        u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter border ${
                        u.isActive === 1 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {u.isActive === 1 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.isActive === 1 ? 'Aktif' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.id !== currentUser.userId && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => toggleUserActiveStatus(u.id, u.isActive)}
                              className={`text-sm font-semibold transition-colors ${
                                u.isActive === 1 ? 'text-slate-500 hover:text-white' : 'text-blue-500 hover:text-blue-400 mr-2'
                              }`}
                            >
                              {u.isActive === 1 ? 'Nonaktifkan' : 'Aktivasi'}
                            </button>
                            {u.role !== 'ADMIN' && (
                                <button
                                    onClick={() => toggleUserRole(u.id, u.role)}
                                    className="text-sm font-semibold text-purple-500 hover:text-purple-400 ml-4 transition-colors"
                                >
                                    Jadikan Admin
                                </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm('Yakin ingin menghapus user ini?')) {
                                  deleteUser(u.id);
                                }
                              }}
                              className="text-sm font-semibold text-red-500 hover:text-red-400 ml-4 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
