import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class BreathingFilters extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.BREATHING_FILTERS,
      tags: [Tag.SCIENCE],
      cost: 11,
      victoryPoints: 2,

      requirements: {oxygen: 7},
      metadata: {
        description: 'Requires 7% oxygen. When played, remove 2 microbes from any cards.',
        cardNumber: '114',
        renderData: CardRenderer.builder((b) => {
          b.effect('Remove 2 microbes from any cards.', (eb) => {
            eb.resource(CardResource.MICROBE, {all}).minus().text('2');
          });
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    // Defer the removal of 2 microbes from any card(s)
    player.game.defer(new RemoveResourcesFromCard(player, CardResource.MICROBE, 2, {log: true}));
    return undefined;
  }
}
