const DELTA_ADIANTADO_PERCENT = 2;
const DELTA_ATRASADO_PERCENT  = -2;

export class ProgressoFisico {
  constructor(
    public readonly previsto:  number,
    public readonly realizado: number,
  ) {
    if (previsto  < 0 || previsto  > 100) throw new Error(`Previsto inválido: ${previsto}`);
    if (realizado < 0 || realizado > 100) throw new Error(`Realizado inválido: ${realizado}`);
    Object.freeze(this);
  }

  get delta(): number { return +(this.realizado - this.previsto).toFixed(2); }

  get status(): 'adiantado' | 'no_prazo' | 'atrasado' {
    if (this.delta >  DELTA_ADIANTADO_PERCENT) return 'adiantado';
    if (this.delta >= DELTA_ATRASADO_PERCENT)  return 'no_prazo';
    return 'atrasado';
  }

  toDTO() {
    return { previsto: this.previsto, realizado: this.realizado,
             delta: this.delta, status: this.status };
  }
}
