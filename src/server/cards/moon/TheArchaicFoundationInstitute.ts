import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';
import {LogHelper} from '../../LogHelper';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RemoveOceanTile} from '../../deferredActions/RemoveOceanTile';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {
  MIN_TEMPERATURE,
  MAX_TEMPERATURE,
  MIN_OXYGEN_LEVEL,
  MAX_OXYGEN_LEVEL,
  MIN_VENUS_SCALE,
  MAX_VENUS_SCALE,
  MAXIMUM_HABITAT_RATE,
  MAXIMUM_LOGISTICS_RATE,
  MAXIMUM_MINING_RATE,
} from '../../../common/constants';

export class TheArchaicFoundationInstitute extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.THE_ARCHAIC_FOUNDATION_INSTITUTE,
      tags: [Tag.MOON, Tag.MOON],
      startingMegaCredits: 55,
      resourceType: CardResource.RESOURCE_CUBE,
      metadata: {
        hasExternalHelp: true,
        cardNumber: 'MC10',
        description: 'You start with 55 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(55).nbsp;
          b.effect('When you play a Moon tag, including these, add a cube to this card.', (eb) => {
            eb.tag(Tag.MOON).startEffect.resource(CardResource.RESOURCE_CUBE);
          }).br;
          b.effect('Automatically remove 3 cubes here and gain 1 TR, then decrease any global parameter 1 step.', (eb) => {
            eb.resource(CardResource.RESOURCE_CUBE, {amount: 3, digit}).startEffect.tr(1, {size: Size.TINY});
          }).br;
          b.action('Remove 3 cubes here; gain 1 TR and decrease any global parameter 1 step.', (ab) => {
            ab.resource(CardResource.RESOURCE_CUBE, {amount: 3, digit}).startAction.tr(1, {size: Size.TINY});
          });
        }),
      },
    });
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard): void {
    const moonTags = card.tags.filter((t) => t === Tag.MOON);
    const count = moonTags.length;
    if (count > 0) {
      player.addResourceTo(this, {qty: count, log: true});
    }
  }

  private canDecrease(player: IPlayer, parameter: GlobalParameter): boolean {
    const game = player.game;
    switch (parameter) {
    case GlobalParameter.TEMPERATURE:
      const temp = game.getTemperature();
      return temp > MIN_TEMPERATURE && temp !== MAX_TEMPERATURE;
    case GlobalParameter.OCEANS:
      return game.canRemoveOcean();
    case GlobalParameter.OXYGEN:
      const oxygenLevel = game.getOxygenLevel();
      return oxygenLevel > MIN_OXYGEN_LEVEL && oxygenLevel !== MAX_OXYGEN_LEVEL;
    case GlobalParameter.VENUS:
      const venusScaleLevel = game.getVenusScaleLevel();
      return game.gameOptions.venusNextExtension === true && venusScaleLevel > MIN_VENUS_SCALE && venusScaleLevel !== MAX_VENUS_SCALE;
    case GlobalParameter.MOON_HABITAT_RATE:
      if (game.moonData) {
        const rate = game.moonData.habitatRate;
        return rate > 0 && rate !== MAXIMUM_HABITAT_RATE;
      }
      return false;
    case GlobalParameter.MOON_LOGISTICS_RATE:
      if (game.moonData) {
        const rate = game.moonData.logisticRate;
        return rate > 0 && rate !== MAXIMUM_LOGISTICS_RATE;
      }
      return false;
    case GlobalParameter.MOON_MINING_RATE:
      if (game.moonData) {
        const rate = game.moonData.miningRate;
        return rate > 0 && rate !== MAXIMUM_MINING_RATE;
      }
      return false;
    }
  }

  private createDecreaseOptions(player: IPlayer): OrOptions {
    const game = player.game;
    const orOptions = new OrOptions();

    // Decrease temperature option
    if (this.canDecrease(player, GlobalParameter.TEMPERATURE)) {
      orOptions.options.push(new SelectOption('Decrease temperature').andThen(() => {
        game.increaseTemperature(player, -1);
        game.log('${0} decreased temperature 1 step', (b) => b.player(player));
        return undefined;
      }));
    }

    // Remove ocean option
    if (this.canDecrease(player, GlobalParameter.OCEANS)) {
      orOptions.options.push(new SelectOption('Remove an ocean tile').andThen(() => {
        game.defer(new RemoveOceanTile(player, 'Archaic Foundation - Remove an Ocean tile'));
        return undefined;
      }));
    }

    // Decrease oxygen level option
    if (this.canDecrease(player, GlobalParameter.OXYGEN)) {
      orOptions.options.push(new SelectOption('Decrease oxygen level').andThen(() => {
        game.increaseOxygenLevel(player, -1);
        game.log('${0} decreased oxygen level 1 step', (b) => b.player(player));
        return undefined;
      }));
    }

    // Decrease Venus scale option
    if (this.canDecrease(player, GlobalParameter.VENUS)) {
      orOptions.options.push(new SelectOption('Decrease Venus scale').andThen(() => {
        game.increaseVenusScaleLevel(player, -1);
        game.log('${0} decreased Venus scale level 1 step', (b) => b.player(player));
        return undefined;
      }));
    }

    if (this.canDecrease(player, GlobalParameter.MOON_HABITAT_RATE)) {
      orOptions.options.push(new SelectOption('Decrease Moon habitat rate').andThen(() => {
        MoonExpansion.lowerHabitatRate(player, 1);
        return undefined;
      }));
    }

    if (this.canDecrease(player, GlobalParameter.MOON_MINING_RATE)) {
      orOptions.options.push(new SelectOption('Decrease Moon mining rate').andThen(() => {
        MoonExpansion.lowerMiningRate(player, 1);
        return undefined;
      }));
    }

    if (this.canDecrease(player, GlobalParameter.MOON_LOGISTICS_RATE)) {
      orOptions.options.push(new SelectOption('Decrease Moon Logistics Rate').andThen(() => {
        MoonExpansion.lowerLogisticRate(player, 1);
        return undefined;
      }));
    }

    return orOptions;
  }

  public canAct(player: IPlayer) {
    return (this.resourceCount >= 3 && player.canAfford({cost: 0, tr: {tr: 1}}));
  }

  public action(player: IPlayer) {
    let tr = Math.floor(this.resourceCount / 3);
    while (!player.canAfford({cost: 0, tr: {tr: tr}})) {
      tr--;
    }
    player.removeResourceFrom(this, tr * 3);
    player.increaseTerraformRating(tr);
    LogHelper.logRemoveResource(player, this, tr * 3, `Gain ${tr} TR`);

    // After gaining TR, choose a parameter to decrease
    const decreaseOptions = this.createDecreaseOptions(player);
    if (decreaseOptions.options.length === 1) {
      decreaseOptions.options[0].cb();
    } else if (decreaseOptions.options.length > 1) {
      player.defer(decreaseOptions);
    }
  }

  public onResourceAdded(player: IPlayer, playedCard: ICard): void {
    if (playedCard.name !== this.name) return;
    if (this.canAct(player)) {
      this.action(player);
    }
  }
}