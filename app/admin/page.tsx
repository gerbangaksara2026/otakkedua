import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getUsers } from '@/app/actions/admin';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/login');
  }

  if (session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await getUsers();

  return <AdminClient users={users} currentUser={session} />;
}
