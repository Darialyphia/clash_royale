export type EntityId = string;

export abstract class Entity {
  readonly id: string;

  protected constructor(id: EntityId) {
    this.id = id;
  }

  equals(e: Entity) {
    return this.id == e.id;
  }

  abstract update(delta: number): void;
}
