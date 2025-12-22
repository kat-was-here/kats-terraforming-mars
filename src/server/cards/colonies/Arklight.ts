import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {ICard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';

export class Arklight extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.ARKLIGHT,
      tags: [Tag.ANIMAL],
      startingMegaCredits: 45,
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}, per: 2},
      
      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'R04',
        description: 'You start with 45 M€ and 2M€ production. 1 VP per 2 animals on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(45).nbsp.production((pb) => pb.megacredits(2));
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an animal or plant tag, including this, add 1 animal to this card.', (eb) => {
              eb.tag(Tag.ANIMAL).slash().tag(Tag.PLANT).startEffect.resource(CardResource.ANIMAL);
            });
            ce.vSpace();
            ce.effect('When you gain an animal to ANY card, gain 1 M€.', (eb) => {
              eb.resource(CardResource.ANIMAL).asterix().startEffect.megacredits(1);
            });
          });
        }),
      },
    });
  }

  public onNonCardTagAdded(player: IPlayer, tag: Tag): void {
    if (tag === Tag.PLANT) {
      player.addResourceTo(this, {qty: 1, log: true});
    }
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard): void {
    const qty = card.tags.filter((cardTag) => cardTag === Tag.ANIMAL || cardTag === Tag.PLANT).length;
    if (qty > 0) {
      player.addResourceTo(this, {qty: qty, log: true});
    }
  }

  // Meat Industry effect
  public onResourceAdded(player: IPlayer, card: ICard, count: number): void {
    if (card.resourceType === CardResource.ANIMAL && count > 0) {
      player.stock.add(Resource.MEGACREDITS, count, {log: true});
    }
  }
}