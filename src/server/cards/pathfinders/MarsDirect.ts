import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class MarsDirect extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.MARS_DIRECT,
      tags: [Tag.MARS],
      startingMegaCredits: 48,

      firstAction: {
        text: 'Draw a card with a Mars tag',
        drawCard: {count: 1, tag: Tag.MARS}, // 
      },

      metadata: {
        description: 'You start with 48 M€. As your first action, draw a card with a Mars tag.',
        cardNumber: 'PFC11',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48).cards(1, {secondaryTag: Tag.MARS}).br;
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a Mars tag, you pay 1 M€ less for each Mars tag you have.', (eb) => {
              eb.tag(Tag.MARS).startEffect.megacredits(1).slash().tag(Tag.MARS);
            });
          });
        }),
      },
    });
  }

  public override getCardDiscount(player: IPlayer, card: IProjectCard) {
    if (card.tags.indexOf(Tag.MARS) === -1) {
      return 0;
    }
    return player.tags.count(Tag.MARS);
  }
}
