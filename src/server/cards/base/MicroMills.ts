import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';

export class MicroMills extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      name: CardName.MICRO_MILLS,
      type: CardType.ACTIVE,

      metadata: {
        cardNumber: '164',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 microbe from ANY card to gain 3 heat.', (eb) => {
            eb.empty().startAction.minus().resource(CardResource.MICROBE).asterix().nbsp.plus().heat(3);
          }).br;
          b.or().br;
          b.action('Spend 5 heat to add 1 microbe to ANY card.', (eb) => {
            eb.empty().startAction.minus().heat(3).nbsp.plus().resource(CardResource.MICROBE);
          });
        }),
        description: {
          text: 'Action: Spend 1 microbe from any card to gain 3 heat, OR spend 3 heat to add 1 microbe to any card.',
          align: 'left',
        },
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    // Can act if player has at least 1 microbe somewhere OR at least 3 heat
    return player.getCardsWithResources(CardResource.MICROBE).length > 0 || player.heat >= 3;
  }

  public action(player: IPlayer) {
    return new OrOptions(
      // Option 1: Spend 1 microbe → gain 3 heat
      new SelectOption('Spend 1 microbe from any card to gain 3 heat', 'Gain heat').andThen(() => {
        return new SelectCard('Select card to remove 1 microbe from', 'Select', player.getCardsWithResources(CardResource.MICROBE))
          .andThen(([card]) => {
            player.removeResourceFrom(card);
            player.stock.add(Resource.HEAT, 3);
            player.game.log('${0} removed 1 microbe from ${1} to gain 3 heat', (b) => b.player(player).card(card));
            return undefined;
          });
      }),

      // Option 2: Spend 5 heat → add 1 microbe to any card
      new SelectOption('Spend 5 heat to add 1 microbe to any card', 'Add microbe').andThen(() => {
        player.stock.deduct(Resource.HEAT, 5);
        player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {
          title: 'Add 1 microbe to any card',
        }));
        return undefined;
      }),
    );
  }
}
