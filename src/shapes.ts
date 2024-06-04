// Refactored from https://css-generators.com/polygon-shape/

export interface ShapeOptions {
  type: 'filled' | 'border';
  sides: number;
  rotation?: number;
  borderWidth?: number;
  borderUnits?: string;
}

export function generateShape({
  type,
  sides,
  rotation = 0,
  borderWidth = 5,
  borderUnits = 'px',
}: ShapeOptions) {
  const angle = (2 * (rotation * Math.PI)) / sides;
  let shape = ``;

  let x1: number | string;
  let y1: number | string;

  switch (type) {
    case 'filled': {
      for (let i = 0; i < sides; i++) {
        x1 = 50 + 50 * Math.cos(angle + (2 * i * Math.PI) / sides);
        y1 = 50 + 50 * Math.sin(angle + (2 * i * Math.PI) / sides);

        shape += `${+x1.toFixed(2)}% ${+y1.toFixed(2)}%,`;
      }
      break;
    }
    case 'border': {
      for (var i = 0; i < sides; i++) {
        x1 = 50 + 50 * Math.cos(angle + (2 * i * Math.PI) / sides);
        y1 = 50 + 50 * Math.sin(angle + (2 * i * Math.PI) / sides);

        shape += `${+x1.toFixed(2)}% ${+y1.toFixed(2)}%,`;
      }
      x1 = 50 + 50 * Math.cos(angle);
      y1 = 50 + 50 * Math.sin(angle);
      shape += `${+x1.toFixed(2)}% ${+y1.toFixed(2)}%,`;

      if (borderUnits == '%') {
        for (var i = sides - 1; i >= 0; i--) {
          x1 = 50 + (50 - borderWidth) * Math.cos(angle + (2 * i * Math.PI) / sides);
          y1 = 50 + (50 - borderWidth) * Math.sin(angle + (2 * i * Math.PI) / sides);
          shape += `${+x1.toFixed(2)}% ${+y1.toFixed(2)}%,`;
        }
        x1 = 50 + (50 - borderWidth) * Math.cos(angle + (2 * (sides - 1) * Math.PI) / sides);
        y1 = 50 + (50 - borderWidth) * Math.sin(angle + (2 * (sides - 1) * Math.PI) / sides);
        shape += `${+x1.toFixed(2)}% ${+y1.toFixed(2)}%,`;
      } else {
        for (var i = sides - 1; i >= 0; i--) {
          x1 = `calc(${+(50 + 50 * Math.cos(angle + (2 * i * Math.PI) / sides)).toFixed(2)}% - ${+(
            borderWidth * Math.cos(angle + (2 * i * Math.PI) / sides)
          ).toFixed(2)}${borderUnits})`;
          y1 = `calc(${+(50 + 50 * Math.sin(angle + (2 * i * Math.PI) / sides)).toFixed(2)}% - ${+(
            borderWidth * Math.sin(angle + (2 * i * Math.PI) / sides)
          ).toFixed(2)}${borderUnits})`;
          shape += `${x1} ${y1},`;
        }
        x1 = `calc(${+(50 + 50 * Math.cos(angle + (2 * (sides - 1) * Math.PI) / sides)).toFixed(
          2
        )}% - ${+(borderWidth * Math.cos(angle + (2 * (sides - 1) * Math.PI) / sides)).toFixed(
          2
        )}${borderUnits})`;
        y1 = `calc(${+(50 + 50 * Math.sin(angle + (2 * (sides - 1) * Math.PI) / sides)).toFixed(
          2
        )}% - ${+(borderWidth * Math.sin(angle + (2 * (sides - 1) * Math.PI) / sides)).toFixed(
          2
        )}${borderUnits})`;
        shape += `${x1} ${y1},`;
      }

      break;
    }
  }

  shape = shape.slice(0, -1);

  return `polygon(${shape})`;
}
