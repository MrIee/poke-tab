export type Ref = string | number | symbol;

export interface VueComponent {
  $el: HTMLElement,
}
export interface CanvasObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
}

export interface Pokemon {
  id?: string;
  name: string;
  imgUrl: string;
  type: Array<string>;
  generation: 1;
}

export interface PokemonBox {
  pokemon: Array<Pokemon>;
  default: boolean;
}
export interface DockedEvent {
  docked: boolean;
  side: string;
};
