"use client";

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('[SyncDash] Verificando Supabase config:', {
    hasUrl: !!url,
    hasKey: !!key,
    url: url ? `${url.substring(0, 20)}...` : 'undefined',
  });

  if (!url || !key) {
    console.warn('[SyncDash] Supabase não configurado — sincronização em tempo real indisponível');
    console.warn('[SyncDash] NEXT_PUBLIC_SUPABASE_URL:', url ? 'presente' : 'AUSENTE');
    console.warn('[SyncDash] NEXT_PUBLIC_SUPABASE_ANON_KEY:', key ? 'presente' : 'AUSENTE');
    return null;
  }

  client = createClient(url, key, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  
  console.log('[SyncDash] Supabase client criado com sucesso');
  return client;
}
