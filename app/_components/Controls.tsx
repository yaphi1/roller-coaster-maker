import { Dispatch, SetStateAction } from "react";
import { CameraType, CollisionZone, Piece, PieceType, Track, XYZ } from "../_utils/types";
import { buildPiece, desiredPointsPerTrackPiece, getTrackPathPoints, trackWidth } from "../_utils/trackBuilder";

function isPieceBlocked(pieceType: PieceType, builtTrack: Track) {
  const trackPathPoints = getTrackPathPoints(builtTrack.path);
  const latestPiece = getLatestPiece(builtTrack);
  const { nextDirection } = latestPiece;
  const nextStartPoint = latestPiece.endPoint;
  const potentialPiece = buildPiece(pieceType, nextStartPoint, nextDirection);
  const collisionZone = getCollisionZone(potentialPiece, nextStartPoint, nextDirection);

  if (isConnectingToBeginning(builtTrack, potentialPiece)) {
    return false;
  }

  // We're checking everything BEFORE the latest piece because otherwise
  // the next piece will register a collision with the previous piece
  // because, of course, it's connected to it!
  const numPointsBeforeLatestPiece = trackPathPoints.length - desiredPointsPerTrackPiece;

  for (let i=0; i < numPointsBeforeLatestPiece; i++) {
    if (isPointInCollisionZone(trackPathPoints[i], collisionZone)) {
      return true;
    }
  }

  return false;
}

function isConnectingToBeginning(builtTrack: Track, potentialPiece: Piece) {
  const firstPiece = builtTrack.pieces[0];
  const pointsMatch = doVectorsMatch(potentialPiece.endPoint, firstPiece.startPoint);
  const directionsMatch = doVectorsMatch(potentialPiece.nextDirection, firstPiece.direction);

  return pointsMatch && directionsMatch;
}

function roundToDecimalPlace({ num, decimalPlaces }: { num: number, decimalPlaces: number }) {
  const magnitude = Math.pow(10, decimalPlaces);
  return Math.round(num * magnitude) / magnitude;
}

function round(num: number){
  return roundToDecimalPlace({ num, decimalPlaces: 3 });
}

function doVectorsMatch(vectorA: XYZ, vectorB: XYZ) {
  const xMatch = round(vectorA.x) === round(vectorB.x);
  const yMatch = round(vectorA.y) === round(vectorB.y);
  const zMatch = round(vectorA.z) === round(vectorB.z);

  return xMatch && yMatch && zMatch;
}

function isPointInCollisionZone(point: THREE.Vector3, collisionZone: CollisionZone) {
  const { x, y, z } = point;
  const xHit = collisionZone.x.min <= x && x <= collisionZone.x.max;
  const yHit = collisionZone.y.min <= y && y <= collisionZone.y.max;
  const zHit = collisionZone.z.min <= z && z <= collisionZone.z.max;

  return xHit && yHit && zHit;
}

function getCollisionZone(potentialPiece: Piece, nextStartPoint: XYZ, nextDirection: XYZ): CollisionZone {
  const nextEndPoint = potentialPiece.endPoint;

  const wiggleRoom = {
    x: nextDirection.x === 0 ? (trackWidth / 2 + 0.1) : 0.2,
    y: 2.3,
    z: nextDirection.z === 0 ? (trackWidth / 2 + 0.1) : 0.2,
  };

  const collisionZone = {
    x: {
      min: Math.min(nextStartPoint.x, nextEndPoint.x) - wiggleRoom.x,
      max: Math.max(nextStartPoint.x, nextEndPoint.x) + wiggleRoom.x,
    },
    y: {
      min: Math.min(nextStartPoint.y, nextEndPoint.y) - wiggleRoom.y,
      max: Math.max(nextStartPoint.y, nextEndPoint.y) + wiggleRoom.y,
    },
    z: {
      min: Math.min(nextStartPoint.z, nextEndPoint.z) - wiggleRoom.z,
      max: Math.max(nextStartPoint.z, nextEndPoint.z) + wiggleRoom.z,
    },
  };

  return collisionZone;
}

