import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Bonus, IBonus} from '../Bonus';
import {IPolicy} from '../Policy';
import {IPlayer} from '../../IPlayer';
import {IGame} from '../../IGame';
import {Turmoil} from '../Turmoil';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../../common/constants';
import {TITLES} from '../../inputs/titles';
import {SelectSpace} from '../../inputs/SelectSpace';
import {message} from '../../logs/MessageBuilder';

export class Bureaucrats extends Party implements IParty {
  readonly name = PartyName.BUREAUCRATS;
  readonly bonuses = [BUREAUCRATS_BONUS_1, BUREAUCRATS_BONUS_2];
  readonly policies = [BUREAUCRATS_POLICY_1, BUREAUCRATS_POLICY_2, BUREAUCRATS_POLICY_3, BUREAUCRATS_POLICY_4];
}

class BureaucratsBonus01 extends Bonus {
  readonly id = 'bb01' as const;
  readonly description = 'Gain 1 M€ for each Event card you have played';

  getScore(player: IPlayer) {
    return player.getPlayedEventsCount();
  }

  grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player));
  }
}

class BureaucratsBonus02 implements IBonus {
  readonly id = 'bb02' as const;
  readonly description = 'Mark all card actions as used this generation';

  getScore(player: IPlayer) {
    return player.getPlayableActionCards().length * -1;
  }

  grant(game: IGame) {
    game.playersInGenerationOrder.forEach((player) => {
      player.getPlayableActionCards().forEach((card) => player.actionsThisGeneration.add(card.name));
    });
  }
}

class BureaucratsPolicy01 implements IPolicy {
  readonly id = 'bp01' as const;
  readonly description = 'Pay 3 M€ to send a delegate from your reserve into any party (Turmoil Bureaucrats)';

  canAct(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const hasDelegateInReserve = turmoil.getAvailableDelegateCount(player) >= 1;    
    return player.canAfford(3) && hasDelegateInReserve && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.BUREAUCRATS));
    player.politicalAgendasActionUsedCount += 1;
    
    game.defer(new SendDelegateToArea(player, 'Select where to send delegate'));
    game.defer(new SelectPaymentDeferred(player, 3, {title: TITLES.payForPartyAction(PartyName.BUREAUCRATS)}));

    return undefined;
  }
}

class BureaucratsPolicy02 implements IPolicy {
  readonly id = 'bp02' as const;
  readonly description = 'When you trade, you must pay 1 additional resource for it';
}

class BureaucratsPolicy03 implements IPolicy {
  readonly id = 'bp03' as const;
  readonly description = 'Pay 3 M€ to place your player marker on a non-reserved area (Turmoil Bureaucrats)';

  canAct(player: IPlayer) {
    return player.canAfford(3) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.BUREAUCRATS));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 3, {title: TITLES.payForPartyAction(PartyName.BUREAUCRATS)}));
    
    const availableSpaces = game.board.getAvailableSpacesOnLand(player)
      .filter((space) => space.player === undefined);
    
    player.defer(new SelectSpace(
      message('Select space to place your marker'),
      availableSpaces,
    ).andThen((space) => {
      space.player = player;
      return undefined;
    }));

    return undefined;
  }
}

class BureaucratsPolicy04 implements IPolicy {
  readonly id = 'bp04' as const;
  readonly description = 'Cards with Earth tags cost 3 M€ less to play';
}

export const BUREAUCRATS_BONUS_1 = new BureaucratsBonus01();
export const BUREAUCRATS_BONUS_2 = new BureaucratsBonus02();
export const BUREAUCRATS_POLICY_1 = new BureaucratsPolicy01();
export const BUREAUCRATS_POLICY_2 = new BureaucratsPolicy02();
export const BUREAUCRATS_POLICY_3 = new BureaucratsPolicy03();
export const BUREAUCRATS_POLICY_4 = new BureaucratsPolicy04();