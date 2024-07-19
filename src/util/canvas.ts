import { type CanvasObject } from "./interfaces";

interface Coord {
  x: number,
  y: number,
}

const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
}

export const getCanvas = (): CanvasObject => {
  const canvas: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  return { canvas, ctx };
};

export class PokemonObject {
  position: Coord;
  src: string;
  velocity: Coord;
  ctx: CanvasRenderingContext2D | null;
  img: HTMLImageElement;
  angle: number;

  constructor({
    position = { x: 0, y: 0 },
    src = '',
    velocity = { x: 0, y: 0 }

  }, ctx: CanvasRenderingContext2D | null) {
    this.position = position;
    this.src = src;
    this.velocity = velocity;
    this.ctx = ctx;
    this.img = new Image();
    this.angle = 180;
  }

  draw(): void {
    this.img.src = this.src;

    this.img.onload = (): void => {
      if (this.ctx) {
       this.drawFrame();
       this.updateAngle();
      }
    };
  }

  drawFrame(): void {
    this.ctx?.drawImage(this.img, this.position.x, this.position.y);
  }

  updateAngle(): void {
    this.angle = Math.floor(Math.random() * 360) + 1;
  }

  detectCollision(): void {
    // Detect collision with top of screen
    // Detect collision with bottom of screen
    if (this.position.y < 0 || this.position.y + this.img.height > window.innerHeight) {
      this.angle = this.angle * -1;
    }

    // Detect collision with left of screen
    // Detect collision with right of screen
    if (this.position.x < 0 || this.position.x + this.img.width > window.innerWidth) {
      this.angle = ((180 - this.angle) + 360) % 360;
    }
  }
};

export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  objects: Array<PokemonObject>

  constructor(canvasEl: HTMLCanvasElement, canvasCtx: CanvasRenderingContext2D | null) {
    this.canvas = canvasEl;
    this.ctx = canvasCtx;
    this.objects = [];
  };

  intialize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addPokemon(imgSrc: string, position: Coord): PokemonObject {
    const pokemonObj = new PokemonObject({position, src: imgSrc}, this.ctx);
    this.objects.push(pokemonObj);
    pokemonObj.draw();
    return pokemonObj;
  }

  animate(): void {
    window.requestAnimationFrame(() => this.animate());

    const clearCanvas = (): void => {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    clearCanvas();


    this.objects.forEach((object: PokemonObject) => {
      object.drawFrame();
      object.detectCollision();
      object.position.x += Math.cos(degreesToRadians(object.angle));
      object.position.y += Math.sin(degreesToRadians(object.angle));
    });
  };
};
