import { v4 as uuidv4 } from 'uuid';
import { getRandomNumberInRange, degreesToRadians } from './helpers';
import type { Pokemon } from './interfaces';

interface Coord {
  x: number,
  y: number,
}

const maxAngle: number = 360;

const determineIfShiny = (increaseChance: boolean): boolean => {
  const shinyChance: number = 1;
  const shinyMaximum: number = increaseChance ? 30 : 100;
  const chance: number =  Math.floor(Math.random() * shinyMaximum) + 1;
  return chance <= shinyChance;
};

export class PokemonObject {
  position: Coord;
  prevPosition: Coord;
  src: string;
  speed: number;
  imgContainer: HTMLDivElement;
  img: HTMLImageElement;
  angle: number;
  className: string;
  id: string;
  isShiny: boolean;

  constructor({
    position = { x: 0, y: 0 },
    src = '',
  }, className = 'pokemon-sprite') {
    this.id = uuidv4();
    this.className = className;
    this.position = position;
    this.prevPosition = position;
    this.src = src;
    this.speed = 5;
    this.imgContainer = document.createElement('div');
    this.img = new Image();
    this.angle = 0;
    this.isShiny = false;
  };

  draw(): void {
    this.imgContainer.id = this.id;
    this.img.src = this.src;
    this.imgContainer.classList.add(this.className);
    this.imgContainer.style.top = this.position.y + 'px';
    this.imgContainer.style.left = this.position.x + 'px';
    this.imgContainer.appendChild(this.img);
    this.setRandomAngle();
  };

  getX(): number {
    return parseInt(this.imgContainer.style.left, 10);
  };

  getY(): number {
    return parseInt(this.imgContainer.style.top, 10);
  };

  incrementImgX(x: number): void {
    this.prevPosition.x = this.getX();
    this.imgContainer.style.left = this.getX() + x + 'px';
  };

  incrementImgY(y: number): void {
    this.prevPosition.y = this.getY();
    this.imgContainer.style.top = this.getY() + y + 'px';
  };

  setRandomAngle(): void {
    this.angle = Math.floor(Math.random() * maxAngle) + 1;
  };

  setFacingAngle(): void {
    if (this.getX() > this.prevPosition.x) {
      this.imgContainer.style.transform = 'scaleX(-1)';
    } else {
      this.imgContainer.style.transform = 'scaleX(1)';
    }
  };

  setSize(size: number): void {
    this.imgContainer.style.height = size + 'px';
    this.imgContainer.style.width = size + 'px';
  };

  detectCollision(canvas: HTMLElement): void {
    const canvasRect: DOMRect = canvas.getBoundingClientRect();
    const minAngleDiscrepancy: number = -15;
    const maxAngleDiscrepancy: number = 15;

    const setOppositeVerticalAngle = (): void => {
      this.angle = -this.angle + getRandomNumberInRange(maxAngleDiscrepancy, minAngleDiscrepancy);
    }

    const setOppositeHorizontalAngle = (): void => {
      this.angle = ((maxAngle / 2 - this.angle) + maxAngle) % maxAngle +
        getRandomNumberInRange(maxAngleDiscrepancy, minAngleDiscrepancy);
    };

    // Detect collision with top of screen
    if (this.getY() < 0) {
      this.imgContainer.style.top = '1px';
      setOppositeVerticalAngle();
    }

    // Detect collision with right of screen
    if (this.getX() + this.imgContainer.offsetWidth > canvas.offsetWidth + canvasRect.left) {
      this.imgContainer.style.left = `${canvas.offsetWidth + canvasRect.left - this.imgContainer.offsetWidth}px`;
      setOppositeHorizontalAngle();
    }

    // Detect collision with bottom of screen
    if (this.getY() + this.imgContainer.offsetHeight > canvas.offsetHeight) {
      this.imgContainer.style.top = `${canvas.offsetHeight - this.imgContainer.offsetHeight}px`;
      setOppositeVerticalAngle();
    }

    // Detect collision with left of screen
    if (this.getX() < canvasRect.left) {
      this.imgContainer.style.left = canvasRect.left + 'px';
      setOppositeHorizontalAngle();
    }
  };

  addShinyEffect(): void {
    const effectDuration = 1500;
    const star1: HTMLSpanElement = document.createElement('span');
    const star2: HTMLSpanElement = document.createElement('span');
    const star3: HTMLSpanElement = document.createElement('span');

    star1.classList.add('star', 'star--tl');
    star2.classList.add('star', 'star--tr');
    star3.classList.add('star', 'star--bm');

    this.imgContainer.appendChild(star1);
    this.imgContainer.appendChild(star2);
    this.imgContainer.appendChild(star3);

    setTimeout(() => {
      this.imgContainer.removeChild(star1);
      this.imgContainer.removeChild(star2);
      this.imgContainer.removeChild(star3);
    }, effectDuration);
  };
};

export class DrawApp {
  canvas: HTMLElement | null;
  pokemon: Array<PokemonObject>;

  constructor() {
    this.pokemon = [];
    this.canvas = null;
  };

  initialize(el: HTMLElement | null): void {
    this.canvas = el;
    this.animate();
  };

  addPokemonToCanvas(pokemon: Pokemon, position: Coord, options: { makeShiny: boolean, increaseChance: boolean }): PokemonObject {
    const isShiny: boolean = options.makeShiny ? determineIfShiny(options.increaseChance) : false;
    const pokemonObj = new PokemonObject({ position, src: isShiny ? pokemon.shinyImgUrl : pokemon.imgUrl });
    pokemonObj.isShiny = isShiny;
    this.canvas?.appendChild(pokemonObj.imgContainer);
    this.pokemon.push(pokemonObj);
    pokemonObj.draw();

    if (pokemonObj.isShiny) {
      pokemonObj.addShinyEffect();
    }

    return pokemonObj;
  };

  removePokemonFromCanvas(id: string): void {
    const index = this.pokemon.findIndex((pokemon: PokemonObject): boolean => pokemon.id === id);

    if (index > -1) {
      this.pokemon[index].imgContainer.remove();
      this.pokemon.splice(index, 1);
    }
  };

  removeAllPokemonFromCanvas(): void {
    this.pokemon.forEach((pokemon: PokemonObject): void => {
      pokemon.imgContainer.remove();
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
