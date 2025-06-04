import { describe, it, expect } from 'vitest';
import { lambertProjection } from '../lambertProjection';

describe('lambertProjection', () => {
  it('projects origin correctly', () => {
    const [x, y] = lambertProjection(-96, 39);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
  });

  it('projects eastern US coordinate', () => {
    const [x, y] = lambertProjection(-75, 40);
    expect(x).toBeCloseTo(1.3839378389667728e-7, 10);
    expect(y).toBeCloseTo(3.298779184497184e-8, 10);
  });

  it('projects western US coordinate', () => {
    const [x, y] = lambertProjection(-120, 30);
    expect(x).toBeCloseTo(-1.8047117723841493e-7, 10);
    expect(y).toBeCloseTo(-7.261540329341054e-8, 10);
  });
});
