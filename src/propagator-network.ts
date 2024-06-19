import { RetargetableArrow } from './quiver/retargetable-arrow';

interface AsyncFunctionConstructor {
  /**
   * Creates a new function.
   * @param args A list of arguments the function accepts.
   */
  new (...args: string[]): Function;
  (...args: string[]): Function;
  readonly prototype: Function;
}

export class PropagateEvent<T = unknown> extends CustomEvent<T> {
  static eventType = 'propagate';

  constructor(detail?: T) {
    super(PropagateEvent.eventType, { detail, bubbles: true, cancelable: true });
  }
}

const AsyncFunction = async function () {}.constructor as AsyncFunctionConstructor;

export class PropagatorElement extends HTMLElement {
  static tagName = 'prop-agator';

  static register() {
    customElements.define(this.tagName, this);
  }

  #inputs = new Map<string, any>();

  #value: any = undefined;

  get value() {
    return this.#value;
  }

  get expression(): string {
    return this.getAttribute('expression') || '';
  }

  set expression(expression: string) {
    this.setAttribute('expression', expression);
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === 'expression' && newValue != null) {
      this.evaluate();
    }
  }

  setArgument(name?: string | null, value?: any) {
    if (name != null) {
      this.#inputs.set(name, value);
    }

    this.evaluate();
  }

  removeArgument(name: string) {
    this.#inputs.delete(name);
    this.evaluate();
  }

  async evaluate() {
    if (this.expression === '') return;

    const argNames = Array.from(this.#inputs.keys());
    const args = Array.from(this.#inputs.values());

    let functionBody = this.expression;

    if (!functionBody.includes('return')) {
      functionBody = `return ${functionBody}`;
    }

    try {
      const func = new AsyncFunction(...argNames, functionBody);
      const result = await func(...args);

      if (result !== undefined) {
        this.#value = result;
        this.dispatchEvent(new PropagateEvent(result));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

interface CellMetadata {
  eventType?: string;
  getValue?: (element: Element) => any;
  setValue?: (element: Element, value: any) => void;
}

export class PropagatorArrow extends RetargetableArrow {
  static tagName = 'propagator-arrow';

  static cellMetadata = new Map<Function, CellMetadata>([
    [
      PropagatorElement,
      {
        eventType: PropagateEvent.eventType,
        getValue: (el) => (el as PropagatorElement).value,
      },
    ],
    [
      HTMLInputElement,
      {
        eventType: 'input',
        getValue: (element) => {
          const input = element as HTMLInputElement;
          switch (input.type) {
            case 'range':
            case 'number':
              return input.valueAsNumber;

            case 'radio':
            case 'checkbox':
              return input.checked;

            case 'time':
            case 'datetime-local':
            case 'week':
            case 'date':
              return input.valueAsDate;

            default:
              return input.value;
          }
        },
        setValue(element, value) {
          const input = element as HTMLInputElement;
          console.log(input, input.value, value);
          switch (input.type) {
            case 'range':
            case 'number':
              value = +value;
              if (!Number.isNaN(value)) {
                input.valueAsNumber = value;
              }
              return;
            case 'radio':
            case 'checkbox':
              input.checked = !!value;
              return;
            case 'time':
            case 'datetime-local':
            case 'week':
            case 'date':
              input.valueAsDate = new Date(value);
              return;
            default:
              input.value = String(value);
              return;
          }
        },
      },
    ],
    [
      HTMLFormElement,
      {
        eventType: 'submit',
        getValue: (el) => new FormData(el as HTMLFormElement),
        setValue: (el, value) => {
          const form = el as HTMLFormElement;

          for (const [key, val] of Object.entries(value)) {
            const input = form.elements.namedItem(key);

            if (input === null) return;

            if (input instanceof HTMLInputElement) {
              input.value = val as any;
            }
          }
        },
      },
    ],
  ]);

  #propagationEvents = new Set(
    Array.from((this.constructor as typeof PropagatorArrow).cellMetadata.values()).map(
      (p) => p.eventType
    )
  );

  get name(): string {
    return this.getAttribute('name') || '';
  }

  set name(name: string) {
    this.setAttribute('name', name);
  }

  #getCellMetadata(element: Element) {
    const propagators = (this.constructor as typeof PropagatorArrow).cellMetadata;
    return propagators.get(element.constructor as typeof Element);
  }

  observeSource() {
    super.observeSource();

    if (this.sourceElement === null) return;

    this.sourceElement.addEventListener(PropagateEvent.eventType, this);

    const cellMetadata = this.#getCellMetadata(this.sourceElement);
    if (cellMetadata !== undefined && cellMetadata.eventType !== undefined) {
      this.sourceElement.addEventListener(cellMetadata.eventType, this);
    }
  }

  unobserveSource() {
    super.unobserveSource();

    if (this.sourceElement === null) return;

    this.sourceElement?.removeEventListener(PropagateEvent.eventType, this);

    const propagator = this.#getCellMetadata(this.sourceElement);
    if (propagator !== undefined && propagator.eventType !== undefined) {
      this.sourceElement.removeEventListener(propagator.eventType, this);
    }
  }

  observeTarget() {
    super.observeTarget();

    this.handleUpdate();
  }

  unobserveTarget() {
    super.unobserveTarget();

    if (this.targetElement instanceof PropagatorElement) {
      this.targetElement.removeArgument(this.name);
    }
  }

  validTarget(element: Element) {
    return element.matches(':not(body, propagator-arrow)');
  }

  targetSelector(element: Element) {
    return `${element.tagName}[name='${element.getAttribute('name')}']`;
  }

  handleEvent(event: Event) {
    super.handleEvent(event as PointerEvent);

    if (this.#propagationEvents.has(event.type)) {
      this.handleUpdate();
    }
  }

  handleUpdate(event?: Event) {
    if (this.sourceElement === null || this.targetElement === null) return;
    let value: any;

    if (event instanceof PropagateEvent) {
      value = event.detail;
    } else {
      const sourceMetadata = this.#getCellMetadata(this.sourceElement);
      if (sourceMetadata?.getValue !== undefined) {
        value = sourceMetadata.getValue(this.sourceElement);
      }
    }

    if (this.targetElement instanceof PropagatorElement) {
      this.targetElement.setArgument(this.name, value);
    } else if (value !== undefined) {
      const targetMetadata = this.#getCellMetadata(this.targetElement);
      if (targetMetadata?.setValue !== undefined && targetMetadata?.getValue !== undefined) {
        const previousValue = targetMetadata.getValue(this.targetElement);
        if (value !== previousValue) {
          targetMetadata.setValue(this.targetElement, value);
          this.targetElement.dispatchEvent(new PropagateEvent(value));
        }
      }
    }
  }

  render(...args: [DOMRectReadOnly, DOMRectReadOnly]) {
    super.render(...args);

    const [, , cx, cy] = this.arrow;
    this.style.setProperty('--cx', `${cx}px`);
    this.style.setProperty('--cy', `${cy}px`);
  }
}
