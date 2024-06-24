# The DOM as a substrate for live programming

## Abstract

...

## Introduction

Live programming environments are typically architected as walled gardens, a standalone application or website where computation and data is trapped, without escape. While these explorations have demonstrated a multitude of approaches and domains for live programming, there are unaddressed challenges around extending and composing such systems, and reusing primitives to build new ones. In other words, where is all of the ["heterogeneous live programming"](http://pane.s3-website-us-west-2.amazonaws.com/)? In [Engraft](https://engraft.dev/engraft-uist-2023.pdf), Joshua Horowitz and Jeffrey Heer demonstrated how to compose live and rich tools on the web, but much is left to be desired with composing "tools and environments in the outside world" or even the notion that an outside world exists, implying that

In this essay, we demonstrate how the DOM can be used as a substrate for building and composing live programming systems on any website. We embrace the DOM and show that we only need to extend it with a few primitives in order to achieve this goal.

## Connection

The DOM lacks a way to visually describe connection between elements. There are far and few of examples where symbolic connection is used in the DOM, including hash links and form inputs/labels. These connections are largely invisible to the user, except when implied by visual design. So let's extend the DOM by defining a [custom element](#) that can render an arrow between two elements. We will use the [`perfect-arrows` library](#) by Steve Ruiz to layout the arrow. Let's call our new element `perfect-arrow`:

```html
<square-node id="square1-1"></square-node>
<square-node id="square1-2"></square-node>
<perfect-arrow source="#square1-1" target="#square1-2"></perfect-arrow>
```

<square-node id="square1-1" style="position: absolute; left: 50px;"></square-node>
<square-node id="square1-2" style="position: absolute; left: 300px;"></square-node>
<perfect-arrow source="#square1-1" target="#square1-2"></perfect-arrow>
<horizontal-spacer style="height: 6rem"></horizontal-spacer>

We've declaratively described connection between two elements in HTML using CSS selectors in the `source` and `target` attributes of our new element and it renders an arrow between those two elements. This is quite trivial to implement, the non-trivial part is being able to display connection between elements that can arbitrarily move and resize. Here we use a proposed web standard called [custom attributes](#) to make any DOM element movable by clicking an dragging it.

```html
<square-node id="square2-1" movable></square-node>
<square-node id="square2-2" movable></square-node>
<perfect-arrow source="#square2-1" target="#square2-2"></perfect-arrow>
```

<square-node id="square2-1" movable style="left: 50px;"></square-node>
<square-node id="square2-2" movable style="left: 300px;"></square-node>
<perfect-arrow source="#square2-1" target="#square2-2"></perfect-arrow>
<horizontal-spacer style="height: 6rem"></horizontal-spacer>

A arrow is sticky, try dragging the boxes around. Arrow's can be declaratively attached to _any_ DOM element and any kind of movement or resizing will cause the arrow to rerender; responsive CSS layout, scrolling, and programmatic style changes. this is important because our custom element works standalone, arrows don't have to be orchestrated by a spatial canvas in order to work. They can be dropped into any website and used via a single script import that registers the custom element.

Now that we can define visual connection between elements let's explore ways we can directly manipulate connection. We can extend our previous custom element to update the `source` and `target` as they are dragged onto other elements.

```html
<square-node id="square3-1" movable></square-node>
<square-node id="square3-2" movable></square-node>
<square-node id="square3-3" movable></square-node>
<retargetable-arrow
  source="#square3-1"
  target="#square3-2"
  valid-source="square-node"
  valid-target="square-node"
></retargetable-arrow>
```

<square-node id="square3-1" movable style="left: 50px;"></square-node>
<square-node id="square3-2" movable style="left: 300px;"></square-node>
<square-node id="square3-3" movable style="left: 550px;"></square-node>
<retargetable-arrow source="#square3-1" target="#square3-2" valid-source="square-node" valid-target="square-node"></retargetable-arrow>
<horizontal-spacer style="height: 10rem"></horizontal-spacer>

## Live computation

### Propagator Network

Now that we can define connection between HTML elements, let's use that to preform some meaningful computation with it. We can start by implementing dataflow via a [propagator network](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=5dab26b9dac4e6a6ba5475c4aa304e12aa931f2d). We need to define a propagator element that takes a set of inputs and computes a output. We also need to augment our arrow with some additional behavior that facilitates the data flow between values and propagators.

<input name="celsius" type="number" value="0" movable style="left: 50px;" />
<input name="fahrenheit" type="number" value="32" movable style="left: 550px;" />

<prop-agator name="c-to-f" expression="(c * 9/5) + 32" movable style="left: 300px;"></prop-agator>

<!-- <prop-agator name="f-to-c" expression="(f - 32) * 5/9" movable style="left: 750px;"></prop-agator> -->

<propagator-arrow source="input[name='celsius']" target="prop-agator[name='c-to-f']" name="c"></propagator-arrow>
<propagator-arrow source="prop-agator[name='c-to-f']" target="input[name='fahrenheit']"></propagator-arrow>

<!-- <propagator-arrow source="input[name='fahrenheit']" target="prop-agator[name='f-to-c']" name="f"></propagator-arrow> -->

<!-- <propagator-arrow source="prop-agator[name='f-to-c']" target="input[name='celsius']"></propagator-arrow> -->

<horizontal-spacer style="height: 10rem;"></horizontal-spacer>

### State Machine

_TODO_

## Composability

_Show how to compose a propagator network and state machine can be composed together via our very simple DOM protocol._

## Metaprogramming

_Since everything is a DOM element we can perform computation on the live notations itself. Example include dynamically targeting arrows, or updating other attributes in a notation._

## Conclusion

_Things to explore include end-user programming (maybe via a chrome extension), how other rich notations compose together, and how to reflect changes back into source code._
