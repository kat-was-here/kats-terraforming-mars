import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class FueledGenerators extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.FUELED_GENERATORS,
      tags: [Tag.POWER, Tag.BUILDING],
      cost: 8,

      behavior: {
        production: {energy: 6, megacredits: -3},
      },

      metadata: {
        cardNumber: '100',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(3).br;
            pb.plus().energy(6);
          });
        }),
        description: 'Decrease your M€ production 3 steps and increase your energy production 6 steps.',
      },
    });
  }
}
