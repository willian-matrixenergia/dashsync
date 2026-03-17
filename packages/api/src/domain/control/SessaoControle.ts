import type { SessaoId, ProjetoId, EcrãAtivo, EstadoFiltroDTO, EstadoSessaoDTO } from '@dashsync/shared';
import { filtroVazio, type DomainEvent } from '@dashsync/shared';
import { ProjetoSelecionado, FiltroAplicado, EcrãSelecionado } from '@dashsync/shared';

export class SessaoControle {
  private _projetoSelecionado: ProjetoId | null = null;
  private _filtros: EstadoFiltroDTO = filtroVazio();
  private _ecrãAtivo: EcrãAtivo = 'portfolio';
  private _events: DomainEvent[] = [];

  constructor(public readonly id: SessaoId) {}

  static criar(): SessaoControle {
    return new SessaoControle(crypto.randomUUID() as SessaoId);
  }

  selecionarProjeto(projetoId: ProjetoId): void {
    this._projetoSelecionado = projetoId;
    this._events.push(new ProjetoSelecionado(this.id, projetoId));
  }

  aplicarFiltro(filtro: EstadoFiltroDTO): void {
    this._filtros = filtro;
    this._events.push(new FiltroAplicado(this.id, filtro));
  }

  navegarEcrã(ecrã: EcrãAtivo): void {
    this._ecrãAtivo = ecrã;
    this._events.push(new EcrãSelecionado(this.id, ecrã));
  }

  get estado(): EstadoSessaoDTO {
    return {
      sessaoId:           this.id,
      projetoSelecionado: this._projetoSelecionado,
      filtros:            this._filtros,
      ecrãAtivo:          this._ecrãAtivo,
      ultimaAtualizacao:  new Date().toISOString(),
    };
  }

  get domainEvents(): DomainEvent[] { return [...this._events]; }
  clearEvents(): void { this._events = []; }
}
