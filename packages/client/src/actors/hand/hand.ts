import { HAND_HEIGHT, TILE_SIZE } from '@/constants';
import { resources } from '@/resources';
import { SerializedPlayer, SerializedCard } from '@game/logic';
import { Actor, Vector } from 'excalibur';

export class CardActor extends Actor {
  private cost: number;

  constructor(card: SerializedCard, x: number) {
    super({ x, y: HAND_HEIGHT / 2, anchor: new Vector(0, 0.5) });
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

const CARD_GAP = 4;
const HAND_LEFT_MARGIN = 4;
export class HandActor extends Actor {
  private cards: CardActor[] = [];

  constructor(x: number, y: number) {
    super({ x, y, anchor: new Vector(0, 0) });
    this.graphics.use(resources.handSheet.getSpriteSheet()!.getSprite(0, 0)!, {
      offset: new Vector(0, -3)
    });
  }

  onStateUpdate(player: Pick<SerializedPlayer, 'deckSystem'>) {
    player.deckSystem.hand.forEach((card, index) => {
      if (!this.cards[index]) {
        const actor = new CardActor(
          card,
          HAND_LEFT_MARGIN + index * (TILE_SIZE + CARD_GAP)
        );
        this.cards.push(actor);
        this.addChild(actor);
      } else {
        this.cards[index].onStateUpdate(card);
      }
    });
  }
}
