import * as THREE from 'three';
import { Path } from "../../types";
import { trackPieceDepth, trackWidth } from "../trackConstants";
import { getPointsOffsetFromPath } from "./getPointsOffsetFromPath";
import { useContext } from 'react';
import { ColorContext } from '@/app/_components/App';
import { globalSettings } from '../../globalSettings';

export function buildTrackPieceVisual(path: Path) {
  const tubularSegments = 20;
  const radius = 0.1;
  const radialSegments = 8;

  const railPaths = getRailPaths(path);
  const middleRailPath = getMiddleRailPath(path);
  const crossPiecePaths = getCrossPiecePaths({ path, depth: trackPieceDepth, horizontalReach: 0.5 });

  function SideRails({ material } : { material: JSX.Element }) {
    return (
      <>
        {railPaths.map((railPath, i) => (
          <mesh key={i}>
            <tubeGeometry args={[railPath, tubularSegments, radius, radialSegments]} />
            {material}
          </mesh>
        ))}
      </>
    );
  };

  function MiddleRail({ material } : { material: JSX.Element }) {
    return (
      <mesh>
        <tubeGeometry args={[middleRailPath, tubularSegments, 0.15, radialSegments]} />
        {material}
      </mesh>
    );
  };

  function CrossPieces({ material } : { material: JSX.Element }) {
    return (
      <>
        {crossPiecePaths.map((crossPiecePath, i) => (
          <mesh key={i}>
            <tubeGeometry args={[crossPiecePath, tubularSegments, 0.05, radialSegments]} />
            {material}
          </mesh>
        ))}
      </>
    );
  };

  const TrackPieceVisual = () => {
    const coasterColors = useContext(ColorContext)?.coasterColors[0];
    const railColor = coasterColors?.rails;
    const scaffoldingColor = coasterColors?.scaffolding;

    const railMaterial = (<meshStandardMaterial color={railColor} roughness={0.3} metalness={0.7} side={THREE.DoubleSide} wireframe={globalSettings.isDebugMode} />);
    const scaffoldingMaterial = (<meshStandardMaterial color={scaffoldingColor} side={THREE.DoubleSide} wireframe={globalSettings.isDebugMode} />);

    return (
      <group>
        <SideRails material={railMaterial} />
        <MiddleRail material={scaffoldingMaterial} />
        <CrossPieces material={scaffoldingMaterial} />
      </group>
    );
  };

  return TrackPieceVisual;
}

function getRailPaths(path: Path, horizontalOffset = trackWidth / 2) {
  const firstRailPoints = getPointsOffsetFromPath(path, horizontalOffset);
  const secondRailPoints = getPointsOffsetFromPath(path, -horizontalOffset);

  const firstRailPath = new THREE.CatmullRomCurve3(firstRailPoints);
  const secondRailPath = new THREE.CatmullRomCurve3(secondRailPoints);

  return [ firstRailPath, secondRailPath ];
}

function getMiddleRailPath(path: Path, verticalOffset = -0.2) {
  const horizontalOffset = 0;
  const railPoints = getPointsOffsetFromPath(path, horizontalOffset, verticalOffset);
  const railPath = new THREE.CatmullRomCurve3(railPoints);

  return railPath;
}

function getCrossPiecePaths(
  { path, depth, horizontalReach } :
  { path: Path, depth: number, horizontalReach: number }
) {
  const firstRailPoints = getPointsOffsetFromPath(path, horizontalReach);
  const secondRailPoints = getPointsOffsetFromPath(path, -horizontalReach);
  const centerRailPoints = getPointsOffsetFromPath(path, 0, -depth);

  const crossPiecePaths = centerRailPoints.map((centerRailPoint, i) => {
    const firstLine = new THREE.LineCurve3(firstRailPoints[i], centerRailPoint);
    const secondLine = new THREE.LineCurve3(centerRailPoint, secondRailPoints[i]);
    const crossPiecePath: THREE.CurvePath<THREE.Vector3> = new THREE.CurvePath();

    crossPiecePath.add(firstLine);
    crossPiecePath.add(secondLine);

    return crossPiecePath;
  });

  return crossPiecePaths;
}
