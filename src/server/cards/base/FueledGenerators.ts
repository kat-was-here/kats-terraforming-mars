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
      cost: 10,

      behavior: {
        production: {energy: 5, megacredits: -5},
      },

      metadata: {
        cardNumber: '100',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(5).br;
            pb.plus().energy(5);
          });
        }),
        description: 'Decrease your M€ production 5 steps and increase your energy production 5 steps.',
      },
    });
  }
}
