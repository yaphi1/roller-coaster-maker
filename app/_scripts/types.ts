export type XYZ = {
  x: number;
  y: number;
  z: number;
};

export type PieceType = 'straight' | 'right' | 'left' | 'up' | 'down' | 'loop_left' | 'loop_right';
export type TurnDirection = 'right' | 'left';
export type RampDirection = 'up' | 'down';

export type Path = THREE.LineCurve3 | THREE.QuadraticBezierCurve3 | THREE.CatmullRomCurve3 | THREE.CurvePath<THREE.Vector3>;

export type Piece = {
  path: Path;
  startPoint: XYZ;
  endPoint: XYZ;
  direction: XYZ;
  nextDirection: XYZ;
  trackPieceVisual: () => JSX.Element;
  upwardVectors: THREE.Vector3[];
};

export type PathVisual = ((() => JSX.Element) | undefined);

export type Track = {
  path: Path;
  visuals: PathVisual[];
  pieces: Piece[];
  upwardVectors: THREE.Vector3[];
};

export type CollisionZone = {
  x: { min: number; max: number; };
  y: { min: number; max: number; };
  z: { min: number; max: number; };
};

export type CameraType = 'orbital' | 'coasterFocus' | 'firstPerson';

export type ColorableItem = 'train' | 'rails' | 'scaffolding';

export type CoasterColors = Record<ColorableItem, string>;
