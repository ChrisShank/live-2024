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

We can make all types of shapes in the DOM using CSS `clip-path` and `mask`, no SVG necessary in many cases! See [this](https://www.smashingmagazine.com/2024/05/modern-guide-making-css-shapes/#cutting-corners) for more info.

````html
<triangle-node movable></triangle-node>
<square-node movable style="left: 150px;"></square-node>
<hexagon-node movable style="left: 300px;"></hexagon-node>```
````

<triangle-node movable></triangle-node>
<square-node movable style="left: 150px;"></square-node>
<hexagon-node movable style="left: 300px;"></hexagon-node>
<horizontal-spacer style="height: 6rem"></horizontal-spacer>

Next we need to be able to define connection between things. The browser has no way to do this, so lets define a custom element that can render an arrow between two elements. We will use the `perfect-arrow` library by Steve Ruiz to layout the arrow.

```html
<square-node id="square1" movable></square-node>
<square-node id="square2" movable style="left: 250px;"></square-node>
<perfect-arrow source="#square1" target="#square2"></perfect-arrow>
```

<square-node id="square1" movable></square-node>
<square-node id="square2" movable style="left: 250px;"></square-node>
<perfect-arrow source="#square1" target="#square2"></perfect-arrow>
<horizontal-spacer style="height: rem"></horizontal-spacer>

In HTML we've described connection between two elements using CSS selectors in the `source` and `target` attributes. A arrow is sticky, try dragging the boxes around. Arrow's can be declaratively attached to _any_ DOM element.

It's subtle, but this is an important difference between how connection usually works in live programming environments and spatial canvases and how it is implemented here. Usually an arrow's "stickiness" comes from it being tightly coupled to the node's resize and drag events. By defining connection
