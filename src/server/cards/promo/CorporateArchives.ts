import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class CorporateArchives extends PreludeCard {
  constructor() {
    super({
      name: CardName.CORPORATE_ARCHIVES,
      tags: [Tag.SCIENCE],

      behavior: {
        drawCard: {count: 6, keep: 2},
        stock: {megacredits: 11},
      },

      metadata: {
        cardNumber: 'X39',
        description: 'Gain 11 M€.',
        renderData: CardRenderer.builder((b) => {
          b.text('Look at the top 6 cards from the deck. Take 2 of them into hand and discard the other 4.', Size.SMALL, true);
          b.br;
          b.megacredits(11);
        }),
      },
    });
  }
}
