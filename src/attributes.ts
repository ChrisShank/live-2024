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

export class Moveable extends CustomAttribute {
  static attributeName = 'movable';

  left = 0;
  top = 0;

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

        this.left = (this.ownerElement as HTMLElement).offsetLeft;
        this.top = (this.ownerElement as HTMLElement).offsetTop;

        (this.ownerElement as HTMLElement).style.userSelect = 'none';
        (this.ownerElement as HTMLElement).style.cursor = 'grabbing';

        this.ownerElement.setPointerCapture(event.pointerId);
        this.ownerElement.addEventListener('pointermove', this);
        return;
      }
      case 'pointermove': {
        this.left += event.movementX;
        this.top += event.movementY;
        (this.ownerElement as HTMLElement).style.left = `${this.left}px`;
        (this.ownerElement as HTMLElement).style.top = `${this.top}px`;
        return;
      }
      case 'lostpointercapture': {
        this.left = 0;
        this.top = 0;

        (this.ownerElement as HTMLElement).style.userSelect = '';
        (this.ownerElement as HTMLElement).style.cursor = '';

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
