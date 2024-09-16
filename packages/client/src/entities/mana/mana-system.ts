import { Entity } from '@/entities/_entity.ts';
import { Actor, Color, Engine, Font, FontUnit, Label, TextAlign } from 'excalibur';
import { TILE_SIZE, WIDTH } from '@/constants.ts';

export type ManaSystemBlueprint = {
  id: string,
  /**
   * The mana system will start with this value, unless it is larger than maxCapacity,
   * in which case it will be set to the capacity;
   */
  initialValue: number,
  /**
   * Charging rate of the mana system in mana/ms
   */
  baseRechargeRate: number,
  /**
   * The mana system will never charge beyond this value
   */
  maxCapacity: number,
}

export class ManaSystem extends Entity {
  private value: number;
  private readonly rate: number;
  private readonly max: number;

  constructor(blueprint: ManaSystemBlueprint) {
    super(blueprint.id);
    this.value = 0;
    this.rate = blueprint.baseRechargeRate;
    this.max = blueprint.maxCapacity;
    this.set(blueprint.initialValue);
  }

  /**
   * Progress time for the mana system by delta many ms
   */
  tick(delta: number) {
    this.add(delta * this.rate);
  }

  /**
   * Current mana value, this is a floating point between 0 and {@link capacity}
   */
  current(): number {
    return this.value;
  }

  /**
   * Adds x mana to the mana system. The systems {@link current} will not exceed {@link capacity} after this operation.
   */
  add(x: number) {
    this.value = Math.min(this.max, this.value + x);
  }

  /**
   * Subtracts x mana from the mana system. The systems {@link current} will not be bellow 0 after this operation.
   */
  subtract(x: number) {
    this.value = Math.max(0, this.value - x);
  }

  /**
   * Tries to subtract x mana from the mana system. If x > {@link current} then the system will reject the operation.
   *
   * @returns {boolean} true if the operation was accepted
   */
  trySubtract(x: number): boolean {
    if (this.value < x) return false;
    this.value -= x;
    return true;
  }

  /**
   * Sets {@link current} of the mana system to {@link Math.min}({@link capacity}, {@link Math.max}(0, x)).
   */
  set(x: number) {
    this.value = Math.min(this.max, Math.max(0, x));
  }

  /**
   * Max Capacity of the system. {@link current} should never exceed this value.
   */
  capacity() {
    return this.max;
  }

  /**
   * Rate at which this mana system charges. Expressed in mana/ms.
   */
  chargeRate(): number {
    return this.rate;
  }
}

export class ManaSystemActor extends Actor {
  private readonly text: Label;
  private system: ManaSystem;

  constructor(blueprint: { mana: ManaSystem; location: "left" | "right" }) {
    super({
      x: (blueprint.location === "left" ? 0 : WIDTH - TILE_SIZE) + TILE_SIZE / 2,
      y: TILE_SIZE / 2,
      color: Color.Azure,
      height: TILE_SIZE,
      width: TILE_SIZE,
      visible: false,
    });

    this.system = blueprint.mana;

    this.text = new Label({
      text: `${this.system.current()}`,
      x: 0,
      y: -TILE_SIZE / 4,
      width: TILE_SIZE - 8,
      font: new Font({
        family: 'impact',
        size: 12,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center,
      })
    });

    this.addChild(this.text)
  }

  onPreUpdate(engine: Engine, delta: number) {
    this.text.text = `${this.system.current().toFixed(2)}`;
    super.onPreUpdate(engine, delta);
  }
}