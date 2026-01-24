import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class EarthElevator extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 40,
      tags: [Tag.SPACE, Tag.EARTH],
      name: CardName.EARTH_ELEVATOR,
      type: CardType.AUTOMATED,
      victoryPoints: 3,

      behavior: {
        production: {titanium: 3},
      },

      metadata: {
        description: 'Increase your titanium production 3 steps.',
        cardNumber: 'C08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(3));
        }),
      },
    });
  }
}
