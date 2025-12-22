import {CorporationCard} from './CorporationCard';
import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from './ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {TITLES} from '../../inputs/titles';
export const ACTION_COST = 3;
export class UnitedNationsMarsInitiative extends CorporationCard implements IActionCard, ICorporationCard {
  constructor() {
    super({
      name: CardName.UNITED_NATIONS_MARS_INITIATIVE,
      tags: [Tag.EARTH, Tag.MARS],
      startingMegaCredits: 43,

      metadata: {
        cardNumber: 'R32',
        description: 'You start with 43 M€.',
        renderData: CardRenderer.builder((b) => {
          // TODO(chosta): find a not so hacky solutions to spacing
          // b.br.br.br;
          b.empty().megacredits(40);
          b.corpBox('action', (ce) => {
            ce.action('If your Terraform Rating was raised this generation, you may pay 2 M€ to raise it 1 step more.', (eb) => {
              eb.megacredits(2).startAction.tr(1).asterix();
            });
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.hasIncreasedTerraformRatingThisGeneration && player.canAfford({cost: ACTION_COST, tr: {tr: 1}});
  }

  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 3, {title: TITLES.payForCardAction(this.name)}))
      .andThen(() => player.increaseTerraformRating());
    return undefined;
  }
}
