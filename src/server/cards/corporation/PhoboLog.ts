import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';
import {ICorporationCard} from './ICorporationCard';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class PhoboLog extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.PHOBOLOG,
      tags: [Tag.SPACE],
      startingMegaCredits: 23,
      
      behavior: {
        stock: {titanium: 10},
        titanumValue: 1,
      },

      metadata: {
        cardNumber: 'R09',
        description: 'You start with 10 titanium and 23 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(23).nbsp.titanium(10, {digit});
          b.corpBox('effect', (ce) => {
            ce.effect('Your titanium resources are each worth 1 M€ extra.', (eb) => {
              eb.titanium(1).startEffect.plus(Size.SMALL).megacredits(1);
            });
          });
          b.corpBox('action', (ce) => {
            ce.action('Pay 8 M€ (titanium may be used) to draw a Space card.', (eb) => {
              eb.megacredits(8).startAction.cards(1, {tag: Tag.SPACE});
            });
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.canAfford({cost: 8, titanium: true});
  }

  public action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used ${1} action', (b) => b.player(player).card(this));
    
    game.defer(new SelectPaymentDeferred(player, 8, {
      title: 'Select how to pay 8 M€',
      canUseTitanium: true,
    }))
      .andThen(() => player.drawCard(1, {tag: Tag.SPACE}));
    
    return undefined;
  }
}
