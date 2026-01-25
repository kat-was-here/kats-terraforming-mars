import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';

export class Stefan extends CeoCard {
  constructor() {
    super({
      name: CardName.STEFAN,
      metadata: {
        cardNumber: 'L19',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().megacredits(5).colon().cards(5);
          b.nbsp.text('THEN SELL').cards(1).asterix().colon().megacredits(3);
        }),
        description: 'Once per game, pay 5 M€ to draw 5 cards, then sell any number of cards from your hand for 3 M€ each.',
      },
    });
  }

  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.canAfford(5);
  }

  public action(player: IPlayer): PlayerInput | undefined {
    const game = player.game;
    
    // Pay 5 M€ immediately
    if (!player.canAfford(5)) {
      return undefined;
    }
    
    player.megaCredits -= 5;
    player.drawCard(5);
    game.log('${0} paid 5 M€ and drew 5 cards', (b) => b.player(player));
    
    // Disable the CEO immediately so it can't be used again
    this.isDisabled = true;
    
    // Now return the sell cards prompt
    return new SelectCard<IProjectCard>(
      'Sell patents for 3 M€ each',
      'Sell',
      player.cardsInHand,
      {min: 0, max: player.cardsInHand.length}
    ).andThen((cards) => {
      if (cards.length > 0) {
        player.megaCredits += cards.length * 3;
        cards.forEach((card) => {
          player.discardCardFromHand(card);
        });
        game.log('${0} sold ${1} patents for ${2} M€', (b) => 
          b.player(player).number(cards.length).number(cards.length * 3)
        );
      } else {
        game.log('${0} did not sell any patents', (b) => b.player(player));
      }
      return undefined;
    });
  }
}