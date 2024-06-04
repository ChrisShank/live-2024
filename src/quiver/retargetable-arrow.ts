import { PerfectArrow } from './perfect-arrow.ts';

export class RetargetableArrow extends PerfectArrow {
  static tagName = 'retargetable-arrow';

  #draggingType: 'source' | 'target' | '' = '';
  #selectorBeforeDrag = '';

  constructor() {
    super();

    this.addEventListener('pointerdown', this);
    this.addEventListener('lostpointercapture', this);
  }

  validSource(element: Element): boolean {
    const selector = this.getAttribute('valid-source') || '';
    return element.matches(selector);
  }

  sourceSelector(element: Element): string {
    return `#${element.id}`;
  }

  validTarget(element: Element): boolean {
    const selector = this.getAttribute('valid-target') || '';
    return element.matches(selector);
  }

  targetSelector(element: Element): string {
    return `#${element.id}`;
  }

  handleEvent(event: PointerEvent) {
    switch (event.type) {
      case 'pointerdown': {
        const target = event.composedPath()[0];

        if (!(target instanceof Element)) return;

        if (target.tagName === 'polygon') {
          this.#draggingType = 'target';
          this.#selectorBeforeDrag = this.target;
        } else if (target.tagName === 'circle') {
          this.#draggingType = 'source';
          this.#selectorBeforeDrag = this.source;
        } else {
          return;
        }

        this.addEventListener('pointermove', this);
        this.setPointerCapture(event.pointerId);
        this.style.opacity = '0.5';
        return;
      }
      case 'pointermove': {
        const element = document.elementFromPoint(event.clientX, event.clientY);

        if (element === null) return;

        if (this.#draggingType === 'source') {
          this.source = this.validSource(element)
            ? this.sourceSelector(element)
            : this.#selectorBeforeDrag;
        } else {
          this.target = this.validTarget(element)
            ? this.targetSelector(element)
            : this.#selectorBeforeDrag;
        }

        return;
      }
      case 'lostpointercapture': {
        this.#draggingType = '';
        this.#selectorBeforeDrag = '';
        this.style.opacity = '';
        this.removeEventListener('pointermove', this);
        return;
      }
    }
  }
}
