import { customAttributes, CustomAttribute as ICustomAttribute } from '@lume/custom-attributes';

export class CustomAttribute implements ICustomAttribute {
  static attributeName = '';

  static register() {
    customAttributes.define(this.attributeName, this);
  }

  name!: string;
  value!: string;
  ownerElement!: Element;
}

export interface Vertex {
  x: number;
  y: number;
}

export class MoveEvent extends CustomEvent<Vertex> {
  static eventType = 'move';

  constructor(vertex: Vertex) {
    super(MoveEvent.eventType, { detail: vertex, bubbles: true, cancelable: true });
  }
}

export class Moveable extends CustomAttribute {
  static attributeName = 'movable';

  ownerElement!: HTMLElement;

  #x = 0;
  #y = 0;

  connectedCallback() {
    this.ownerElement.addEventListener('pointerdown', this);
    this.ownerElement.addEventListener('lostpointercapture', this);
    this.ownerElement.addEventListener('touchstart', this);
    this.ownerElement.addEventListener('dragstart', this);
  }

  disconnectedCallback() {
    this.ownerElement.removeEventListener('pointerdown', this);
    this.ownerElement.removeEventListener('lostpointercapture', this);
    this.ownerElement.removeEventListener('touchstart', this);
    this.ownerElement.removeEventListener('dragstart', this);
  }

  handleEvent(event: PointerEvent) {
    switch (event.type) {
      case 'pointerdown': {
        if (event.button !== 0 || event.ctrlKey) return;

        this.#x = this.ownerElement.offsetLeft ?? 0;
        this.#y = this.ownerElement.offsetTop ?? 0;

        this.ownerElement.style.userSelect = 'none';
        this.ownerElement.style.cursor = 'grabbing';

        this.ownerElement.setPointerCapture(event.pointerId);
        this.ownerElement.addEventListener('pointermove', this);
        return;
      }
      case 'pointermove': {
        this.#x += event.movementX;
        this.#y += event.movementY;

        const notCancelled = this.ownerElement.dispatchEvent(
          new MoveEvent({ x: this.#x, y: this.#y })
        );

        if (notCancelled) {
          this.ownerElement.style.left = `${this.#x}px`;
          this.ownerElement.style.top = `${this.#y}px`;
        }

        return;
      }
      case 'lostpointercapture': {
        this.#x = 0;
        this.#y = 0;

        this.ownerElement.style.userSelect = '';
        this.ownerElement.style.cursor = '';

        this.ownerElement.removeEventListener('pointermove', this);
        return;
      }
      case 'touchstart':
      case 'dragstart': {
        event.preventDefault();
        return;
      }
    }
  }
}
