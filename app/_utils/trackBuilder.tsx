import * as THREE from 'three';

type XYZ = {
  x: number;
  y: number;
  z: number;
};

type PieceType = 'straight' | 'right' | 'left' | 'up' | 'down';
type TurnDirection = 'right' | 'left';
type RampDirection = 'up' | 'down';

type Path = THREE.LineCurve3 | THREE.QuadraticBezierCurve3 | THREE.CatmullRomCurve3;

type Piece = {
  path: Path;
  nextDirection: XYZ;
  endPoint: XYZ;
  trackPieceVisual: () => JSX.Element;
};

type TurnPoints = {
  start: XYZ;
  end: XYZ;
  control: XYZ;
  direction: XYZ;
  nextDirection: XYZ;
};

const straightAwayLength = 4;

function buildRampPiece(startPoint: XYZ, direction: XYZ, rampDirection: RampDirection): Piece {
  const { x, y, z } = startPoint;

  const nextDirection = {
    x: direction.x,
    y: rampDirection === 'up' ? direction.y + 1 : direction.y - 1,
    z: direction.z,
  };

  const elevationChangeMagnitude = straightAwayLength * 0.5;
  const elevationChangeDirection = direction.y === 0 ? nextDirection.y : direction.y;
  const elevationChange = elevationChangeDirection * elevationChangeMagnitude;

  const endPoint = {
    x: x + direction.x * straightAwayLength,
    y: y + elevationChange,
    z: z + direction.z * straightAwayLength,
  };

  const controlPointDistanceFromStart = straightAwayLength * 0.5;

  const controlPoint = {
    x: x + direction.x * controlPointDistanceFromStart,
    y: direction.y === 0 ? y : endPoint.y,
    z: z + direction.z * controlPointDistanceFromStart,
  };

  const path = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(controlPoint.x, controlPoint.y, controlPoint.z),
    new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
  );

  const trackPieceVisual = buildRampPieceVisual(path, direction);

  return {
    path,
    nextDirection,
    endPoint,
    trackPieceVisual,
  };
}

function buildRampPieceVisual(path: Path, direction: XYZ) {
  const tubularSegments = 20;
  const radius = 0.1;
  const radialSegments = 8;
  const railOffset = 0.5;

  const isMovingOnXAxis = direction.x !== 0;

  const firstRailPosition = new THREE.Vector3(
    ...(isMovingOnXAxis ? [0, 0, -railOffset] : [-railOffset, 0, 0])
  );
  const secondRailPosition = new THREE.Vector3(
    ...(isMovingOnXAxis ? [0, 0, railOffset] : [railOffset, 0, 0])
  );

  const Rail = ({ position }: { position: THREE.Vector3 }) => (
    <mesh position={position}>
      <tubeGeometry args={[path, tubularSegments, radius, radialSegments]} />
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );

  return () => (
    <group>
      <Rail position={firstRailPosition} />
      <Rail position={secondRailPosition} />
    </group>
  );
}

function buildStraightPiece(startPoint: XYZ, direction: XYZ): Piece {
  const { x, y, z } = startPoint;
  const endPoint = {
    x: x + direction.x * straightAwayLength,
    y: y + direction.y * straightAwayLength,
    z: z + direction.z * straightAwayLength,
  };
  const path = new THREE.LineCurve3(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
  );

  const trackPieceVisual = buildStraightPieceVisual(path, direction);

  return {
    path,
    nextDirection: direction,
    endPoint,
    trackPieceVisual,
  };
}

function buildStraightPieceVisual(path: Path, direction: XYZ) {
  const tubularSegments = 1;
  const radius = 0.1;
  const radialSegments = 8;
  const railOffset = 0.5;

  const isMovingOnXAxis = direction.x !== 0;

  const firstRailPosition = new THREE.Vector3(
    ...(isMovingOnXAxis ? [0, 0, -railOffset] : [-railOffset, 0, 0])
  );
  const secondRailPosition = new THREE.Vector3(
    ...(isMovingOnXAxis ? [0, 0, railOffset] : [railOffset, 0, 0])
  );

  const Rail = ({ position }: { position: THREE.Vector3 }) => (
    <mesh position={position}>
      <tubeGeometry args={[path, tubularSegments, radius, radialSegments]} />
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );

  return () => (
    <group>
      <Rail position={firstRailPosition} />
      <Rail position={secondRailPosition} />
    </group>
  );
}

function getNextDirection(direction: XYZ, turnDirection: TurnDirection): XYZ {
  const turnDirectionAsNumber = turnDirection === 'right' ? 1 : -1;
  return {
    x: direction.x === 0 ? -turnDirectionAsNumber * direction.z : 0,
    y: direction.y,
    z: direction.z === 0 ? turnDirectionAsNumber * direction.x : 0,
  };
}

function buildTurnPiece(startPoint: XYZ, direction: XYZ, turnDirection: TurnDirection): Piece {
  const { x, y, z } = startPoint;
  const controlPoint = {
    x: x + direction.x * straightAwayLength,
    y: y + direction.y * straightAwayLength,
    z: z + direction.z * straightAwayLength,
  };

  const nextDirection = getNextDirection(direction, turnDirection);
  
  const endPoint = {
    x: controlPoint.x + nextDirection.x * straightAwayLength,
    y: controlPoint.y + nextDirection.y * straightAwayLength,
    z: controlPoint.z + nextDirection.z * straightAwayLength,
  };

  const path = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(controlPoint.x, controlPoint.y, controlPoint.z),
    new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
  );

  const turnPoints = {
    start: startPoint,
    end: endPoint,
    control: controlPoint,
    direction,
    nextDirection,
  };

  const trackPieceVisual = buildTurnPieceVisual(turnPoints, path);

  return {
    path,
    nextDirection,
    endPoint,
    trackPieceVisual,
  };
}

