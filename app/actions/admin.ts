'use server';

import getDb from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getUsers() {
  await checkAdmin();
  return getDb().prepare('SELECT id, email, role, isActive, createdAt FROM users ORDER BY createdAt DESC').all();
}

export async function toggleUserActiveStatus(userId: string, currentStatus: number) {
  await checkAdmin();
  const newStatus = currentStatus === 1 ? 0 : 1;
  getDb().prepare('UPDATE users SET isActive = ? WHERE id = ?').run(newStatus, userId);
  revalidatePath('/admin');
}

export async function toggleUserRole(userId: string, currentRole: string) {
  await checkAdmin();
  const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
  getDb().prepare('UPDATE users SET role = ? WHERE id = ?').run(newRole, userId);
  revalidatePath('/admin');
}

export async function deleteUser(userId: string) {
  await checkAdmin();
  getDb().prepare('DELETE FROM users WHERE id = ?').run(userId);
  revalidatePath('/admin');
}
