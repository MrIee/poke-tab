import { type CanvasObject } from "./interfaces";

interface Coord {
  x: number,
  y: number,
}

const maxAngle: number = 360;

const getRandomNumberInRange = (max: number, min: number) => {
  return Math.random() * (max + 1 - min) + min;
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
  speed: number;
  ctx: CanvasRenderingContext2D | null;
  img: HTMLImageElement;
  angle: number;

  constructor({
    position = { x: 0, y: 0 },
    src = '',
    speed = 2,

  }, ctx: CanvasRenderingContext2D | null) {
    this.position = position;
    this.src = src;
    this.speed = speed;
    this.ctx = ctx;
    this.img = new Image();
    this.angle = 180;
  }

  draw(): void {
    this.img.src = this.src;

    this.img.onload = (): void => {
      if (this.ctx) {
        this.drawFrame();
        this.setRandomAngle();
      }
    };
  }

  drawFrame(): void {
    this.ctx?.drawImage(this.img, this.position.x, this.position.y);
  }

  setRandomAngle(): void {
    this.angle = Math.floor(Math.random() * maxAngle) + 1;
  }

  detectCollision(canvas: HTMLElement): void {
    const minAngleDiscrepancy: number = -30;
    const maxAngleDiscrepancy: number = 30;

    const setOppositeVerticalAngle = (): void => {
      this.angle = this.angle * -1 + getRandomNumberInRange(maxAngleDiscrepancy, minAngleDiscrepancy);
    }

    const setOppositeHorizontalAngle = (): void => {
      this.angle =
        ((maxAngle / 2 - this.angle) + maxAngle) % maxAngle +
        getRandomNumberInRange(maxAngleDiscrepancy, minAngleDiscrepancy);
    };

    // Detect collision with top of screen
    if (this.position.y < 0) {
      this.position.y = 0;
      setOppositeVerticalAngle();
    }

    // Detect collision with bottom of screen
    if (this.position.y + this.img.height > canvas.offsetHeight) {
      this.position.y = canvas.offsetHeight - this.img.height;
      setOppositeVerticalAngle();
    }

    // Detect collision with left of screen
    if (this.position.x < 0) {
      this.position.x = 0;
      setOppositeHorizontalAngle();
    }

    // Detect collision with right of screen
    if (this.position.x + this.img.width > canvas.offsetWidth) {
      this.position.x = canvas.offsetWidth - this.img.width;
      setOppositeHorizontalAngle();
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
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
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
      object.detectCollision(this.canvas);
      object.position.x += object.speed * Math.cos(degreesToRadians(object.angle));
      object.position.y += object.speed * Math.sin(degreesToRadians(object.angle));
    });
  };
};
