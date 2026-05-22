'use server';

import getDb from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

async function requireUser() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getTasks() {
  const session = await requireUser();
  return getDb().prepare('SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC').all(session.userId);
}

export async function addTask(text: string) {
  const session = await requireUser();
  if (!text || text.trim() === '') return;

  const id = crypto.randomUUID();
  getDb().prepare(`
    INSERT INTO tasks (id, userId, text, completed, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, session.userId, text.trim(), 0, Date.now());

  revalidatePath('/dashboard');
}

export async function toggleTask(taskId: string, currentStatus: number) {
  await requireUser();
  const newStatus = currentStatus === 1 ? 0 : 1;
  getDb().prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(newStatus, taskId);
  revalidatePath('/dashboard');
}

export async function deleteTask(taskId: string) {
  await requireUser();
  getDb().prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  revalidatePath('/dashboard');
}
