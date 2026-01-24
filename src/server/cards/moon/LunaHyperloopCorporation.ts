import {CardName} from '../../../common/cards/CardName';
import {all} from '../Options';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {ActiveCorporationCard} from '../corporation/CorporationCard';

export class LunaHyperloopCorporation extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.LUNA_HYPERLOOP_CORPORATION,
      tags: [Tag.MOON, Tag.BUILDING],
      startingMegaCredits: 28,

      firstAction: {
        text: 'Place a road tile on the Moon',
        moon: {roadTile: {}},
      },

      behavior: {
        stock: {steel: 10},
      },

      action: {
        stock: {megacredits: {moon: {road: {}}, all}},
      },

      victoryPoints: {moon: {road: {}}, all},

      metadata: {
        description: 'You start with 28 M€ and 10 steel.',
        cardNumber: 'MC4',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(28).steel(10).br;
          b.action('Gain 2 M€ for each road tile on The Moon.', (eb) => {
            eb.empty().startAction.megacredits(2).slash().moonRoad({all});
          }).br;
          b.vpText('1 VP for each road tile on The Moon.').br;
        }),
      },
    });
  }
}