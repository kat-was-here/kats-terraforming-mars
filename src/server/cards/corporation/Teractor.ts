import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from './ICorporationCard';

export class Teractor extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.TERACTOR,
      tags: [Tag.EARTH],
      startingMegaCredits: 52,
      
      behavior: {
        production: {megacredits: 1},
      },

      cardDiscount: {tag: Tag.EARTH, amount: 3},
      metadata: {
        cardNumber: 'R30',
        description: 'You start with 1 M€ production and 52 M€.',
         renderData: CardRenderer.builder((b) => {
          b.br;
          b.br;
          b.production((pb) => pb.megacredits(1)).megacredits(52);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an Earth tag, you pay 3 M€ less for it.', (eb) => {
              eb.tag(Tag.EARTH).startEffect.megacredits(-3);
      });
    });
  }),
      },
    });
  }
}
