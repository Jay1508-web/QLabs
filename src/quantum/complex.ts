import { Complex } from '../types/quantum';

export const EPSILON = 1e-10;

export function complex(re: number, im: number = 0): Complex {
  return {
    re: Math.abs(re) < EPSILON ? 0 : re,
    im: Math.abs(im) < EPSILON ? 0 : im
  };
}

export function cAdd(a: Complex, b: Complex): Complex {
  return complex(a.re + b.re, a.im + b.im);
}

export function cSub(a: Complex, b: Complex): Complex {
  return complex(a.re - b.re, a.im - b.im);
}

export function cMul(a: Complex, b: Complex): Complex {
  return complex(
    a.re * b.re - a.im * b.im,
    a.re * b.im + a.im * b.re
  );
}

export function cScale(a: Complex, scalar: number): Complex {
  return complex(a.re * scalar, a.im * scalar);
}

export function cDiv(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im;
  if (denom < EPSILON) {
    throw new Error('Complex division by zero');
  }
  return complex(
    (a.re * b.re + a.im * b.im) / denom,
    (a.im * b.re - a.re * b.im) / denom
  );
}

export function cMag(a: Complex): number {
  return Math.hypot(a.re, a.im);
}

export function cMagSq(a: Complex): number {
  return a.re * a.re + a.im * a.im;
}

export function cPhase(a: Complex): number {
  let angle = Math.atan2(a.im, a.re);
  if (angle < 0) {
    angle += 2 * Math.PI;
  }
  return angle;
}

export function cConj(a: Complex): Complex {
  return complex(a.re, -a.im);
}

export function cExp(theta: number): Complex {
  return complex(Math.cos(theta), Math.sin(theta));
}

export function formatComplex(c: Complex, decimals: number = 3): string {
  const re = Math.abs(c.re) < 1e-4 ? 0 : Number(c.re.toFixed(decimals));
  const im = Math.abs(c.im) < 1e-4 ? 0 : Number(c.im.toFixed(decimals));

  if (im === 0) {
    return `${re}`;
  }
  if (re === 0) {
    if (im === 1) return 'i';
    if (im === -1) return '-i';
    return `${im}i`;
  }
  const sign = im > 0 ? '+' : '-';
  const absIm = Math.abs(im);
  const imStr = absIm === 1 ? 'i' : `${absIm}i`;
  return `${re} ${sign} ${imStr}`;
}
