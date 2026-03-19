import type { ProjetoId, EstadoFiltroDTO } from '@dashsync/shared';
import type { Projeto } from './Projeto.js';

export interface PortfolioRepository {
  findAll(): Promise<Projeto[]>;
  findById(id: ProjetoId): Promise<Projeto | null>;
  findByFiltro(filtro: EstadoFiltroDTO): Promise<Projeto[]>;
  reload(projetos: Projeto[]): void;
}
