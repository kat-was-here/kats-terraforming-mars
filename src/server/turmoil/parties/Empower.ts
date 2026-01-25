import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {IPolicy} from '../Policy';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Tag} from '../../../common/cards/Tag';
import {TITLES} from '../../inputs/titles';

export class Empower extends Party implements IParty {
  readonly name = PartyName.EMPOWER;
  readonly bonuses = [EMPOWER_BONUS_1, EMPOWER_BONUS_2];
  readonly policies = [EMPOWER_POLICY_1, EMPOWER_POLICY_2, EMPOWER_POLICY_3, EMPOWER_POLICY_4];
}

class EmpowerBonus01 extends Bonus {
  readonly id = 'eb01' as const;
  readonly description = 'Gain 2 M€ for each Power tag you have';

  getScore(player: IPlayer) {
    return player.tags.count(Tag.POWER, 'raw') * 2;
  }

  grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player));
  }
}

class EmpowerBonus02 extends Bonus {
  readonly id = 'eb02' as const;
  readonly description = 'Gain 1 M€ for each Energy production you have';

  getScore(player: IPlayer) {
    return player.production.energy;
  }

  grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player));
  }
}

class EmpowerPolicy01 implements IPolicy {
  readonly id = 'ep01' as const;
  readonly description = 'Spend X M€ to gain X energy (Turmoil Empower)';

  canAct(player: IPlayer) {
    return player.canAfford(1) && player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    const game = player.game;
    const availableMC = player.spendableMegacredits();

    return new SelectAmount(
      'Select amount of M€ to spend',
      'Spend M€',
      1,
      availableMC
    ).andThen((amount: number) => {
      game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.EMPOWER));
      
      game.defer(new SelectPaymentDeferred(player, amount, {title: TITLES.payForPartyAction(PartyName.EMPOWER)}))
        .andThen(() => {
          player.stock.add(Resource.ENERGY, amount);
          game.log('${0} spent ${1} M€ to gain ${2} energy', (b) => 
            b.player(player).number(amount).number(amount));
          player.turmoilPolicyActionUsed = true;
        });
      return undefined;
    });
  }
}

class EmpowerPolicy02 implements IPolicy {
  readonly id = 'ep02' as const;
  readonly description = 'When you place a tile, gain 1 energy';

  onTilePlaced(player: IPlayer) {
    player.stock.add(Resource.ENERGY, 1);
  }
}

class EmpowerPolicy03 implements IPolicy {
  readonly id = 'ep03' as const;
  readonly description = 'When you gain or lose energy production, gain 2 energy';
}

class EmpowerPolicy04 implements IPolicy {
  readonly id = 'ep04' as const;
  readonly description = 'Cards with Power tags cost 3 M€ less to play';
}

export const EMPOWER_BONUS_1 = new EmpowerBonus01();
export const EMPOWER_BONUS_2 = new EmpowerBonus02();
export const EMPOWER_POLICY_1 = new EmpowerPolicy01();
export const EMPOWER_POLICY_2 = new EmpowerPolicy02();
export const EMPOWER_POLICY_3 = new EmpowerPolicy03();
export const EMPOWER_POLICY_4 = new EmpowerPolicy04();
