'use server';

import { signOut } from '@/src/lib/auth';

export async function handleSignOut() {
  await signOut({ redirectTo: '/login' });
}
