"use client";

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('[SyncDash] Supabase não configurado — sincronização em tempo real indisponível');
    return null;
  }

  client = createClient(url, key, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  
  return client;
}
