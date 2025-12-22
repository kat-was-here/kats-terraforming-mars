import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IActionCard} from '../ICard';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class CrescentResearchAssociation extends CorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.CRESCENT_RESEARCH_ASSOCIATION,
      tags: [Tag.SCIENCE, Tag.MOON],
      startingMegaCredits: 50,
      victoryPoints: {tag: Tag.MOON, per: 3},

      metadata: {
        description: 'You start with 50 M€. 1 VP for every 3 Moon tags you have.',
        cardNumber: 'MC5',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(50).br;
          b.effect('When you play a Moon tag, you pay 1 M€ less for each Moon tag you have.', (eb) => {
            eb.tag(Tag.MOON).startEffect.megacredits(1).slash().tag(Tag.MOON);
          });
          b.br;
          b.action('Pay 6 M€ to draw a Moon card (only on even generations).', (eb) => {
            eb.megacredits(6).startAction.cards(1, {tag: Tag.MOON});
          });
        }),
      },
    });
  }

  public override getCardDiscount(player: IPlayer, card: IProjectCard) {
    if (card.tags.indexOf(Tag.MOON) === -1) {
      return 0;
    }
    return player.tags.count(Tag.MOON);
  }

  public canAct(player: IPlayer): boolean {
    // Check if player can afford 9 M€
    if (!player.canAfford(9)) {
      return false;
    }
    
    // Check if current generation is even (2, 4, 6, 8, 10, 12, 14)
    const generation = player.game.generation;
    const evenGenerations = [2, 4, 6, 8, 10, 12, 14];
    return evenGenerations.includes(generation);
  }

  public action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used ${1} action', (b) => b.player(player).card(this));
    
    game.defer(new SelectPaymentDeferred(player, 9, {
      title: 'Select how to pay 6 M€',
    }))
      .andThen(() => player.drawCard(1, {tag: Tag.MOON}));
    
    return undefined;
  }
}