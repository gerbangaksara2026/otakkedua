import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { CheckSquare, ArrowRight } from 'lucide-react';

export default async function LandingPage() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="absolute inset-0 z-40 bg-[#0a0a0a] overflow-y-auto w-full h-full text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[68.54rem] h-[61.8vh] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-[68.54rem] mx-auto">
        <div className="bg-blue-600/10 p-[1rem] rounded-2xl mb-[1.618rem] border border-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20">
          <CheckSquare className="w-8 h-8 text-blue-500" />
        </div>

        <h1 className="text-[2.618rem] md:text-[4.236rem] font-bold tracking-tight mb-[1.618rem] leading-[1.1]">
          Kosongkan Pikiranmu.<br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Biar Kami Yang Ingetin.
          </span>
        </h1>

        <p className="text-[1rem] md:text-[1.618rem] text-slate-400 mb-[2.618rem] max-w-[61.8%] leading-[1.618]">
          Task manager super simpel untuk mencatat apapun. Bereskan tugasmu, centang, dan biarkan kami menyingkirkannya dari pandanganmu.
        </p>

        <div className="flex gap-[1rem] md:gap-[1.618rem] flex-col sm:flex-row w-full sm:w-auto mt-2">
          <Link
            href="/auth/register"
            className="group relative px-[2.618rem] py-[1rem] bg-blue-600 hover:bg-blue-500 transition-all duration-300 rounded-xl font-medium text-[1rem] flex items-center justify-center gap-2 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] border border-blue-500/50"
          >
            <span>Mulai Sekarang - Gratis</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/auth/login"
            className="group px-[2.618rem] py-[1rem] bg-[#0f0f0f] hover:bg-slate-900 transition-all duration-300 rounded-xl font-medium text-[1rem] flex items-center justify-center gap-2 border border-slate-800 text-slate-300 hover:text-white"
          >
            <span>Masuk Akun</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
