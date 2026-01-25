import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {IBonus} from '../Bonus';
import {IPolicy} from '../Policy';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../../cards/ICard';
import {IGame} from '../../IGame';

export class Populists extends Party implements IParty {
  readonly name = PartyName.POPULISTS;
  readonly bonuses = [POPULISTS_BONUS_1, POPULISTS_BONUS_2];
  readonly policies = [POPULISTS_POLICY_1, POPULISTS_POLICY_2, POPULISTS_POLICY_3, POPULISTS_POLICY_4];
}

class PopulistsBonus01 implements IBonus {
  readonly id = 'pb01' as const;
  readonly description = 'Lose 1 M€ for every 5 M€ you have over 40';

  getScore(player: IPlayer) {
    return Math.floor(Math.max(player.megaCredits - 40, 0) / 5) * -1;
  }

  grant(game: IGame) {
    game.playersInGenerationOrder.forEach((player) => {
      const loss = Math.abs(this.getScore(player));
      if (loss > 0) {
        player.stock.deduct(Resource.MEGACREDITS, loss);
      }
    });
  }
}

class PopulistsBonus02 implements IBonus {
  readonly id = 'pb02' as const;
  readonly description = 'Lose 2 M€ for every 8 cards you have in hand';

  getScore(player: IPlayer) {
    return Math.floor(player.cardsInHand.length / 8) * -2;
  }

  grant(game: IGame) {
    game.playersInGenerationOrder.forEach((player) => {
      const loss = Math.abs(this.getScore(player));
      if (loss > 0) {
        player.stock.deduct(Resource.MEGACREDITS, loss);
      }
    });
  }
}

class PopulistsPolicy01 implements IPolicy {
  readonly id = 'pp01' as const;
  readonly description = 'No card discounts are applied this generation';
}

class PopulistsPolicy02 implements IPolicy {
  readonly id = 'pp02' as const;
  readonly description = 'When you play a card with non-negative VP, lose 2 M€ or as much as possible';

  onCardPlayed(player: IPlayer, card: ICard) {
    if (card.victoryPoints !== undefined) {
      const vp = typeof card.victoryPoints === 'number' ? card.victoryPoints : 0;
      if (vp > 0) {
        player.stock.deduct(Resource.MEGACREDITS, Math.min(2, player.megaCredits));
      }
    }
  }
}

class PopulistsPolicy03 implements IPolicy {
  readonly id = 'pp03' as const;
  readonly description = 'Draw 2 cards if your Terraform Rating was raised this generation (Turmoil Populists)';

  canAct(player: IPlayer) {
    return player.hasIncreasedTerraformRatingThisGeneration && player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.POPULISTS));
    player.drawCard(2);
    player.turmoilPolicyActionUsed = true;
    return undefined;
  }
}

class PopulistsPolicy04 implements IPolicy {
  readonly id = 'pp04' as const;
  readonly description = 'When you place a tile, gain 3 M€';

  onTilePlaced(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, 3);
  }
}

export const POPULISTS_BONUS_1 = new PopulistsBonus01();
export const POPULISTS_BONUS_2 = new PopulistsBonus02();
export const POPULISTS_POLICY_1 = new PopulistsPolicy01();
export const POPULISTS_POLICY_2 = new PopulistsPolicy02();
export const POPULISTS_POLICY_3 = new PopulistsPolicy03();
export const POPULISTS_POLICY_4 = new PopulistsPolicy04();
