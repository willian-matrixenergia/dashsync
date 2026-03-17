import type { ProjetoId, EstadoFiltroDTO } from '@dashsync/shared';
import type { PortfolioRepository } from '../../domain/portfolio/PortfolioRepository.js';
import type { Projeto } from '../../domain/portfolio/Projeto.js';

export class InMemoryPortfolioRepository implements PortfolioRepository {
  private projetos: Map<ProjetoId, Projeto> = new Map();

  async findAll(): Promise<Projeto[]> {
    return Array.from(this.projetos.values());
  }

  async findById(id: ProjetoId): Promise<Projeto | null> {
    return this.projetos.get(id) ?? null;
  }

  async findByFiltro(filtro: EstadoFiltroDTO): Promise<Projeto[]> {
    const all = Array.from(this.projetos.values());
    return all.filter(p => {
      if (!filtro.programas.includes(p.programa))          return false;
      if (!filtro.criticidades.includes(p.criticidade.nivel)) return false;
      if (filtro.coordenador && p.coordenador !== filtro.coordenador) return false;
      if (filtro.supervisor  && p.supervisor  !== filtro.supervisor)  return false;
      if (filtro.busca) {
        const q = filtro.busca.toLowerCase();
        const match = p.nome.toLowerCase().includes(q) ||
                      p.localidade.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }

  reload(projetos: Projeto[]): void {
    this.projetos.clear();
    for (const p of projetos) this.projetos.set(p.id, p);
  }
}
