import type { Constructor, Values } from '@game/shared';
import {
  defaultInputSchema,
  type DefaultSchema,
  Input,
  type SerializedInput
} from './input';
import type { GameSession } from '../game-session';

type GenericInputMap = Record<string, Constructor<Input<DefaultSchema>>>;

type ValidatedActionMap<T extends GenericInputMap> = {
  [Name in keyof T]: T[Name] extends Constructor<Input<DefaultSchema>>
    ? Name extends InstanceType<T[Name]>['name']
      ? T[Name]
      : never
    : never;
};

const validateActionMap = <T extends GenericInputMap>(data: ValidatedActionMap<T>) =>
  data;

class TestInput extends Input<DefaultSchema> {
  readonly name = 'test';

  protected payloadSchema = defaultInputSchema;

  impl() {
    console.log('test action');
  }
}

const inputMap = validateActionMap({
  test: TestInput
});

export class InputSystem {
  private registeredInputs: InstanceType<Values<typeof inputMap>>[] = [];

  private isInputType(type: string): type is keyof typeof inputMap {
    return Object.keys(inputMap).includes(type);
  }

  dispatch(input: SerializedInput) {
    if (!this.isInputType(input.type)) return;
    const ctor = inputMap[input.type];
    this.registeredInputs.push(new ctor(input.payload));
  }

  process(session: GameSession) {
    this.registeredInputs.forEach(input => {
      input.execute(session);
    });
    this.registeredInputs = [];
  }
}