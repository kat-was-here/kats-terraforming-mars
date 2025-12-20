import {CorporationCard} from './CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from './ICorporationCard';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class Inventrix extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.INVENTRIX,
      tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.VENUS],
      startingMegaCredits: 45,
      globalParameterRequirementBonus: {steps: 2},
      
      firstAction: {
        text: 'Draw 3 cards',
        drawCard: 3,
      },

      metadata: {
        cardNumber: 'R43',
        description: 'As your first action in the game, draw 3 cards. Start with 45 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(45).nbsp.cards(3);
          b.corpBox('effect', (ce) => {
            ce.effect('Your temperature, oxygen, ocean, and Venus requirements are +2 or -2 steps, your choice in each case.', (eb) => {
              eb.plate('Global requirements').startEffect.text('+/- 2');
            });
          });
          b.corpBox('action', (ce) => {
            ce.action('Pay 5 M€ to draw a card.', (eb) => {
              eb.megacredits(5).startAction.cards(1);
            });
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.canAfford(5);
  }

  public action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used ${1} action', (b) => b.player(player).card(this));
    
    game.defer(new SelectPaymentDeferred(player, 5, {
      title: 'Select how to pay 5 M€',
    }))
      .andThen(() => player.drawCard(1));
    
    return undefined;
  }
}