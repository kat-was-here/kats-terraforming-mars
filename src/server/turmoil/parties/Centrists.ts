import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {IBonus} from '../Bonus';
import {IPolicy} from '../Policy';
import {IPlayer} from '../../IPlayer';
import {IGame} from '../../IGame';
import {SelectColony} from '../../inputs/SelectColony';

export class Centrists extends Party implements IParty {
  readonly name = PartyName.CENTRISTS;
  readonly bonuses = [CENTRISTS_BONUS_1, CENTRISTS_BONUS_2];
  readonly policies = [CENTRISTS_POLICY_1, CENTRISTS_POLICY_2, CENTRISTS_POLICY_3, CENTRISTS_POLICY_4];
}

class CentristsBonus01 implements IBonus {
  readonly id = 'cb01' as const;
  readonly description = 'Gain 8 M€';

  getScore(_player: IPlayer) {
    return 8;
  }

  grant(game: IGame) {
    game.playersInGenerationOrder.forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, 8, {log: true});
    });
  }
}

class CentristsBonus02 implements IBonus {
  readonly id = 'cb02' as const;
  readonly description = 'Gain 1 TR';

  getScore(_player: IPlayer) {
    return 1;
  }

  grant(game: IGame) {
    game.playersInGenerationOrder.forEach((player) => {
      player.increaseTerraformRating(1, {log: true});
    });
  }
}

class CentristsPolicy01 implements IPolicy {
  readonly id = 'cp01' as const;
  readonly description = 'Gain 6 M€ (Turmoil Centrists)';

  canAct(player: IPlayer) {
    return player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    player.game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.CENTRISTS));
    player.stock.add(Resource.MEGACREDITS, 6, {log: true});
    player.turmoilPolicyActionUsed = true;
    return undefined;
  }
}

class CentristsPolicy02 implements IPolicy {
  readonly id = 'cp02' as const;
  readonly description = 'Delegates cost 2 M€ more to place';
}

class CentristsPolicy03 implements IPolicy {
  readonly id = 'cp03' as const;
  readonly description = 'Trade with any colony tile for free (Turmoil Centrists)';

  canAct(player: IPlayer) {
    const game = player.game;
    if (game.gameOptions.coloniesExtension === false) return false;

    // Check if player can trade at all
    if (!player.colonies.canTrade()) return false;

    if (player.colonies.getFleetSize() === player.colonies.usedTradeFleets) return false;

    // Find open colonies
    const openColonies = game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);

    return openColonies.length > 0 && player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.CENTRISTS));

    const openColonies = game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);

    return new SelectColony('Select colony tile for trade', 'Trade', openColonies).andThen((colony) => {
      game.log('${0} traded with ${1}', (b) => b.player(player).colony(colony));
      colony.trade(player);
      player.turmoilPolicyActionUsed = true;
      return undefined;
    });
  }
}


class CentristsPolicy04 implements IPolicy {
  readonly id = 'cp04' as const;
  readonly description = 'Cards with Event tags cost 2 M€ less to play';
}

export const CENTRISTS_BONUS_1 = new CentristsBonus01();
export const CENTRISTS_BONUS_2 = new CentristsBonus02();
export const CENTRISTS_POLICY_1 = new CentristsPolicy01();
export const CENTRISTS_POLICY_2 = new CentristsPolicy02();
export const CENTRISTS_POLICY_3 = new CentristsPolicy03();
export const CENTRISTS_POLICY_4 = new CentristsPolicy04();
