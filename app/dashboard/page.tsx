import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getTasks } from '@/app/actions/tasks';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/login');
  }

  const initialTasks = await getTasks();

  return <DashboardClient initialTasks={initialTasks} user={session} />;
}
