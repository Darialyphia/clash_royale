import { HAND_HEIGHT, TILE_SIZE, WIDTH } from '@/constants';
import { resources } from '@/resources';
import { SerializedPlayer, SerializedCard } from '@game/logic';
import { Actor, Engine, Vector } from 'excalibur';

export class CardActor extends Actor {
  private cost: number;

  constructor(card: SerializedCard, x: number) {
    super({ x, y: HAND_HEIGHT / 2 + 2, anchor: new Vector(0, 0.5) });
    this.graphics.use(resources.knightCardSheet.getAnimation(`${card.cost}`)!);
    this.cost = card.cost;
  }

  onStateUpdate(card: SerializedCard) {
    if (this.cost !== card.cost) {
      this.graphics.use(resources.knightCardSheet.getAnimation(`${card.cost}`)!);
      this.cost = card.cost;
    }
  }
}

const CARD_GAP = 8;

export class HandActor extends Actor {
  private cards: CardActor[] = [];
  private cardsWrapper = new Actor();

  constructor(x: number, y: number) {
    super({ x, y, anchor: new Vector(0, 0) });
    this.graphics.use(resources.handSheet.getSpriteSheet()!.getSprite(0, 0)!, {
      offset: new Vector(0, -3)
    });

    this.addChild(this.cardsWrapper);
  }

  onStateUpdate(player: Pick<SerializedPlayer, 'deckSystem'>) {
    player.deckSystem.hand.forEach((card, index) => {
      if (!this.cards[index]) {
        const actor = new CardActor(card, index * (TILE_SIZE + CARD_GAP));
        this.cards.push(actor);
        this.cardsWrapper.addChild(actor);
      } else {
        this.cards[index].onStateUpdate(card);
      }
    });

    const totalWidth = this.cards.length * TILE_SIZE + (this.cards.length - 1) * CARD_GAP;
    this.cardsWrapper.pos.x = WIDTH / 2 - totalWidth / 2;
  }
}
