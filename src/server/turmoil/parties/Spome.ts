import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {IPolicy} from '../Policy';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {Tag} from '../../../common/cards/Tag';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {TITLES} from '../../inputs/titles';

export class Spome extends Party implements IParty {
  readonly name = PartyName.SPOME;
  readonly bonuses = [SPOME_BONUS_1, SPOME_BONUS_2];
  readonly policies = [SPOME_POLICY_1, SPOME_POLICY_2, SPOME_POLICY_3, SPOME_POLICY_4];
}

class SpomeBonus01 extends Bonus {
  readonly id = 'spb01' as const;
  readonly description = 'Gain 1 M€ for each different tag you have';

  getScore(player: IPlayer) {
    return player.tags.distinctCount('default');
  }

  grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player));
  }
}

class SpomeBonus02 extends Bonus {
  readonly id = 'spb02' as const;
  readonly description = 'Gain 1 M€ for each type of resource you have';

  getScore(player: IPlayer) {
    const standardResources = [
      Resource.MEGACREDITS,
      Resource.STEEL,
      Resource.TITANIUM,
      Resource.PLANTS,
      Resource.ENERGY,
      Resource.HEAT
    ].filter((res) => player.stock.get(res) > 0).length;
    
    const nonStandardResources = new Set(
      player.getCardsWithResources().map((card) => card.resourceType)
    ).size;

    return standardResources + nonStandardResources;
  }

  grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player));
  }
}

class SpomePolicy01 implements IPolicy {
  readonly id = 'spp01' as const;
  readonly description = 'When you raise Venus, gain 2 M€ per step raised';
}

class SpomePolicy02 implements IPolicy {
  readonly id = 'spp02' as const;
  readonly description = 'Pay 10 M€ to gain a trade fleet (Turmoil Spome)';

  canAct(player: IPlayer) {
    return player.canAfford(10) && player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.SPOME));
    
    game.defer(new SelectPaymentDeferred(player, 10, {title: TITLES.payForPartyAction(PartyName.SPOME)}))
      .andThen(() => {
        player.colonies.increaseFleetSize();
        player.turmoilPolicyActionUsed = true;
        game.log('${0} gained a trade fleet', (b) => b.player(player));
      });
    return undefined;
  }
}

class SpomePolicy03 implements IPolicy {
  readonly id = 'spp03' as const;
  readonly description = 'When you place a tile ON MARS, discard a card if possible';

  onTilePlaced(player: IPlayer) {
    if (player.cardsInHand.length > 0) {
      player.game.defer(new DiscardCards(player, 1));
    }
  }
}

class SpomePolicy04 implements IPolicy {
  readonly id = 'spp04' as const;
  readonly description = 'Pay 10 M€ to draw 2 planetary cards (Turmoil Spome)';

  canAct(player: IPlayer) {
    return player.canAfford(10) && player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.SPOME));
    
    game.defer(new SelectPaymentDeferred(player, 10, {title: TITLES.payForPartyAction(PartyName.SPOME)}))
      .andThen(() => {
        player.drawCard(2, {
          include: (card) => 
            card.tags.includes(Tag.VENUS) || 
            card.tags.includes(Tag.EARTH) || 
            card.tags.includes(Tag.JOVIAN),
        });
        player.turmoilPolicyActionUsed = true;
      });
    return undefined;
  }
}

export const SPOME_BONUS_1 = new SpomeBonus01();
export const SPOME_BONUS_2 = new SpomeBonus02();
export const SPOME_POLICY_1 = new SpomePolicy01();
export const SPOME_POLICY_2 = new SpomePolicy02();
export const SPOME_POLICY_3 = new SpomePolicy03();
export const SPOME_POLICY_4 = new SpomePolicy04();
