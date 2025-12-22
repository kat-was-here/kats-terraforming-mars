import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {ActiveCorporationCard} from '../corporation/CorporationCard';

export class Aristarchus extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.ARISTARCHUS,
      tags: [Tag.VENUS, Tag.EARTH, Tag.JOVIAN, Tag.MARS],
      startingMegaCredits: 39,

      metadata: {
        cardNumber: 'R50',
        description: 'You start with 33 M€. Action: If you have exactly 0 M€, gain 10 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(39);
          b.corpBox('action', (ce) => {
            ce.action('If you have exactly 0 M€, gain 10 M€', (eb) => {
              eb.empty().startAction.megacredits(10).asterix();
            });
          });
        }),
      },
    });
  }

  public override bespokeCanAct(player: IPlayer): boolean {
    return player.megaCredits === 0;
  }

  public override bespokeAction(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, 10);
    return undefined;
  }
}