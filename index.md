## Abstract

...

## Introduction

Live programming environments are typically architected as walled gardens, a standalone
application or website where computation and data is trapped without escape. This leads to
challenges around extending and composing such systems, and reusing primitives to build new
ones. Where is all of the "heterogeneous live programming" ((PANE, Josh Horowitz (2018))[http://pane.s3-website-us-west-2.amazonaws.com/])? Here we demonstrate how the DOM can be used as a substrate for

Here we use custom elements to handle 3 distinct tasks:

1. Render itself to the screen
2. Update itself and it's relationships to other element
3. Participate in the live execution

## Canvas primitives

The first set of primitives necessary to build a live programming environment are those that give DOM elements the capabilities found in a spatial canvas. The ability for an element to be moved, resized, rotated, etc. We can enable this for any type of DOM element through custom attributes. dddd

```html
<div resizable></div>
```
