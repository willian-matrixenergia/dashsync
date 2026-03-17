import type { ProjetoId, EvolucaoSemanalDTO } from '@dashsync/shared';

export interface ProgressoRepository {
  findEvolucaoSemanal(id: ProjetoId): Promise<EvolucaoSemanalDTO | null>;
  reload(data: EvolucaoSemanalDTO[]): void;
}

export class InMemoryProgressoRepository implements ProgressoRepository {
  private data: Map<ProjetoId, EvolucaoSemanalDTO> = new Map();

  async findEvolucaoSemanal(id: ProjetoId): Promise<EvolucaoSemanalDTO | null> {
    return this.data.get(id) ?? null;
  }

  reload(items: EvolucaoSemanalDTO[]): void {
    this.data.clear();
    for (const item of items) this.data.set(item.projetoId, item);
  }
}
