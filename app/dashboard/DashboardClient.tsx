'use client';

import { useActionState, useState, useRef } from 'react';
import { addTask, toggleTask, deleteTask } from '@/app/actions/tasks';
import { logoutUser } from '@/app/actions/auth';
import { useFormStatus } from 'react-dom';
import { CheckSquare, Home, User, Plus, Circle, CheckCircle2, Trash2, ChevronDown, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-xl w-12 flex items-center justify-center transition-colors shadow-lg shadow-blue-500/20"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}

export default function DashboardClient({ initialTasks, user }: { initialTasks: any[], user: any }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const activeTasks = initialTasks.filter(t => !t.completed);
  const completedTasks = initialTasks.filter(t => t.completed);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-slate-100 overflow-hidden w-full">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-[#0f0f0f] border-r border-slate-800">
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="bg-blue-600 p-2.5 rounded-lg shadow-lg shadow-blue-500/20">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            INGETIN
          </h1>
        </div>

        <nav className="flex flex-col gap-2 px-4 flex-1">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2 ml-2">Utama</div>
          <button className="flex items-center px-4 py-3 text-blue-400 bg-blue-600/10 border border-blue-500/20 rounded-lg w-full justify-start transition-colors font-medium">
            <Home className="w-5 h-5 mr-3" /> Tugas Harian
          </button>
          
          {user.role === 'ADMIN' && (
            <div className="pt-4">
              <div className="text-[10px] uppercase tracking-widest text-blue-500 font-semibold mb-2 ml-2">Administrator</div>
              <Link href="/admin" className="flex items-center px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg w-full justify-start transition-colors font-medium">
                <Shield className="w-5 h-5 mr-3" /> Admin Panel
              </Link>
            </div>
          )}
        </nav>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 relative group">
            <div className="flex items-center overflow-hidden">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-full mr-3 flex items-center justify-center font-bold text-sm text-white">
                <User className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-sm font-semibold block text-white truncate pr-2">{user.email}</span>
                <span className="text-[10px] text-slate-500 block truncate uppercase tracking-tighter">{user.role === 'ADMIN' ? 'Super Administrator' : 'User'}</span>
              </div>
            </div>
            <button 
              onClick={() => logoutUser()} 
              className="text-slate-500 hover:text-red-400 ml-2 transition-colors" 
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Header Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-500" />
            <h1 className="text-xl font-bold tracking-tight text-white">INGETIN</h1>
          </div>
          <button onClick={() => logoutUser()} className="text-slate-400 hover:text-red-400">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {user.role === 'ADMIN' && (
          <div className="md:hidden p-2 bg-[#0f0f0f] border-b border-slate-800 text-center">
             <Link href="/admin" className="text-slate-400 hover:text-blue-400 text-sm flex justify-center items-center gap-2 font-medium">
                <Shield className="w-4 h-4"/> Buka Admin Panel
             </Link>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 pb-28 md:pb-10">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 hidden md:block">
              <h2 className="text-3xl font-bold text-slate-100">Fokus Hari Ini</h2>
              <p className="text-slate-400 mt-2 text-lg">Catat sekarang, selesaikan nanti.</p>
            </div>

            <form
              ref={formRef}
              action={async (formData) => {
                const text = formData.get('text') as string;
                if (!text.trim()) return;
                await addTask(text);
                formRef.current?.reset();
              }}
              className="mb-8 relative group"
            >
              <input
                type="text"
                name="text"
                placeholder="Apa yang perlu diselesaikan?"
                required
                className="w-full bg-[#0f0f0f] border border-slate-800 text-slate-100 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-blue-500 transition-all shadow-lg placeholder:text-slate-600 text-lg"
                autoComplete="off"
              />
              <SubmitButton />
            </form>

            {/* Active Tasks List */}
            <div className="space-y-3 mb-10 min-h-[100px]">
              {activeTasks.length === 0 ? (
                <div className="text-center py-12 border border-slate-800 bg-[#0f0f0f] rounded-2xl">
                  <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
                    <CheckCircle2 className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 font-medium text-lg">Tidak ada tugas aktif.</p>
                  <p className="text-slate-500 text-sm mt-1">Waktunya bersantai atau tambah tugas baru!</p>
                </div>
              ) : (
                activeTasks.map(task => (
                  <div key={task.id} className="group flex items-center justify-between p-4 bg-[#0f0f0f] border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-all">
                    <button
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="flex items-center gap-4 flex-1 text-left"
                    >
                      <span className="text-slate-500 hover:text-white transition-colors focus:outline-none">
                        <Circle className="w-6 h-6" />
                      </span>
                      <span className="text-slate-200 text-lg select-none flex-1">{task.text}</span>
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-500 hover:text-red-400 p-2 md:opacity-0 group-hover:opacity-100 transition-all focus:outline-none"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px bg-slate-800 flex-1"></div>
                  <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    <span>{completedTasks.length} Selesai</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCompleted ? 'rotate-180' : ''}`} />
                  </button>
                  <div className="h-px bg-slate-800 flex-1"></div>
                </div>

                <div className={`space-y-3 transition-opacity duration-300 ${showCompleted ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                  {completedTasks.map(task => (
                    <div key={task.id} className="group flex items-center justify-between p-4 bg-[#0f0f0f]/40 border border-slate-800/50 rounded-2xl opacity-60 hover:opacity-100 transition-all">
                      <button
                        onClick={() => toggleTask(task.id, task.completed)}
                        className="flex items-center gap-4 flex-1 text-left"
                      >
                        <span className="text-blue-500 hover:text-slate-400 transition-colors focus:outline-none">
                          <CheckCircle2 className="w-6 h-6" />
                        </span>
                        <span className="text-slate-500 text-lg line-through select-none flex-1">{task.text}</span>
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-500 hover:text-red-400 p-2 transition-colors focus:outline-none"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navbar Mobile (Bottom) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-slate-800 flex justify-around p-3 pb-6 z-30">
        <button className="flex flex-col items-center text-blue-500 w-full">
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Tugas</span>
        </button>
        <button className="flex flex-col items-center text-slate-500 w-full">
          <User className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </nav>
    </div>
  );
}
