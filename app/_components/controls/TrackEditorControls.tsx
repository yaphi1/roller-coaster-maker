import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CollisionZone, Piece, PieceType, Track, XYZ } from "@/app/_utils/types";
import { buildPiece, desiredPointsPerTrackPiece, getPathPoints, trackWidth } from "@/app/_utils/trackBuilder";

export default function TrackEditorControls(
  { trackPieces, setTrackPieces, builtTracks }:
  {
    trackPieces: PieceType[],
    setTrackPieces: Dispatch<SetStateAction<PieceType[]>>,
    builtTracks: Track[],
  }
) {
  // const builtTrack = builtTracks[0];

  // if(!builtTrack) {
  //   return <></>;
  // }

  const [builtTrack, setBuiltTrack] = useState<Track | undefined>();
  const [latestPiece, setLatestPiece] = useState<Piece | undefined>();
  const [isMinTrackSize, setIsMinTrackSize] = useState<boolean>(false);

  useEffect(() => {
    setBuiltTrack(builtTracks[0]);
  }, [builtTracks]);
  
  useEffect(() => {
    setLatestPiece(getLatestPiece(builtTrack));
  }, [builtTrack]);

  useEffect(() => {
    setIsMinTrackSize(trackPieces.length <= 3);
  }, [trackPieces]);

  if(!builtTrack || !trackPieces || !latestPiece) {
    return <></>;
  }

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
              setTrackPieces([...trackPieces, getNextForwardPiece(latestPiece)]);
            }}
            disabled={isPieceBlocked(getNextForwardPiece(latestPiece), builtTrack)}
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
              setTrackPieces([...trackPieces, getNextUpPiece(latestPiece)]);
            }}
            disabled={isPieceBlocked(getNextUpPiece(latestPiece), builtTrack)}
          >
            Up
          </button>

          <button
            className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
            onClick={() => {
              setTrackPieces([...trackPieces, getNextDownPiece(latestPiece)]);
            }}
            disabled={isAtBottom(latestPiece) || isPieceBlocked(getNextDownPiece(latestPiece), builtTrack)}
          >
            Down
          </button>

          {/* <button className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50">Play</button> */}
        </div>
      </div>
    </>
  );
}

function getNextForwardPiece(latestPiece: Piece) {
  let nextPiece: PieceType = 'straight';
  if (isGoingDown(latestPiece)) { nextPiece = 'up'; }
  if (isGoingUp(latestPiece)) { nextPiece = 'down'; }
  return nextPiece;
}

function getNextUpPiece(latestPiece: Piece) {
  const nextPiece = isGoingUp(latestPiece) ? 'straight' : 'up';
  return nextPiece;
}

function getNextDownPiece(latestPiece: Piece) {
  let nextPiece: PieceType = 'down';
  if (isGoingDown(latestPiece)) {
    nextPiece = isNearBottom(latestPiece) ? 'up' : 'straight';
  }
  return nextPiece;
}

function isPieceBlocked(pieceType: PieceType | undefined, builtTrack: Track) {
  if (!pieceType || !builtTrack) { return; }
  const latestPiece = getLatestPiece(builtTrack);
  if (!latestPiece) { return; }

  const trackPathPoints = getPathPoints(builtTrack.path);
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

function getLatestPiece(builtTrack: Track | null | undefined) {
  if (!builtTrack) { return; }
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
  return latestPiece.endPoint.y < 0.5;
}

function isSloping(latestPiece: Piece) {
  const isGoingUp = latestPiece.nextDirection.y === 1;
  const isGoingDown = latestPiece.nextDirection.y === -1;
  return isGoingUp || isGoingDown;
}
