import { Entity } from '../entity';
import { type Serializable, shuffled } from '@game/shared';
import  { TypedEventEmitter } from '../utils/typed-emitter';
import  { type Player } from '../player/player.entity';

export type HandCard = 0 | 1 | 2 | 3

export abstract class DeckSystemException extends Error {
  protected constructor(message: string) {
    super(message);
  }
}

export class DeckTooSmallException extends DeckSystemException {
  realSize: number;
  minSize: number;

  constructor(minSize: number, realSize: number) {
    super(`Expected deck with at least '${minSize}' cards but got one with '${realSize}'!`);

    this.minSize = minSize;
    this.realSize = realSize;
  }
}

export const CARD_EVENTS = {
  DECK_BEFORE_PLAY: "DECK:BEFORE_PLAY",
  DECK_ON_PLAY: "DECK:ON_PLAY",
  DECK_AFTER_PLAY: "DECK:AFTER_PLAY",
} as const;

export type CardEvent = {
  [CARD_EVENTS.DECK_BEFORE_PLAY]: [Player, Card, CardTarget];
  [CARD_EVENTS.DECK_ON_PLAY]: [Player, Card, CardTarget];
  [CARD_EVENTS.DECK_AFTER_PLAY]: [Player, Card, CardTarget];
}

export type SerializedDeckSystem = {
  id: string;
  deck: SerializedDeck;
  drawPile: SerializedCard[];
  discardPile: SerializedCard[];
  hand: [SerializedCard, SerializedCard, SerializedCard, SerializedCard];
}

export type DeckSystemSubscriber = (player: Player, card: Card, target: CardTarget) => void;

export class DeckSystem extends Entity implements Serializable<SerializedDeckSystem> {
  private _deck: Deck;
  private _drawPile: Card[];
  private _discardPile: Card[];
  private _hand: [Card, Card, Card, Card];
  private emitter = new TypedEventEmitter<CardEvent>();

  /**
   * @throws DeckTooSmallException when the deck is too small to play with
   * @param blueprint
   */
  constructor(blueprint: { id: string, deck: Deck }) {
    super(blueprint.id)
    if (blueprint.deck.cards.length < 5) throw new DeckTooSmallException(5, blueprint.deck.cards.length)

    this._deck = blueprint.deck;

    this._drawPile = [...blueprint.deck.cards];
    this._discardPile = [];

    this.shuffleDeck();

    this._hand = [this._drawPile.shift()!, this._drawPile.shift()!, this._drawPile.shift()!, this._drawPile.shift()!];
  }

  /**
   * Shuffles the discard pile back into the draw pile. Does not affect the hand but does affect {@link peek}.
   */
  shuffleDeck() {
    console.debug("Shuffling deck")
    this._drawPile = shuffled([...this._drawPile, ...this._discardPile]);
    this._discardPile = [];
  }

  peek(): Card {
    return this._drawPile[0]
  }

  // This can be extended with relevant properties, like coordinates etc.
  /**
   * Tries to play the card for the player. Fails if the card target is either invalid,
   * the player does not have enough mana,
   * or the card is in cooldown.
   *
   * @param player
   * @param target
   * @param card
   */
  tryPlay(player: Player, target: CardTarget, card: HandCard): boolean {
    let card2play = this._hand[card];

    // consider returning the reason why the play failed
    if (!this.playerCanPlay(player, target, card)) return false;
    player.manaSystem.subtract(card2play.costs())
    this.emitter.emit(CARD_EVENTS.DECK_BEFORE_PLAY, player, card2play, target);


    // actual effect of card is handled by some other system, the deck itself doesn't care
    this.emitter.emit(CARD_EVENTS.DECK_ON_PLAY, player, card2play, target)

    this._hand[card] = this._drawPile.shift()!;
    this.discardPile.push(card2play);
    if (this._drawPile.length === 0) {
      this.shuffleDeck();
    }

    for (let c of this._hand) {
      c.triggerCooldown();
    }

    this.emitter.emit(CARD_EVENTS.DECK_AFTER_PLAY, player, card2play, target);
    return true;
  }

