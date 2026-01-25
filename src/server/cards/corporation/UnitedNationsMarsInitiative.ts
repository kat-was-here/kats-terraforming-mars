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
          b.empty().megacredits(43);
          b.corpBox('effect', (ce) => {
            ce.effect('When your delegate becomes the chairman, draw a card.', (eb) => {
              eb.chairman().startEffect.cards(1);
            });
          });
          b.corpBox('action', (ce) => {
            ce.action('If your Terraform Rating was raised this generation, you may pay 3 M€ to raise it 1 step more.', (eb) => {
              eb.megacredits(3).startAction.tr(1).asterix();
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

  // When player becomes chairman, draw a card
  public onChairmanSet(player: IPlayer): void {
    player.drawCard(1);
    player.game.log('${0} drew a card from ${1}', (b) => b.player(player).card(this));
  }
}