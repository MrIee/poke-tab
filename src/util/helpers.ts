import throttle from "lodash.throttle";
import { type DockedEvent, type Pokemon, type Padding } from './interfaces';

interface DockableElementOptions {
  handleElement: HTMLElement | null;
  backgroundElement?: HTMLElement | null;
  padding: Padding;
};

interface DockedStylesOptions {
  side: String;
  padding: Padding;
};


// ================ Utility Functions ================

export const getRandomNumberInRange = (max: number, min: number): number => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
}

export const getUniqueRandomItems = (array: Array<any>, numberOfItems: number, callback?: Function): Array<any> => {
  const uniqueArray: Array<any> = [];
  const size = numberOfItems || array.length;
  const unique: Array<number> = [];
  let i: number = 0;

  while (i < size) {
    const randomIndex: number = Math.floor(Math.random() * array.length);

    if (unique.indexOf(randomIndex) === -1) {
      callback && callback(array[randomIndex], randomIndex);
      uniqueArray.push(array[randomIndex]);
      i++;
    }

    unique.push(randomIndex);
  };

  return uniqueArray;
};


// ================ DOM Functions ================

export const keepElementWithinScreen = (element: HTMLElement, padding: Padding = {top: 0, right: 0, bottom: 0, left: 0 }): void => {
  const elRect: DOMRect = element.getBoundingClientRect();

  // Top
  if (elRect.top < 0 + padding.top) {
    element.style.top = padding.top + 'px';
  }

  // Bottom
  if (elRect.top + elRect.height > window.innerHeight - padding.bottom) {
    element.style.top = `${window.innerHeight - padding.bottom - elRect.height}px`;
  }

  // Left
  if (elRect.left < 0 + padding.left) {
    element.style.left = padding.left + 'px';
  }

  // Right
  if (elRect.left + elRect.width > window.innerWidth - padding.right) {
    element.style.left = `${window.innerWidth - padding.right - elRect.width}px`;
  }
};

export const addListenerToEvents = (el: HTMLElement | Document, events: Array<string>, callback: (event: Event) => void): void => {
  events.forEach((event: string) => {
    el.addEventListener(event, callback);
  });
};

export const removeListenerFromEvents = (el: HTMLElement | Document, events: Array<string>, callback: (event: Event) => void): void => {
  events.forEach((event: string) => {
    el.removeEventListener(event, callback);
  });
};

