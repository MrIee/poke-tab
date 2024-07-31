import throttle from "lodash.throttle";
import { DockedEvent } from './interfaces';

interface DockableElementOptions {
  handleElement: HTMLElement | null;
  backgroundElement?: HTMLElement | null;
};

export const getRandomNumberInRange = (max: number, min: number): number => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
}

export const getUniqueRandomItems = (array: Array<any>, numberOfItems: number): Array<any> => {
  const uniqueArray: Array<any> = [];
  const size = numberOfItems || array.length;
  const unique: Array<number> = [];
  let i: number = 0;

  while (i < size) {
    const randomIndex: number = Math.floor(Math.random() * array.length);

    if (unique.indexOf(randomIndex) === -1) {
      uniqueArray.push(array[randomIndex]);
      i++;
    }

    unique.push(randomIndex);
  };

  return uniqueArray;
};

export const keepElementWithinScreen = (element: HTMLElement, elementLeft: number, elementTop: number): void => {
  const elRect: DOMRect = element.getBoundingClientRect();

  // Top
  if (elementTop < 0) {
    element.style.top = '0px';
  }

  // Bottom
  if (elementTop + elRect.height > window.innerHeight) {
    element.style.top = `${window.innerHeight - elRect.height}px`;
  }

  // Left
  if (elementLeft < 0) {
    element.style.left = '0px';
  }

  // Right
  if (elementLeft + elRect.width > window.innerWidth) {
    element.style.left = `${window.innerWidth - elRect.width}px`;
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

export const makeElementDraggable = (draggableElement: HTMLElement, handleElement?: HTMLElement): void => {
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
      keepElementWithinScreen(draggableEl, parseInt(draggableEl.style.left, 10), parseInt(draggableEl.style.top, 10));
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

export const positionElementAtCursor = (el: HTMLElement, event: PointerEvent): void => {
  const pickerRect: DOMRect = el.getBoundingClientRect();

  el.style.top = `${event.clientY}px`;
  el.style.left = `${event.clientX}px`;

  if (event.clientY + pickerRect.height > window.innerHeight) {
    el.style.top = `${window.innerHeight - pickerRect.height}px`;
  }

  if (event.clientX + pickerRect.width > window.innerWidth) {
    el.style.left = `${window.innerWidth - pickerRect.width}px`;
  }
};

export const makeElementDockable = (dockableElement: HTMLElement, options: DockableElementOptions = {
  handleElement: null,
  backgroundElement: null,
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
    elementDockedEvent = dockElementIfTouchingSide(dockableEl, options.backgroundElement as HTMLElement);
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

export const applyDockedStyles = (dockedElement: HTMLElement, backgroundElement: HTMLElement, side: string): void => {
  dockedElement.style.top = '0px';

  if (side === 'left') {
    dockedElement.style.height = '100%';
    dockedElement.style.left = '0px';
    backgroundElement.style.left = dockedElement.offsetWidth + `px`;
  } else {
    dockedElement.style.height = '100%';
    dockedElement.style.left = window.innerWidth - dockedElement.offsetWidth + 'px';
    backgroundElement.style.width = window.innerWidth - dockedElement.offsetWidth + `px`;
  }
};

export const removeDockedStyles = (dockableElement: HTMLElement, backgroundElement: HTMLElement): void => {
  dockableElement.style.height = 'auto';
  backgroundElement.style.width = 'auto';
  backgroundElement.style.left = '0px';
};

export const dockElementIfTouchingSide = (dockableElement: HTMLElement, backgroundElement: HTMLElement): DockedEvent => {
  const elRect: DOMRect = dockableElement.getBoundingClientRect();
  const isTouchingLeftSideOfScreen: boolean = elRect.left <= 0;
  const isElTouchingRightSideOfScreen: boolean = elRect.left + elRect.width >= window.innerWidth;
  let isDocked: boolean = false;
  let dockedSide: string = '';

  if (isTouchingLeftSideOfScreen) {
    applyDockedStyles(dockableElement, backgroundElement, 'left');
    isDocked = true;
    dockedSide = 'left';
  } else if (!isElTouchingRightSideOfScreen) {
    removeDockedStyles(dockableElement, backgroundElement);
    isDocked = false;
    dockedSide = '';
  }

  if (isElTouchingRightSideOfScreen) {
    applyDockedStyles(dockableElement, backgroundElement, 'right');
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

