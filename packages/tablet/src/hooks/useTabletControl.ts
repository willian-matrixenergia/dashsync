import { useCallback, useEffect, useRef, useState } from 'react';
import type { ControlMessage, EstadoSessaoDTO, ServerMessage, EcrãAtivo, EstadoFiltroDTO, ProjetoId, SessaoId } from '@dashsync/shared';
import { filtroVazio } from '@dashsync/shared';

const WS_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/control?role=tablet`;
const RECONNECT_BASE_MS = 1000;
const MAX_RECONNECT_MS  = 16000;

export function useTabletControl() {
  const wsRef      = useRef<WebSocket | null>(null);
  const retryDelay = useRef(RECONNECT_BASE_MS);
  const sessaoId   = useRef<SessaoId | null>(null);

  const [connected, setConnected] = useState(false);
  const [estado, setEstado]       = useState<EstadoSessaoDTO>({
    sessaoId:           '' as SessaoId,
    projetoSelecionado: null,
    filtros:            filtroVazio(),
    ecrãAtivo:          'portfolio',
    ultimaAtualizacao:  new Date().toISOString(),
  });

  const send = useCallback((msg: ControlMessage) => {
    const ws = wsRef.current;
    if (ws?.readyState === ws?.OPEN) ws!.send(JSON.stringify(msg));
  }, []);

  const selecionarProjeto = useCallback((projetoId: ProjetoId) => {
    if (!sessaoId.current) return;
    send({ type: 'SELECT_PROJECT', sessaoId: sessaoId.current, projetoId });
  }, [send]);

  const aplicarFiltro = useCallback((filtro: EstadoFiltroDTO) => {
    if (!sessaoId.current) return;
    send({ type: 'APPLY_FILTER', sessaoId: sessaoId.current, filtro });
  }, [send]);

  const navegarEcrã = useCallback((ecrã: EcrãAtivo) => {
    if (!sessaoId.current) return;
    send({ type: 'NAVIGATE_SCREEN', sessaoId: sessaoId.current, ecrã });
  }, [send]);

  const recarregarDados = useCallback(() => {
    send({ type: 'RELOAD_DATA' });
  }, [send]);

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        retryDelay.current = RECONNECT_BASE_MS;
      };

      ws.onmessage = (ev: MessageEvent<string>) => {
        const msg = JSON.parse(ev.data) as ServerMessage;
        if (msg.type === 'STATE_SYNC') {
          setEstado(msg.estado);
          sessaoId.current = msg.estado.sessaoId;
        }
      };

      ws.onclose = () => {
        setConnected(false);
        retryTimer = setTimeout(() => {
          retryDelay.current = Math.min(retryDelay.current * 2, MAX_RECONNECT_MS);
          connect();
        }, retryDelay.current);
      };

      ws.onerror = () => ws.close();
    }

    connect();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      wsRef.current?.close();
    };
  }, []);

  return { connected, estado, selecionarProjeto, aplicarFiltro, navegarEcrã, recarregarDados };
}
