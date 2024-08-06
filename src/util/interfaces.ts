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
  shinyImgUrl: string;
  type: Array<string>;
  generation: 1;
  isShiny?: boolean;
}

export interface PokemonBox {
  pokemon: Array<Pokemon>;
  default: boolean;
}
export interface DockedEvent {
  docked: boolean;
  side: string;
};

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
