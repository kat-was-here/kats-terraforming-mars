import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';

export class NuclearPower extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NUCLEAR_POWER,
      tags: [Tag.POWER, Tag.BUILDING],
      cost: 10,

      metadata: {
        cardNumber: '045',
        renderData: CardRenderer.builder((b) => {
          b.or().br;
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().energy(3);
          }).br;
          b.or().br;
          b.production((pb) => {
            pb.minus().heat(2).br;
            pb.plus().energy(3);
          });
        }),
        description: 'Decrease either your M€ production 2 steps OR your heat production 2 steps, and increase your energy production 3 steps.',
      },
    });
  }

  public override play(player: IPlayer) {
    return new OrOptions(
      new SelectOption('Decrease M€ production by 2, increase energy production by 3', 'MC → Energy').andThen(() => {
        player.production.add(Resource.MEGACREDITS, -2);
        player.production.add(Resource.ENERGY, 3);
        player.game.log('${0} decreased M€ production by 2 and increased energy production by 3', (b) => b.player(player));
        return undefined;
      }),
      new SelectOption('Decrease heat production by 2, increase energy production by 3', 'Heat → Energy').andThen(() => {
        player.production.add(Resource.HEAT, -2);
        player.production.add(Resource.ENERGY, 3);
        player.game.log('${0} decreased heat production by 2 and increased energy production by 3', (b) => b.player(player));
        return undefined;
      }),
    );
  }
}
