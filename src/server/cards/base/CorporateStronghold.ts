import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CorporateStronghold extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CORPORATE_STRONGHOLD,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 18,

      behavior: {
        production: {megacredits: 2},
        city: {},
      },
      victoryPoints: -1,

      metadata: {
        cardNumber: '182',
        description: 'Increase your M€ production 2 steps. Place a city tile.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plus().megacredits(2);
          }).nbsp.nbsp.city();
        }),
      },
    });
  }
}
