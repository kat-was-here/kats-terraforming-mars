import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {all} from '../Options';
import {SelectCard} from '../../inputs/SelectCard';

export class CassiniStation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CASSINI_STATION,
      cost: 23,
      tags: [Tag.POWER, Tag.SCIENCE, Tag.SPACE],

      behavior: {
        production: {energy: {colonies: {colonies: {}}, all}},
      },

      metadata: {
        cardNumber: 'Pf62',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).slash().colonies(1, {all})).br;
          b.resource(CardResource.FLOATER, 2).asterix().br;
          b.resource(CardResource.DATA, 3).asterix();
        }),
        description: 'Increase your energy production 1 step for every colony in play. ' +
          'Add 2 floaters to ANY card AND add 3 data to ANY card.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const floaterCards = player.getResourceCards(CardResource.FLOATER);
    const dataCards = player.getResourceCards(CardResource.DATA);

    if (floaterCards.length === 0 && dataCards.length === 0) {
      return undefined;
    }

    // Always add both: 2 floaters and 3 data
    const floaterInput = floaterCards.length > 0
      ? new SelectCard('Select card to gain 2 floaters', 'Add floaters', floaterCards)
          .andThen(([card]) => {
            player.addResourceTo(card, {qty: 2, log: true});
            return undefined;
          })
      : undefined;

    const dataInput = dataCards.length > 0
      ? new SelectCard('Select card to gain 3 data', 'Add data', dataCards)
          .andThen(([card]) => {
            player.addResourceTo(card, {qty: 3, log: true});
            return undefined;
          })
      : undefined;

    if (floaterInput && dataInput) {
      // Chain both selections
      return floaterInput.andThen(() => dataInput);
    }
    return floaterInput ?? dataInput;
  }
}
