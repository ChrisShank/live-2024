import { Moveable } from './attributes.ts';
Moveable.register();

import { PerfectArrow } from './quiver/perfect-arrow.ts';
PerfectArrow.register();

import { RetargetableArrow } from './quiver/retargetable-arrow.ts';
RetargetableArrow.register();

import { PropagatorElement, PropagatorArrow } from './propagator-network.ts';
PropagatorElement.register();
PropagatorArrow.register();
