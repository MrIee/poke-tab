export const getRandomNumberInRange = (max: number, min: number): number => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
}

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

  const drag = (event: Event): void => {
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
    }

    const onMouseUp = (): void => {
      removeListenerFromEvents(document, ['mousemove', 'touchmove'], onMouseMove);
      removeListenerFromEvents(handleEl, ['mouseup', 'touchend'], onMouseUp);
    }

    addListenerToEvents(document, ['mousemove', 'touchmove'], onMouseMove);
    addListenerToEvents(handleEl, ['mouseup', 'touchend'], onMouseUp);
  }

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
}
