import { getRandomNumberInRange, degreesToRadians } from "./helpers";
interface Coord {
  x: number,
  y: number,
}

const maxAngle: number = 360;

export class PokemonObject {
  position: Coord;
  prevPosition: Coord;
  src: string;
  speed: number;
  img: HTMLImageElement;
  angle: number;
  className: string;

  constructor({
    position = { x: 0, y: 0 },
    src = '',
    speed = 5,
    angle = 0,
  }, className = 'pokemon-sprite') {
    this.className = className;
    this.position = position;
    this.prevPosition = position;
    this.src = src;
    this.speed = speed;
    this.img = new Image();
    this.angle = angle;
  }

  draw(): void {
    this.img.src = this.src;
    this.img.classList.add(this.className);
    this.img.style.top = `${this.position.y}px`;
    this.img.style.left = `${this.position.x}px`;
    this.setRandomAngle();
  }

  getX(): number {
    return parseInt(this.img.style.left, 10);
  }

  getY(): number {
    return parseInt(this.img.style.top, 10);
  }

  incrementImgX(x: number) {
    this.prevPosition.x = this.getX();
    this.img.style.left = `${this.getX() + x}px`;
  }

  incrementImgY(y: number) {
    this.prevPosition.y = this.getY();
    this.img.style.top = `${this.getY() + y}px`;
  }

  setRandomAngle(): void {
    this.angle = Math.floor(Math.random() * maxAngle) + 1;
  }

  setFacingAngle(): void {
    if (this.getX() > this.prevPosition.x) {
      this.img.style.transform = 'scaleX(-1)';
    } else {
      this.img.style.transform = 'scaleX(1)';
    }
  }

  detectCollision(): void {
    const minAngleDiscrepancy: number = -15;
    const maxAngleDiscrepancy: number = 15;

    const setOppositeVerticalAngle = (): void => {
      this.angle = -this.angle + getRandomNumberInRange(maxAngleDiscrepancy, minAngleDiscrepancy);
    }

    const setOppositeHorizontalAngle = (): void => {
      this.angle =
        ((maxAngle / 2 - this.angle) + maxAngle) % maxAngle +
        getRandomNumberInRange(maxAngleDiscrepancy, minAngleDiscrepancy);

    };

    // Detect collision with top of screen
    if (this.getY() < 1) {
      this.img.style.top = '1px';
      setOppositeVerticalAngle();
    }

    // Detect collision with bottom of screen
    if (this.getY() + this.img.height > window.innerHeight) {
      this.img.style.top = `${window.innerHeight - this.img.height}px`;
      setOppositeVerticalAngle();
    }

    // Detect collision with left of screen
    if (this.getX() < 1) {
      this.img.style.left = '1px';
      setOppositeHorizontalAngle();
    }

    // Detect collision with right of screen
    if (this.getX() + this.img.width > window.innerWidth) {
      this.img.style.left = `${window.innerWidth - this.img.width}px`;
      setOppositeHorizontalAngle();
    }
  }
};

export class DrawApp {
  height: number;
  width: number;
  canvas: Element | null;
  objects: Array<PokemonObject>;

  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.objects = [];
    this.canvas = null;
  };

  intialize(el: Element | null): void {
    this.canvas = el;
    this.animate();
  }

  addPokemonToCanvas(imgSrc: string, position: Coord): PokemonObject {
    const pokemonObj = new PokemonObject({position, src: imgSrc});
    this.canvas?.appendChild(pokemonObj.img);
    this.objects.push(pokemonObj);
    pokemonObj.draw();
    return pokemonObj;
  }

  animate(): void {
    setTimeout(() => this.animate(), 20);

    this.objects.forEach((object: PokemonObject) => {
      object.detectCollision();
      object.setFacingAngle();

      const x: number = Math.floor(object.speed * Math.cos(degreesToRadians(object.angle)));
      const y: number = Math.floor(object.speed * Math.sin(degreesToRadians(object.angle)));

      object.incrementImgX(x);
      object.incrementImgY(y);
    });
  };
};
