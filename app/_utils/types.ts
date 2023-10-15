export type XYZ = {
  x: number;
  y: number;
  z: number;
};

export type PieceType = 'straight' | 'right' | 'left' | 'up' | 'down';
export type TurnDirection = 'right' | 'left';
export type RampDirection = 'up' | 'down';

export type Path = THREE.LineCurve3 | THREE.QuadraticBezierCurve3 | THREE.CatmullRomCurve3;

export type Piece = {
  path: Path;
  nextDirection: XYZ;
  endPoint: XYZ;
  trackPieceVisual: () => JSX.Element;
};
