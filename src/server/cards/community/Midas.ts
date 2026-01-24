import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IActionCard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';
import { Tag } from '@/common/cards/Tag';

export class Midas extends CorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.MIDAS,
      tags: [Tag.JOVIAN],
      startingMegaCredits: 132,
      
      behavior: {
        tr: -7,
      },

      metadata: {
        cardNumber: 'R41',
        description: 'You start with 132 M€. Lower your TR 7 steps.',
        renderData: CardRenderer.builder((b) => {
          b.vSpace(Size.LARGE).br;
          b.megacredits(132, {size: Size.LARGE}).nbsp.nbsp.nbsp;
          b.minus().tr(7);
          b.br;
          b.action('Discard a card from hand to gain 3 M€.', (ab) => {
            ab.cards(1).startAction.megacredits(3);
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.cardsInHand.length > 0;
  }

  public action(player: IPlayer) {
    return new SelectCard<IProjectCard>(
      'Select a card to discard',
      'Discard',
      player.cardsInHand,
      {min: 1, max: 1}
    ).andThen((cards) => {
      const card = cards[0];
      player.discardCardFromHand(card);
      player.megaCredits += 5;
      player.game.log('${0} discarded ${1} to gain 5 M€', (b) => 
        b.player(player).card(card)
      );
      return undefined;
    });
  }
}