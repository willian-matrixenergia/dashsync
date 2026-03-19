import type {
  ProjetoId, ProgramaTipo, TendenciaCOD,
  ProjetoSummaryDTO, ProjetoDetailDTO, CronogramaItemDTO, DisciplinaMetricsDTO,
} from '@dashsync/shared';
import { Criticidade }    from './Criticidade.js';
import { ProgressoFisico } from './ProgressoFisico.js';

export interface CronogramaItemRaw {
  nome:      string;
  inicio:    Date;
  fim:       Date;
  previsto:  number;
  realizado: number;
}

export interface DisciplinaRaw {
  engenharia:      { previsto: number; realizado: number };
  suprimentos:     { previsto: number; realizado: number };
  construcao:      { previsto: number; realizado: number };
  comissionamento: { previsto: number; realizado: number };
}

export interface ProjetoRaw {
  id:                  string;
  nome:                string;
  programa:            ProgramaTipo;
  localidade:          string;
  coordenador:         string;
  supervisor:          string;
  progressoPrevisto:   number;
  progressoRealizado:  number;
  financeiroPrevisto:  number;
  financeiroRealizado: number;
  criticidade:         'baixo' | 'medio' | 'alto';
  codPrevisto:         Date;
  tendenciaCOD:        TendenciaCOD;
  potenciaMW:          number;
  cronograma:          CronogramaItemRaw[];
  disciplinas:         DisciplinaRaw;
}

export class Projeto {
  readonly id:                   ProjetoId;
  readonly nome:                 string;
  readonly programa:             ProgramaTipo;
  readonly localidade:           string;
  readonly coordenador:          string;
  readonly supervisor:           string;
  readonly progressoFisico:      ProgressoFisico;
  readonly progressoFinanceiro:  ProgressoFisico;
  readonly criticidade:          Criticidade;
  readonly cronograma:           ReadonlyArray<CronogramaItemRaw>;
  readonly disciplinas:          DisciplinaRaw;
  readonly codPrevisto:          Date;
  readonly tendenciaCOD:         TendenciaCOD;
  readonly potenciaMW:           number;

  private constructor(raw: ProjetoRaw) {
    this.id                  = raw.id as ProjetoId;
    this.nome                = raw.nome;
    this.programa            = raw.programa;
    this.localidade          = raw.localidade;
    this.coordenador         = raw.coordenador;
    this.supervisor          = raw.supervisor;
    this.progressoFisico     = new ProgressoFisico(raw.progressoPrevisto, raw.progressoRealizado);
    this.progressoFinanceiro = new ProgressoFisico(raw.financeiroPrevisto, raw.financeiroRealizado);
    this.criticidade         = new Criticidade(raw.criticidade);
    this.cronograma          = raw.cronograma;
    this.disciplinas         = raw.disciplinas;
    this.codPrevisto         = raw.codPrevisto;
    this.tendenciaCOD        = raw.tendenciaCOD;
    this.potenciaMW          = raw.potenciaMW;
  }

  static reconstituir(raw: ProjetoRaw): Projeto {
    return new Projeto(raw);
  }

  toSummaryDTO(): ProjetoSummaryDTO {
    return {
      id:                  this.id,
      nome:                this.nome,
      programa:            this.programa,
      localidade:          this.localidade,
      coordenador:         this.coordenador,
      supervisor:          this.supervisor,
      progressoFisico:     this.progressoFisico.toDTO(),
      progressoFinanceiro: this.progressoFinanceiro.toDTO(),
      criticidade:         this.criticidade.nivel,
      codPrevisto:         this.codPrevisto.toISOString(),
      tendenciaCOD:        this.tendenciaCOD,
      potenciaMW:          this.potenciaMW,
    };
  }

  toDetailDTO(): ProjetoDetailDTO {
    const cronogramaDTO: CronogramaItemDTO[] = this.cronograma.map(c => {
      const pf = new ProgressoFisico(c.previsto, c.realizado);
      const duracaoDias = Math.ceil((c.fim.getTime() - c.inicio.getTime()) / 86_400_000);
      return {
        nome: c.nome, inicio: c.inicio.toISOString(), fim: c.fim.toISOString(),
        progressoFisico: pf.toDTO(), duracaoDias,
      };
    });

    const disc = this.disciplinas;
    const disciplinas: DisciplinaMetricsDTO = {
      engenharia:      new ProgressoFisico(disc.engenharia.previsto,      disc.engenharia.realizado).toDTO(),
      suprimentos:     new ProgressoFisico(disc.suprimentos.previsto,     disc.suprimentos.realizado).toDTO(),
      construcao:      new ProgressoFisico(disc.construcao.previsto,      disc.construcao.realizado).toDTO(),
      comissionamento: new ProgressoFisico(disc.comissionamento.previsto, disc.comissionamento.realizado).toDTO(),
    };

    return { ...this.toSummaryDTO(), cronograma: cronogramaDTO, disciplinas };
  }
}