function getLatestPiece(builtTrack: Track) {
  const { pieces } = builtTrack;
  const latestPieceIndex = pieces.length - 1;
  return pieces[latestPieceIndex];
}

function isGoingUp(latestPiece: Piece) {
  return latestPiece.nextDirection.y === 1;
}

function isGoingDown(latestPiece: Piece) {
  latestPiece.endPoint.y < 3
  return latestPiece.nextDirection.y === -1;
}

function isNearBottom(latestPiece: Piece) {
  return latestPiece.endPoint.y < 3;
}

function isAtBottom(latestPiece: Piece) {
  return latestPiece.endPoint.y < 1;
}

function isSloping(latestPiece: Piece) {
  const isGoingUp = latestPiece.nextDirection.y === 1;
  const isGoingDown = latestPiece.nextDirection.y === -1;
  return isGoingUp || isGoingDown;
}

export default function Controls(
  { trackPieces, setTrackPieces, builtTracks, setCameraType }:
  {
    trackPieces: PieceType[],
    setTrackPieces: Dispatch<SetStateAction<PieceType[]>>,
    builtTracks: Track[],
    setCameraType: Dispatch<SetStateAction<CameraType>>
  }
) {
  const builtTrack = builtTracks[0];
  const latestPiece = getLatestPiece(builtTrack);
  const isMinTrackSize = trackPieces.length <= 3;

  return (
    <>
      <div className="fixed z-10 left-0 bottom-0 bg-white/50 rounded-md p-2 m-2 text-slate-700">
        <div className="font-bold mb-1">
          Track Editor
        </div>
        <div className="flex gap-1">
          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => {
              let nextPiece: PieceType = 'straight';
              if (isGoingDown(latestPiece)) { nextPiece = 'up'; }
              if (isGoingUp(latestPiece)) { nextPiece = 'down'; }

              setTrackPieces([...trackPieces, nextPiece]);
            }}
            disabled={isPieceBlocked('straight', builtTrack)}
          >
            Forward
          </button>

          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => {
              const copyOfPieces = [...trackPieces];
              copyOfPieces.pop();
              setTrackPieces(copyOfPieces);
            }}
            disabled={isMinTrackSize}
          >
            Delete
          </button>

          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => { setTrackPieces([...trackPieces, 'left']); }}
            disabled={isSloping(latestPiece) || isPieceBlocked('left', builtTrack)}
          >
            Left
          </button>

          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => { setTrackPieces([...trackPieces, 'right']); }}
            disabled={isSloping(latestPiece) || isPieceBlocked('right', builtTrack)}
          >
            Right
          </button>

          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => {
              const nextPiece = isGoingUp(latestPiece) ? 'straight' : 'up';
              setTrackPieces([...trackPieces, nextPiece]);
            }}
            disabled={isPieceBlocked('up', builtTrack)}
          >
            Up
          </button>

          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => {
              let nextPiece: PieceType = 'down';
              if (isGoingDown(latestPiece)) {
                nextPiece = isNearBottom(latestPiece) ? 'up' : 'straight';
              }
              setTrackPieces([...trackPieces, nextPiece]);
            }}
            disabled={isAtBottom(latestPiece) || isPieceBlocked('down', builtTrack)}
          >
            Down
          </button>

          {/* <button className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50">Play</button> */}
        </div>
      </div>

      <div className="fixed z-10 right-0 bottom-0 bg-white/50 rounded-md p-2 m-2 text-slate-700">
        <div className="font-bold mb-1">
          Camera
        </div>
        <div className="flex gap-1">
          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => { setCameraType('orbital') }}
          >
            Free
          </button>
          
          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => { setCameraType('coasterFocus') }}
          >
            Focus
          </button>
          
          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => { setCameraType('firstPerson') }}
          >
            Inside
          </button>
        </div>
      </div>
    </>
  );
}
