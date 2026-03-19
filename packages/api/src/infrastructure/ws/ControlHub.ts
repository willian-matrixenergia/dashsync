import type { WebSocket } from '@fastify/websocket';
import type { ControlMessage, ServerMessage, EstadoSessaoDTO } from '@dashsync/shared';
import { SessaoControle } from '../../domain/control/SessaoControle.js';
import type { SessaoId, EcraAtivo, EstadoFiltroDTO, ProjetoId } from '@dashsync/shared';

type Client = { ws: WebSocket; role: 'wall' | 'tablet' | 'unknown' };

export class ControlHub {
  private clients = new Set<Client>();
  private sessao: SessaoControle = SessaoControle.criar();

  addClient(ws: WebSocket, role: Client['role'] = 'unknown'): void {
    const client: Client = { ws, role };
    this.clients.add(client);
    this.sendTo(client, { type: 'STATE_SYNC', estado: this.sessao.estado });

    ws.on('message', (raw: Buffer) => {
      const msg = this.parseMessage(raw);
      if (!msg) return;
      this.handleMessage(msg, client);
    });

    ws.on('close', () => { this.clients.delete(client); });
  }

  private handleMessage(msg: ControlMessage, _from: Client): void {
    switch (msg.type) {
      case 'SELECT_PROJECT':
        this.sessao.selecionarProjeto(msg.projetoId as ProjetoId);
        break;
      case 'APPLY_FILTER':
        this.sessao.aplicarFiltro(msg.filtro as EstadoFiltroDTO);
        break;
      case 'NAVIGATE_SCREEN':
        this.sessao.navegarEcra(msg.ecra as EcraAtivo);
        break;
      case 'PING':
        return;
      case 'RELOAD_DATA':
        break;
      default:
        return;
    }
    this.broadcast({ type: 'STATE_SYNC', estado: this.sessao.estado });
    this.sessao.clearEvents();
  }

  broadcastDataUpdated(timestamp: Date): void {
    this.broadcast({ type: 'DATA_UPDATED', timestamp: timestamp.toISOString() });
  }

  getEstado(): EstadoSessaoDTO {
    return this.sessao.estado;
  }

  private broadcast(msg: ServerMessage): void {
    const payload = JSON.stringify(msg);
    for (const client of this.clients) {
      if (client.ws.readyState === client.ws.OPEN) {
        client.ws.send(payload);
      }
    }
  }

  private sendTo(client: Client, msg: ServerMessage): void {
    if (client.ws.readyState === client.ws.OPEN) {
      client.ws.send(JSON.stringify(msg));
    }
  }

  private parseMessage(raw: Buffer): ControlMessage | null {
    try {
      return JSON.parse(raw.toString()) as ControlMessage;
    } catch {
      return null;
    }
  }
}
