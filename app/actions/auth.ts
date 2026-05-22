'use server';

import { revalidatePath } from 'next/cache';
import getDb, { isFirstUser } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password || password.length < 6) {
    return { error: 'Email and password (min 6 chars) are required.' };
  }

  try {
    const existing = getDb().prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return { error: 'Email is already registered.' };
    }

    const isFirst = isFirstUser();
    const role = isFirst ? 'ADMIN' : 'USER';
    const isActive = isFirst ? 1 : 0; // Admin is auto-active, others need activation
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const createdAt = Date.now();

    getDb().prepare(`
      INSERT INTO users (id, email, passwordHash, role, isActive, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, email, passwordHash, role, isActive, createdAt);

    if (isFirst) { // auto login for the first admin
      await createSession(id, email, role);
      redirect('/dashboard');
    }

    return { success: 'Registered successfully. Please wait for an admin to activate your account.' };
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    return { error: error.message || 'Something went wrong.' };
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter your email and password.' };
  }

  try {
    const user = getDb().prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return { error: 'Invalid credentials.' };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { error: 'Invalid credentials.' };
    }

    if (user.isActive !== 1) {
      return { error: 'Your account has not been activated by an admin yet.' };
    }

    await createSession(user.id, user.email, user.role);
    redirect('/dashboard'); // Will jump to catch block if NEXT_REDIRECT
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    return { error: error.message || 'Something went wrong.' };
  }
}

export async function logoutUser() {
  await deleteSession();
  redirect('/');
}
