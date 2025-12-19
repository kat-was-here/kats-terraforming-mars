import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Phase} from '../../../common/Phase';

export class Aerotech extends CorporationCard {
  constructor() {
    super({
      name: CardName.AEROTECH,
      tags: [Tag.SPACE],
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'R59',
        description: 'You start with 48 M€. During each round\'s research phase, gain 1 titanium for each card you do not buy.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48);
          b.corpBox('effect', (ce) => {
            ce.effect('During each round\'s research phase, gain 1 titanium for each card you do not buy.', (eb) => {
              eb.cards(1).startEffect.titanium(1).asterix();
            });
          });
        }),
      },
    });
  }

  public static onDrawCards(player: IPlayer, cards: IProjectCard[], selected: IProjectCard[]) {
    if (player.game.phase === Phase.RESEARCH && player.pickedCorporationCard?.name === CardName.AEROTECH) {
      player.stock.add(Resource.TITANIUM, cards.length - selected.length, {log: true});
    }
    return undefined;
  }
}