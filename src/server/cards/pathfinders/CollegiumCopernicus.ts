import {CorporationCard} from '../corporation/CorporationCard';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard, ICard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';
import {SelectColony} from '../../inputs/SelectColony';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {IColony} from '../../colonies/IColony';
import {SelectCard} from '../../inputs/SelectCard';
import {MoonCards} from '../../moon/MoonCards';
import {message} from '../../logs/MessageBuilder';

function tradeCost(player: IPlayer) {
  return Math.max(0, 1 - player.colonies.tradeDiscount);
}

export class CollegiumCopernicus extends CorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.COLLEGIUM_COPERNICUS,
      tags: [Tag.SCIENCE, Tag.EARTH],
      startingMegaCredits: 33,
      resourceType: CardResource.DATA,

      firstAction: {
        text: 'Draw 2 cards with a science tag',
        drawCard: {count: 2, tag: Tag.SCIENCE},
      },

      metadata: {
        cardNumber: 'PfC16',
        description: 'You start with 33 M€. As your first action, draw 2 cards with a science tag.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(33).cards(2, {secondaryTag: Tag.SCIENCE}).br;
          b.effect('When you play a card with a science tag (including this), add 1 data OR 1 science resource to ANY card (except those giving 2 VP per science).', (eb) => {
            eb.tag(Tag.SCIENCE).asterix().startEffect.resource(CardResource.DATA).or().resource(CardResource.SCIENCE).asterix();
          }).br;
          b.action('Spend 1 data from this card to trade.', (eb) => {
            eb.resource(CardResource.DATA, 1).startAction.trade();
          });
        }),
      },
    });
  }

  private include(card: ICard) {
    // Eligible cards: data cards OR science cards with <2 VP per science
    return card.resourceType === CardResource.DATA || MoonCards.scienceCardsWithLessThan2VP.has(card.name);
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard): void {
    if (player.tags.cardHasTag(card, Tag.SCIENCE) && player.tableau.has(this.name)) {
      const playableCards = player.playedCards.filter((c) => this.include(c));
      if (playableCards.length === 0) return;

      if (playableCards.length === 1) {
        this.addResource(playableCards[0], player);
        return;
      }

      player.defer(
        new SelectCard(
          'Select card to add 1 data OR 1 science resource',
          'Add',
          playableCards,
        ).andThen(([selected]) => {
          this.addResource(selected, player);
          return undefined;
        }),
      );
    }
  }

  private addResource(card: ICard, player: IPlayer): void {
    if (card.resourceType === CardResource.DATA) {
      player.addResourceTo(card, {qty: 1, log: true});
    }
    if (card.resourceType === CardResource.SCIENCE) {
      player.addResourceTo(card, {qty: 1, log: true});
    }
  }

  public canAct(player: IPlayer) {
    return player.colonies.canTrade() && this.resourceCount >= tradeCost(player);
  }

  public action(player: IPlayer) {
    const game = player.game;
    player.defer(
      new SelectColony('Select colony tile to trade with', 'Select', ColoniesHandler.tradeableColonies(game))
        .andThen((colony) => {
          tradeWithColony(this, player, colony);
          return undefined;
        }),
    );
    return undefined;
  }
}

export function tradeWithColony(card: ICard, player: IPlayer, colony: IColony) {
  const cost = tradeCost(player);
  card.resourceCount -= cost;
  player.game.log('${0} spent ${1} data from ${2} to trade with ${3}', (b) => b.player(player).number(cost).card(card).colony(colony));
  colony.trade(player);
}

export class TradeWithCollegiumCopernicus implements IColonyTrader {
  private collegiumCopernicus: ICard | undefined;

  constructor(private player: IPlayer) {
    this.collegiumCopernicus = player.tableau.get(CardName.COLLEGIUM_COPERNICUS);
  }

  public canUse() {
    return (this.collegiumCopernicus?.resourceCount ?? 0) >= tradeCost(this.player) &&
      !this.player.actionsThisGeneration.has(CardName.COLLEGIUM_COPERNICUS);
  }

  public optionText() {
    return message('Pay ${0} data (use ${1} action)', (b) => b.number(tradeCost(this.player)).cardName(CardName.COLLEGIUM_COPERNICUS));
  }

  public trade(colony: IColony) {
    this.player.actionsThisGeneration.add(CardName.COLLEGIUM_COPERNICUS);
    if (this.collegiumCopernicus !== undefined) {
      tradeWithColony(this.collegiumCopernicus, this.player, colony);
    }
  }
}
