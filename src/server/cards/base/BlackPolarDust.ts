import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class BlackPolarDust extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.BLACK_POLAR_DUST,
      cost: 15,

      behavior: {
        ocean: {},
        production: {megacredits: -2, titanium: 1}, // changed from heat: 3 → titanium: 1
      },

      metadata: {
        cardNumber: '022',
        description: 'Place an ocean tile. Decrease your M€ production 2 steps and increase your titanium production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().titanium(1); // updated to titanium
          }).oceans(1);
        }),
      },
    });
  }
}