  playerCanPlay(player: Player, target: CardTarget, card: HandCard): boolean {
    let card2play = this._hand[card];

    return card2play.targets().includes(target)
      && (player.manaSystem.current() >= card2play.costs())
      && card2play.cooldownProgress() === 1;
  }

  update(delta: number): void {
    for (let c of this._hand) {
      c.update(delta);
    }
  }

  get hand(): [Card, Card, Card, Card] {
    return this._hand;
  }

  get discardPile(): any[] {
    return this._discardPile;
  }

  get drawPile(): Card[] {
    return this._drawPile;
  }

  get deck(): Deck {
    return this._deck;
  }

  serialize(): SerializedDeckSystem {
    return {
      id: this.id,
      deck: this.deck.serialize(),
      drawPile: this._drawPile.map(c => c.serialize()),
      discardPile: this._discardPile.map(c => c.serialize()),
      hand: this._hand.map(c => c.serialize()) as [SerializedCard, SerializedCard, SerializedCard, SerializedCard],
    };
  }

  subscribeBeforePlay(cb: DeckSystemSubscriber) {
    return this.emitter.on(CARD_EVENTS.DECK_BEFORE_PLAY, cb);
  }

  subscribeOnPlay(cb: DeckSystemSubscriber) {
    return this.emitter.on(CARD_EVENTS.DECK_ON_PLAY, cb);
  }

  subscribeAfterPlay(cb: DeckSystemSubscriber) {
    return this.emitter.on(CARD_EVENTS.DECK_AFTER_PLAY, cb);
  }
}

export type DeckBlueprint = { cards: CardBlueprint[], id: string }

export type SerializedDeck = {
  id: string;
  cards: SerializedCard[];
}

export class Deck extends Entity implements Serializable<SerializedDeck> {
  cards: Card[]

  constructor(blueprint: DeckBlueprint) {
    super(blueprint.id);
    this.cards = blueprint.cards.map(c => new Card(c));
  }

  update(_: number): void {
    // noop
  }

  serialize(): SerializedDeck {
    return {
      id: this.id,
      cards: this.cards.map(c => c.serialize()),
    };
  }
}

export type CardTarget = "PlayerBoard" | "PlayerUnit" | "PlayerTower" | "OpponentBoard" | "OpponentUnit" | "OpponentTower";

export type CardBlueprint = {
  id: string;
  targets: CardTarget[];
  name: string;
  cost: number;
  cooldown: number;
}

export type SerializedCard = {
  cooldownDelay: number;
  currentCooldown: number;
  cost: number;
  name: string;
  targets: CardTarget[];
  id: string;
}

export class Card extends Entity implements Serializable<SerializedCard> {
  private cooldownDelay: number;
  private currentCooldown: number;
  private cost: number;
  private _name: string;
  private _targets: CardTarget[];

  constructor(blueprint: CardBlueprint) {
    super(blueprint.id)
    this.cooldownDelay = blueprint.cooldown;
    this.currentCooldown = 0;
    this.cost = blueprint.cost;
    this._name = blueprint.name;
    this._targets = blueprint.targets;
  }

  /**
   * Returns a number between 0 and 1 indicating how much the card has cooled down.
   * 0 means it is cooling down, 1 means it has finished.
   */
  cooldownProgress(): number {
    return 1 - (this.currentCooldown / this.cooldownDelay);
  }

  triggerCooldown() {
    this.currentCooldown = this.cooldownDelay;
  }

  costs(): number {
    return this.cost;
  }

  name(): string {
    return this._name;
  }

  targets(): CardTarget[] {
    return this._targets;
  }

  update(delta: number): void {
    this.currentCooldown = Math.max(0, this.currentCooldown - delta);
  }

  serialize(): SerializedCard {
    return {
      id: this.id,
      cooldownDelay: this.cooldownDelay,
      currentCooldown: this.currentCooldown,
      cost: this.cost,
      name: this._name,
      targets: this._targets,
    };
  }
}