export const makeElementDraggable = (draggableElement: HTMLElement, handleElement?: HTMLElement, padding: Padding = {top: 0, right: 0, bottom: 0, left: 0 }): void => {
  const draggableEl: HTMLElement = draggableElement;
  const handleEl: HTMLElement = handleElement || draggableElement;
  let clientX: number = 0;
  let clientY: number = 0;

  const drag = throttle((event: Event): void => {
    if (event instanceof MouseEvent) {
      const e = event as MouseEvent;
      e.preventDefault();
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (event instanceof TouchEvent) {
      const e = event as TouchEvent;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const shiftX = clientX - draggableEl.getBoundingClientRect().left;
    const shiftY = clientY - draggableEl.getBoundingClientRect().top;

    const moveAt = (pageX: number, pageY: number): void => {
      draggableEl.style.left = pageX - shiftX + 'px';
      draggableEl.style.top = pageY - shiftY + 'px';
      keepElementWithinScreen(draggableEl, padding);
    }

    const onMouseMove = (event: Event): void => {
      if (event instanceof MouseEvent) {
        const e = event as MouseEvent;
        e.preventDefault();
        moveAt(e.pageX, e.pageY);
      } else if (event instanceof TouchEvent) {
        const e = event as TouchEvent;
        moveAt(Math.floor(e.touches[0].clientX), Math.floor(e.touches[0].clientY));
      }
    };

    const onMouseUp = throttle((): void => {
      removeListenerFromEvents(document, ['mousemove', 'touchmove'], onMouseMove);
      removeListenerFromEvents(handleEl, ['mouseup', 'touchend'], onMouseUp);
    }, 100);

    addListenerToEvents(document, ['mousemove', 'touchmove'], onMouseMove);
    addListenerToEvents(handleEl, ['mouseup', 'touchend'], onMouseUp);
  }, 100);

  removeListenerFromEvents(handleEl, ['mousedown', 'touchstart'], drag);
  addListenerToEvents(handleEl, ['mousedown', 'touchstart'], drag);
};

export const positionElementAtCursor = (el: HTMLElement, event: PointerEvent, padding: Padding = { top:0, right: 0, bottom: 0, left: 0 }): void => {
  const pickerRect: DOMRect = el.getBoundingClientRect();

  el.style.top = `${event.clientY}px`;
  el.style.left = `${event.clientX}px`;

  if (event.clientY + pickerRect.height > window.innerHeight - padding.bottom) {
    el.style.top = `${window.innerHeight - pickerRect.height - padding.bottom}px`;
  }

  if (event.clientX + pickerRect.width > window.innerWidth - padding.right) {
    el.style.left = `${window.innerWidth - pickerRect.width - padding.right}px`;
  }
};

export const makeElementDockable = (dockableElement: HTMLElement, options: DockableElementOptions = {
  handleElement: null,
  backgroundElement: null,
  padding: { top:0, right: 0, bottom: 0, left: 0 },
}): void => {
  const dockableEl: HTMLElement = dockableElement;
  const handleEl: HTMLElement = options.handleElement || dockableEl;
  let undockedEvent = new CustomEvent('undocked');
  let dockedEvent = new CustomEvent('docked');
  let elementDockedEvent: DockedEvent = {} as DockedEvent;

  const dockOnMouseUp = throttle(() => {
    const event = new Event('mouseup');
    handleEl.dispatchEvent(event);

    if (elementDockedEvent.docked) {
      dockableElement.dispatchEvent(dockedEvent);
    } else {
      dockableElement.dispatchEvent(undockedEvent);
    }
  }, 100);

  const dockElement = throttle((): void => {
    elementDockedEvent = dockElementIfTouchingSide(dockableEl, options.backgroundElement as HTMLElement, options.padding);
    dockedEvent = new CustomEvent('docked', { detail: elementDockedEvent });
    undockedEvent = new CustomEvent('undocked', { detail: elementDockedEvent });
  }, 100);

  removeListenerFromEvents(handleEl, ['mousemove', 'touchmove'], dockElement);
  removeListenerFromEvents(dockableEl, ['mousemove', 'touchmove'], dockElement);
  removeListenerFromEvents(dockableEl, ['mouseup', 'touchend'], dockOnMouseUp);

  addListenerToEvents(handleEl, ['mousemove', 'touchmove'], dockElement);
  addListenerToEvents(dockableEl, ['mousemove', 'touchmove'], dockElement);
  addListenerToEvents(dockableEl, ['mouseup', 'touchend'], dockOnMouseUp);
};

export const applyDockedStyles = (
  dockedElement: HTMLElement,
  backgroundElement: HTMLElement,
  options: DockedStylesOptions = {
    side: '',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  },
): void => {
  dockedElement.style.top = options.padding.top + 'px';
  dockedElement.style.bottom = options.padding.bottom + 'px';
  dockedElement.style.height = `calc(100% - (${options.padding.top + options.padding.bottom}px))`;

  if (options.side && options.side === 'left') {
    dockedElement.style.left = options.padding.left + 'px';
    backgroundElement.style.left = dockedElement.offsetWidth + `px`;
  } else {
    dockedElement.style.left = window.innerWidth - dockedElement.offsetWidth - options.padding.right + 'px';
    backgroundElement.style.width = window.innerWidth - dockedElement.offsetWidth + `px`;
  }
};

export const removeDockedStyles = (dockableElement: HTMLElement, backgroundElement: HTMLElement): void => {
  dockableElement.style.height = 'auto';
  backgroundElement.style.width = 'auto';
  backgroundElement.style.left = '0px';
  dockableElement.style.bottom = 'auto';
};

export const dockElementIfTouchingSide = (
  dockableElement: HTMLElement,
  backgroundElement: HTMLElement,
  padding: Padding = { top: 0, right: 0, bottom: 0, left: 0 },
): DockedEvent => {
  const elRect: DOMRect = dockableElement.getBoundingClientRect();
  const isTouchingLeftSideOfScreen: boolean = elRect.left <= padding.left;
  const isElTouchingRightSideOfScreen: boolean = elRect.left + elRect.width + padding.right >= window.innerWidth;
  let isDocked: boolean = false;
  let dockedSide: string = '';

  if (isTouchingLeftSideOfScreen) {
    applyDockedStyles(dockableElement, backgroundElement, { side: 'left', padding });
    isDocked = true;
    dockedSide = 'left';
  } else if (!isElTouchingRightSideOfScreen) {
    removeDockedStyles(dockableElement, backgroundElement);
    isDocked = false;
    dockedSide = '';
  }

  if (isElTouchingRightSideOfScreen) {
    applyDockedStyles(dockableElement, backgroundElement, { side: 'right', padding });
    isDocked = true;
    dockedSide = 'right';
  } else if (!isTouchingLeftSideOfScreen) {
    removeDockedStyles(dockableElement, backgroundElement);
    isDocked = false;
    dockedSide = '';
  }

  return {
    docked: isDocked,
    side: dockedSide,
  };
};


// ================ Pokemon Functions ================

export const makePokemonShiny = (pokemon: Pokemon): Pokemon => {
  pokemon.isShiny = false;

  if (!pokemon.isShiny) {
    const shinyChance: number = 1;
    const shinyMaximum: number = 100;
    const chance: number =  Math.floor(Math.random() * shinyMaximum) + 1;
    pokemon.isShiny = chance <= shinyChance;
  }

  return pokemon;
};
