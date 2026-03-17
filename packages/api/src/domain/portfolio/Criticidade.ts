import type { NivelCriticidade } from '@dashsync/shared';

export class Criticidade {
  constructor(public readonly nivel: NivelCriticidade) {
    Object.freeze(this);
  }
  get isAlto(): boolean { return this.nivel === 'alto'; }
}
