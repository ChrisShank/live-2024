# The DOM as a substrate for live programming

## Abstract

...

## Introduction

Live programming environments are typically architected as walled gardens, a standalone application or website where computation and data is trapped without escape. This leads to challenges around extending and composing such systems, and reusing primitives to build new ones. Where is all of the "heterogeneous live programming" ([PANE, Josh Horowitz](http://pane.s3-website-us-west-2.amazonaws.com/))? Here we demonstrate how the DOM can be used as a substrate for

Here we use custom elements to handle 3 distinct tasks:

1. Render itself to the screen
2. Update itself and it's relationships to other element
3. Participate in the live execution

## Canvas primitives

The first set of primitives necessary to build a live programming environment are those that give DOM elements the capabilities found in a spatial canvas. The ability for an element to be moved, resized, rotated, etc. We can enable this for any type of DOM element through custom attributes.

```html
<input />
```

<input />

```html
<input moveable />
```

<input movable />
<horizontal-spacer style="height: 1rem;"></horizontal-spacer>

## Shapes

We can make all types of shapes in the DOM using CSS `clip-path` and `mask`, no SVG necessary in many cases! See [this](https://www.smashingmagazine.com/2024/05/modern-guide-making-css-shapes/#cutting-corners) for more info.

```html
<triangle-node movable style="left: 50px;"></triangle-node>
<square-node movable style="left: 200px;"></square-node>
<hexagon-node movable style="left: 350px;"></hexagon-node>
```

<triangle-node movable style="left: 50px;"></triangle-node>
<square-node movable style="left: 200px;"></square-node>
<hexagon-node movable style="left: 350px;"></hexagon-node>
<horizontal-spacer style="height: 6rem"></horizontal-spacer>

## Arrows

Next we need to be able to define connection between things. The browser has no way to do this, so lets define a custom element that can render an arrow between two elements. We will use the `perfect-arrow` library by Steve Ruiz to layout the arrow.

```html
<square-node id="square1" movable></square-node>
<square-node id="square2" movable></square-node>
<perfect-arrow source="#square1" target="#square2"></perfect-arrow>
```

<square-node id="square1-1" movable style="left: 50px;"></square-node>
<square-node id="square1-2" movable style="left: 300px;"></square-node>
<perfect-arrow source="#square1-1" target="#square1-2"></perfect-arrow>
<horizontal-spacer style="height: 6rem"></horizontal-spacer>

In HTML we've described connection between two elements using CSS selectors in the `source` and `target` attributes. A arrow is sticky, try dragging the boxes around. Arrow's can be declaratively attached to _any_ DOM element and any kind of movement or resizing will cause the arrow to rerender. CSS layout, scrolling, and programmatic updates included. In most live programming environments and spatial canvases an arrow's "stickiness" results from the tight coupling between a node's `resize` and `drag` events and the logic to rerender the arrow. A consequence of this is that only certain parts of the environment are blessed with stickiness and it only works in a canvas, not in any given website.

Now that we can define visual connection between elements lets explore ways we can directly manipulate connection. We can add a `retargetable` attribute to enable this

```html
<square-node id="square2-1" movable></square-node>
<square-node id="square2-2" movable></square-node>
<square-node id="square2-3" movable></square-node>
<retargetable-arrow
  source="#square2-1"
  target="#square2-2"
  valid-source="square-node"
  valid-target="square-node"
></retargetable-arrow>
```

<square-node id="square2-1" movable style="left: 50px;"></square-node>
<square-node id="square2-2" movable style="left: 300px;"></square-node>
<square-node id="square2-3" movable style="left: 550px;"></square-node>
<retargetable-arrow source="#square2-1" target="#square2-2" valid-source="square-node" valid-target="square-node"></retargetable-arrow>
<horizontal-spacer style="height: 10rem"></horizontal-spacer>
