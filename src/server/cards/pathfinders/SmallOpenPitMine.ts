import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';

export class SmallOpenPitMine extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SMALL_OPEN_PIT_MINE,
      cost: 16,
      tags: [Tag.BUILDING],

      metadata: {
        cardNumber: 'Pf31',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(3)).or().production((pb) => pb.titanium(2));
        }),
        description: 'Increase your steel production 3 steps OR increase your titanium production 2 steps.',
      },
    });
  }

  public produce(player: IPlayer) {
    player.defer(() => {
      return new OrOptions(
        new SelectOption('Increase your steel production 2 steps').andThen(() => {
          player.production.add(Resource.STEEL, 3, {log: true});
          return undefined;
        }),
        new SelectOption('Increase your titanium production 1 step').andThen(() => {
          player.production.add(Resource.TITANIUM, 2, {log: true});
          return undefined;
        }));
    });
  }

  public override bespokePlay(player: IPlayer) {
    this.produce(player);
    return undefined;
  }
}

