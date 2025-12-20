import {CorporationCard} from './CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {IActionCard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from './ICorporationCard';
import {Size} from '../../../common/cards/render/Size';
import {DrawCards} from '../../deferredActions/DrawCards'

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
            ce.action('Pay 5 M€ to draw a card with a requirement.', (eb) => {
              eb.megacredits(5).startAction.cards(1).asterix();
            });
          });
        }),
      },
    });
  }

  public getRequirementBonus(player: IPlayer): number {
    return 2;
  }

  // New action: Pay 5 MC to draw a card with a requirement
  public canAct(player: IPlayer): boolean {
    return player.canAfford(5);
  }

  public action(player: IPlayer) {
    player.pay(Payment.of({megacredits: 5}));
    
    // Draw a card with a requirement (similar to Xavier)
    const cardsWithRequirements = player.game.projectDeck.drawByCondition(
      player.game,
      (card) => {
        return card.requirements !== undefined && 
               card.requirements.length > 0;
      },
      {shuffle: true}
    );
    
    if (cardsWithRequirements.length > 0) {
      player.drawCard(1, {include: [cardsWithRequirements[0]]});
      player.game.log('${0} drew a card with a requirement', (b) => b.player(player));
    } else {
      // If no cards with requirements available, draw a normal card
      player.drawCard(1);
      player.game.log('${0} drew a card (no cards with requirements available)', (b) => b.player(player));
    }
    
    return undefined;
  }
}


