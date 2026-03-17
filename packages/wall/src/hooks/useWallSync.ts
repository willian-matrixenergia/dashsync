import { useEffect, useRef, useState, useCallback } from 'react';
import type { EstadoSessaoDTO, ServerMessage } from '@dashsync/shared';
import { filtroVazio } from '@dashsync/shared';

const RECONNECT_BASE_MS = 1000;
const MAX_RECONNECT_MS  = 16000;
const WS_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/control?role=wall`;

const ESTADO_INICIAL: EstadoSessaoDTO = {
  sessaoId:           '' as EstadoSessaoDTO['sessaoId'],
  projetoSelecionado: null,
  filtros:            filtroVazio(),
  ecrãAtivo:          'portfolio',
  ultimaAtualizacao:  new Date().toISOString(),
};

export interface WallSyncState {
  estado:        EstadoSessaoDTO;
  connected:     boolean;
  dataUpdatedAt: string | null;
}

export function useWallSync(): WallSyncState {
  const [estado, setEstado]              = useState<EstadoSessaoDTO>(ESTADO_INICIAL);
  const [connected, setConnected]        = useState(false);
  const [dataUpdatedAt, setDataUpdatedAt] = useState<string | null>(null);
  const wsRef       = useRef<WebSocket | null>(null);
  const retryDelay  = useRef(RECONNECT_BASE_MS);
  const retryTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      retryDelay.current = RECONNECT_BASE_MS;
    };

    ws.onmessage = (ev: MessageEvent<string>) => {
      const msg = JSON.parse(ev.data) as ServerMessage;
      if (msg.type === 'STATE_SYNC')    setEstado(msg.estado);
      if (msg.type === 'DATA_UPDATED')  setDataUpdatedAt(msg.timestamp);
    };

    ws.onclose = () => {
      setConnected(false);
      retryTimer.current = setTimeout(() => {
        retryDelay.current = Math.min(retryDelay.current * 2, MAX_RECONNECT_MS);
        connect();
      }, retryDelay.current);
    };

    ws.onerror = () => ws.close();
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { estado, connected, dataUpdatedAt };
}