// function buildTurnPieceVisual(path: Path, direction: XYZ) {
function buildTurnPieceVisual(turnPoints: TurnPoints, path: Path) {
  const { start,  end,  control,  direction,  nextDirection } = turnPoints;
  const tubularSegments = 20;
  const radius = 0.1;
  const radialSegments = 8;
  const railOffset = 0.5;

  const isMovingOnXAxis = direction.x !== 0;

  const firstRailPosition = new THREE.Vector3(
    ...(isMovingOnXAxis ? [0, 0, -railOffset] : [-railOffset, 0, 0])
  );
  const secondRailPosition = new THREE.Vector3(
    ...(isMovingOnXAxis ? [0, 0, railOffset] : [railOffset, 0, 0])
  );

  /*
  try getting the curve points and adjusting the start, end, and offset

  if x direction is zero:
    - add railOffset * 0 to the z coord
    - if z direction is negative:
      - add railOffset to the x coord

  instead of this whole rigamarole, what if I get perpendicular vectors and generate path points from that?
    - first, get points along center path
    - for each point, find plus (or minus) the track offset amount in the perpendicular direction to the tangent
    - using those points, make a new curve (and repeat for minus)

  */
  const smallPath = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(start.x + railOffset, start.y, start.z),
    new THREE.Vector3(control.x + railOffset, control.y, control.z + railOffset),
    new THREE.Vector3(end.x, end.y, end.z + railOffset)
  );

  const betterPaths = getRailPaths(path);
  const SmallRail = () => (
    <mesh>
      <tubeGeometry args={[betterPaths[0], tubularSegments, radius, radialSegments]} />
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );

  // const geometry = new THREE.BoxGeometry( 3, 3, 3 );
  const tubePath = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(start.x, start.y, start.z),
    new THREE.Vector3(control.x, control.y, control.z),
    new THREE.Vector3(end.x, end.y, end.z)
  );
  const geometry = new THREE.TubeGeometry( tubePath, 10, 1, 4 );
  const edges = new THREE.EdgesGeometry( geometry );

  // const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 'green' } ) );

  getRailPaths(path);

  return () => (
    <group>
      {betterPaths.map((betterPath, i) => {
        return (
          <mesh key={i}>
            <tubeGeometry args={[betterPath, tubularSegments, radius, radialSegments]} />
            <meshStandardMaterial color="red" side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}


/*
let's try it
    - first, get points along center path
    - for each point, find plus (or minus) the track offset amount in the perpendicular direction to the tangent
    - using those points, make a new curve (and repeat for minus)
*/
function getRailPaths(path: Path) {
  const trackOffset = 0.5;

  const firstTrackPoints = getPointsOffsetFromPath(path, trackOffset);
  const secondTrackPoints = getPointsOffsetFromPath(path, -trackOffset);

  const firstTrackPath = new THREE.CatmullRomCurve3(firstTrackPoints);
  const secondTrackPath = new THREE.CatmullRomCurve3(secondTrackPoints);

  return [ firstTrackPath, secondTrackPath ];
}

function getPointsOffsetFromPath(path: Path, offset = 1, pointsCount = 10) {
  const points = path.getPoints(pointsCount);

  // For each of n points along the curve a Frenet Frame gives:
  //   - the tangent (direction)
  //   - the normal (vertical perpendicular)
  //   - the binormal (horizontal perpendicular)
  const frenetFrames = path.computeFrenetFrames(pointsCount);
  const horizontalPerpendiculars = frenetFrames.binormals;

  const offsetPoints = points.map((point, i) => {
    const pointCopy = new THREE.Vector3().copy(point);
    const perpendicularCopy = new THREE.Vector3().copy(horizontalPerpendiculars[i]);
    const newPointOffset = perpendicularCopy.multiplyScalar(offset);
    const newPoint = pointCopy.add(newPointOffset);

    return newPoint;
  });

  return offsetPoints;
}

function buildPiece(pieceType: PieceType, startPoint: XYZ, direction: XYZ) {
  if (pieceType === 'left') { return buildTurnPiece(startPoint, direction, 'left'); }
  else if (pieceType === 'right') { return buildTurnPiece(startPoint, direction, 'right'); }
  else if (pieceType === 'up') { return buildRampPiece(startPoint, direction, 'up'); }
  else if (pieceType === 'down') { return buildRampPiece(startPoint, direction, 'down'); }
  else { return buildStraightPiece(startPoint, direction); }
}

function assemblePieces(pieceTypes: PieceType[]) {
  let startPoint = { x: 0, y: 0, z: 0 };
  let direction = { x: 1, y: 0, z: 0 };

  const path = new THREE.CurvePath();
  const visuals: ((() => JSX.Element) | undefined)[] = [];

  pieceTypes.forEach(pieceType => {
    const piece = buildPiece(pieceType, startPoint, direction);
    path.add(piece.path);
    startPoint = piece.endPoint;
    direction = piece.nextDirection;

    visuals.push(piece.trackPieceVisual);
  });

  return {
    path,
    visuals,
  }
}

function buildTrack() {
  return assemblePieces([
    'straight',
    'straight',
    'right',
    'left',
    'left',
    'straight',
    'straight',
    'left',
    'straight',
    'straight',
    'left',
    'up',
    'straight',
    'down',
    'down',
    'straight',
    'up',
    'straight',
    'straight',
    'left',
    'left',
    'straight',
    'straight',
    'straight',
    'left',
    'straight',
    'straight',
    'up',
    'down',
    'down',
    'up',
    'right',
    'straight',
    'right',
    'straight',
    'straight',
    'straight',
    'straight',
  ]);
}

export const track = buildTrack();
export const path = track.path;
