export type State<TContext> = {
  onEnter?: (ctx: TContext) => void;
  onUpdate?: (ctx: TContext, dt: number) => void;
  onExit?: (ctx: TContext) => void;
};

export default class StateMachineBuilder<
  TContext,
  TStates extends string[] = [],
> {
  private states = new Map<string, State<TContext>>();

  add<TName extends string>(
    name: TName,
    state: State<TContext>
  ): StateMachineBuilder<TContext, [typeof name, ...TStates]> {
    this.states.set(name, state);

    return this as unknown as StateMachineBuilder<
      TContext,
      [typeof name, ...TStates]
    >;
  }

  build(ctx: TContext, initialState: TStates[number]) {
    return new StateMachine<TContext, TStates[number]>(
      this.states,
      ctx,
      initialState
    );
  }
}

export class StateMachine<TContext, TStates extends string> {
  private ctx: TContext;
  private states: Map<TStates, State<TContext>>;
  private currentState: TStates;

  constructor(
    states: Map<TStates, State<TContext>>,
    ctx: TContext,
    initialState: TStates
  ) {
    this.states = states;
    this.ctx = ctx;
    this.currentState = initialState;
  }

  private getState(name: TStates) {
    return this.states.get(name)!;
  }

  update(delta: number) {
    this.getState(this.currentState).onUpdate?.(this.ctx, delta);
  }

  isCurrentState(name: TStates) {
    if (!this.currentState) {
      return false;
    }

    return this.currentState === name;
  }

  setState(name: TStates) {
    this.getState(this.currentState).onExit?.(this.ctx);

    this.currentState = name;

    this.getState(this.currentState).onEnter?.(this.ctx);
  }
}
