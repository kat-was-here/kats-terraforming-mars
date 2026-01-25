import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {IPolicy, Policy} from '../Policy';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {TITLES} from '../../inputs/titles';

export class Transhumans extends Party implements IParty {
  readonly name = PartyName.TRANSHUMANS;
  readonly bonuses = [TRANSHUMANS_BONUS_1, TRANSHUMANS_BONUS_2];
  readonly policies = [TRANSHUMANS_POLICY_1, TRANSHUMANS_POLICY_2, TRANSHUMANS_POLICY_3, TRANSHUMANS_POLICY_4];
}

class TranshumansBonus01 extends Bonus {
  readonly id = 'tb01' as const;
  readonly description = 'Gain 1 M€ for each card with requirements you have played';

  getScore(player: IPlayer) {
    return player.tableau.filter((card) => card.requirements !== undefined && card.requirements.length > 0).length;
  }

  grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player));
  }
}

class TranshumansBonus02 extends Bonus {
  readonly id = 'tb02' as const;
  readonly description = 'Gain 2 M€ for each card with no tags you have played';

  getScore(player: IPlayer) {
    return player.tableau.filter((card) => card.tags.length === 0).length * 2;
  }

  grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player));
  }
}

class TranshumansPolicy01 extends Policy {
  readonly id = 'tp01' as const;
  readonly description = 'Gain 1 wild tag for this generation';

  override onPolicyStartForPlayer(_player: IPlayer): void {
    // This would require a flag on player to track wild tag
    // For now, this is a placeholder
    // player.hasWildTag = true;
  }

  override onPolicyEndForPlayer(_player: IPlayer): void {
    // player.hasWildTag = false;
  }
}

class TranshumansPolicy02 implements IPolicy {
  readonly id = 'tp02' as const;
  readonly description = 'Spend 10 M€ to gain 1 influence (Turmoil Transhumans)';

  canAct(player: IPlayer) {
    return player.canAfford(10) && player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    const game = player.game;
    
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.TRANSHUMANS));
    
    game.defer(new SelectPaymentDeferred(player, 10, {title: TITLES.payForPartyAction(PartyName.TRANSHUMANS)}))
      .andThen(() => {
        game.turmoil!.addInfluenceBonus(player, 1);
        game.log('${0} gained 1 influence', (b) => b.player(player));
        player.turmoilPolicyActionUsed = true;
      });

    return undefined;
  }
}

class TranshumansPolicy03 implements IPolicy {
  readonly id = 'tp03' as const;
  readonly description = 'Spend 10 M€ to play a card from hand, ignoring global requirements (Turmoil Transhumans)';

  canAct(player: IPlayer) {
    return player.canAfford(10) && player.cardsInHand.length > 0 && player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.TRANSHUMANS));
    
    game.defer(new SelectPaymentDeferred(player, 10, {title: TITLES.payForPartyAction(PartyName.TRANSHUMANS)}))
      .andThen(() => {
        // This would require special card play logic that ignores global requirements
        // Placeholder for now - would need PlayProjectCard with special flag
        game.log('${0} can play a card ignoring global requirements', (b) => b.player(player));
        player.turmoilPolicyActionUsed = true;
      });

    return undefined;
  }
}

class TranshumansPolicy04 implements IPolicy {
  readonly id = 'tp04' as const;
  readonly description = 'When you trade, you may first increase that Colony Tile track 1 step';
}

export const TRANSHUMANS_BONUS_1 = new TranshumansBonus01();
export const TRANSHUMANS_BONUS_2 = new TranshumansBonus02();
export const TRANSHUMANS_POLICY_1 = new TranshumansPolicy01();
export const TRANSHUMANS_POLICY_2 = new TranshumansPolicy02();
export const TRANSHUMANS_POLICY_3 = new TranshumansPolicy03();
export const TRANSHUMANS_POLICY_4 = new TranshumansPolicy04();
