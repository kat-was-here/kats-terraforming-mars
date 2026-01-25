import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CarbonateProcessing extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CARBONATE_PROCESSING,
      tags: [Tag.BUILDING],
      cost: 6, // updated cost

      behavior: {
        production: {energy: -1, megacredits: 1}, // changed to MC production
        stock: {heat: 3}, // immediate heat gain
      },

      metadata: {
        cardNumber: '043',
        description: 'Decrease your energy production 1 step, increase your M€ production 1 step, and gain 3 heat.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(1);
          });
          b.br;
          b.heat(3); // immediate heat gain
        }),
      },
    });
  }
}
