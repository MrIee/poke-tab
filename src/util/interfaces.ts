export type Ref = string | number | symbol;

export interface VueComponent {
  $el: HTMLElement,
}
export interface CanvasObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
}

export interface Pokemon {
  name: string;
  imgUrl: string;
  type: Array<string>;
  generation: 1;
}
