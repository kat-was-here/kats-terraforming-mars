import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';

export class Pluto extends Colony {
  constructor() {
    super({
      name: ColonyName.PLUTO,
      build: {
        description: 'Draw 1 cards',
        type: ColonyBenefit.DRAW_CARDS,
        quantity: [1, 1, 1],
      },
      trade: {
        description: 'Draw n cards',
        type: ColonyBenefit.DRAW_CARDS,
        quantity: [0, 0, 1, 1, 2, 2, 3],
      },
      colony: {
        description: 'Draw 1 card and then discard 1 card',
        type: ColonyBenefit.DRAW_CARDS_AND_DISCARD_ONE,
      },
    });
  }
}
