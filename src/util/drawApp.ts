import { v4 as uuidv4 } from 'uuid';
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
  id: string;

  constructor({
    position = { x: 0, y: 0 },
    src = '',
    speed = 5,
    angle = 0,
  }, className = 'pokemon-sprite') {
    this.id = uuidv4();
    this.className = className;
    this.position = position;
    this.prevPosition = position;
    this.src = src;
    this.speed = speed;
    this.img = new Image();
    this.angle = angle;
  };

  draw(): void {
    this.img.id = this.id;
    this.img.src = this.src;
    this.img.classList.add(this.className);
    this.img.style.top = this.position.y + 'px';
    this.img.style.left = this.position.x + 'px';
    this.setRandomAngle();
  };

  getX(): number {
    return parseInt(this.img.style.left, 10);
  };

  getY(): number {
    return parseInt(this.img.style.top, 10);
  };

  incrementImgX(x: number): void {
    this.prevPosition.x = this.getX();
    this.img.style.left = this.getX() + x + 'px';
  };

  incrementImgY(y: number): void {
    this.prevPosition.y = this.getY();
    this.img.style.top = this.getY() + y + 'px';
  };

  setRandomAngle(): void {
    this.angle = Math.floor(Math.random() * maxAngle) + 1;
  };

  setFacingAngle(): void {
    if (this.getX() > this.prevPosition.x) {
      this.img.style.transform = 'scaleX(-1)';
    } else {
      this.img.style.transform = 'scaleX(1)';
    }
  };

  setSize(size: number): void {
    this.img.style.height = size + 'px';
    this.img.style.width = size + 'px';
  };

  detectCollision(canvas: HTMLElement): void {
    const canvasRect: DOMRect = canvas.getBoundingClientRect();
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
    if (this.getY() < 0) {
      this.img.style.top = '1px';
      setOppositeVerticalAngle();
    }

    // Detect collision with right of screen
    if (this.getX() + this.img.width > canvas.offsetWidth + canvasRect.left) {
      this.img.style.left = `${canvas.offsetWidth + canvasRect.left - this.img.width}px`;
      setOppositeHorizontalAngle();
    }

    // Detect collision with bottom of screen
    if (this.getY() + this.img.height > canvas.offsetHeight) {
      this.img.style.top = `${canvas.offsetHeight - this.img.height}px`;
      setOppositeVerticalAngle();
    }

    // Detect collision with left of screen
    if (this.getX() < canvasRect.left) {
      this.img.style.left = canvasRect.left + 'px';
      setOppositeHorizontalAngle();
    }
  };
};

export class DrawApp {
  canvas: HTMLElement | null;
  pokemon: Array<PokemonObject>;

  constructor() {
    this.pokemon = [];
    this.canvas = null;
  };

  intialize(el: HTMLElement | null): void {
    this.canvas = el;
    this.animate();
  };

  addPokemonToCanvas(imgSrc: string, position: Coord): PokemonObject {
    const pokemonObj = new PokemonObject({position, src: imgSrc});
    this.canvas?.appendChild(pokemonObj.img);
    this.pokemon.push(pokemonObj);
    pokemonObj.draw();
    return pokemonObj;
  };

  removePokemonFromCanvas(id: string): void {
    const index = this.pokemon.findIndex((pokemon: PokemonObject): boolean => pokemon.id === id);

    if (index > -1) {
      this.pokemon[index].img.remove();
      this.pokemon.splice(index, 1);
    }
  };

  removeAllPokemonFromCanvas(): void {
    this.pokemon.forEach((pokemon: PokemonObject): void => {
      pokemon.img.remove();
    });

    this.pokemon = [];
  };

  setSpeed(speed: number): void {
    this.pokemon.forEach((pokemon: PokemonObject) => pokemon.speed = speed);
  };

  setSize(size: number): void {
    this.pokemon.forEach((pokemon: PokemonObject) => pokemon.setSize(size));
  };

  animate(): void {
    setTimeout(() => this.animate(), 20);

    this.pokemon.forEach((object: PokemonObject) => {
      object.detectCollision(this.canvas as HTMLElement);
      object.setFacingAngle();

      const x: number = Math.floor(object.speed * Math.cos(degreesToRadians(object.angle)));
      const y: number = Math.floor(object.speed * Math.sin(degreesToRadians(object.angle)));

      object.incrementImgX(x);
      object.incrementImgY(y);
    });
  };
};
