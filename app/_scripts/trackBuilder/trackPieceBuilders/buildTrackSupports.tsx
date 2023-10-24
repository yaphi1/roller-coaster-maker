import * as THREE from 'three';
import { ColorContext } from "@/app/_components/App";
import { useContext } from "react";
import { Path, PathVisual } from '../../types';
import { getPointsOffsetFromPath } from './getPointsOffsetFromPath';
import { trackPieceDepth } from '../trackConstants';
import { globalSettings } from '../../globalSettings';
import { getPathPoints } from './getPathPoints';

function isIndexSpacedOutEnough(value: unknown, i: number) { return i % 4 === 0; }

function getSupportPolePaths(
  { path, depthOfTopPoint } :
  { path: Path, depthOfTopPoint: number }
) {
  const pathPoints = getPointsOffsetFromPath(path, 0, 0);
  const supportPolePoints = pathPoints.filter(isIndexSpacedOutEnough);

  const supportPolePaths = supportPolePoints.map((supportPolePoint, i) => {
    const groundPoint = new THREE.Vector3(...[
      supportPolePoint.x,
      0 - depthOfTopPoint,
      supportPolePoint.z,
    ]);
    const supportPoleTop = new THREE.Vector3(
      supportPolePoint.x,
      supportPolePoint.y - depthOfTopPoint,
      supportPolePoint.z,
    );
    const polePath = new THREE.LineCurve3(supportPoleTop, groundPoint);

    return polePath;
  });

  return supportPolePaths;
}

function isValidSupport(supportPath: THREE.LineCurve3, trackPathPoints: THREE.Vector3[]) {
  const range = 1;
  const verticalClearance = 1;
  const topOfSupportPole = supportPath.v1;

  for (const trackPathPoint of trackPathPoints) {
    const { x: trackX, y: trackY, z: trackZ } = trackPathPoint;
    const { x: poleX, y: poleY, z: poleZ } = topOfSupportPole;

    const isTrackLowerThanPole = trackY <= poleY - verticalClearance;

    const isTrackInRangeOfPoleX = (poleX - range <= trackX) && (trackX <= poleX + range);
    const isTrackInRangeOfPoleZ = (poleZ - range <= trackZ) && (trackZ <= poleZ + range);
    const isTrackNearPole = isTrackInRangeOfPoleX && isTrackInRangeOfPoleZ;
    const isPoleOverlappingTrack = isTrackNearPole && isTrackLowerThanPole;

    if (isPoleOverlappingTrack) {
      return false;
    }
  }

  return true;
}

export function buildTrackSupports(trackPath: Path): PathVisual[] {
  const tubularSegments = 20;
  const radius = 0.15;
  const radialSegments = 8;

  const trackPathPoints = getPathPoints(trackPath);
  const supportPaths = getSupportPolePaths({ path: trackPath, depthOfTopPoint: trackPieceDepth + 0.2 });

  const supports = supportPaths.map((supportPath, i) => {
    const isValid = isValidSupport(supportPath, trackPathPoints);
    const { x, y, z } = supportPath.v1;

    const TrackSupport = () => {
      const scaffoldingColor = useContext(ColorContext)?.coasterColors[0]?.scaffolding;
      const supportMaterial = <meshStandardMaterial color={scaffoldingColor} side={THREE.DoubleSide} wireframe={globalSettings.isDebugMode} />;
      const supportBaseMaterial = <meshStandardMaterial color={scaffoldingColor} wireframe={globalSettings.isDebugMode} />;
      const weldRadius = 0.16;

      return isValid ? (
        <group key={i}>
          <mesh position={[x, y, z]}>
            <sphereGeometry args={[weldRadius]} />
            {supportMaterial}
          </mesh>
          <mesh>
            <tubeGeometry args={[supportPath, tubularSegments, radius, radialSegments]} />
            {supportMaterial}
          </mesh>
          <mesh position={[x, 0, z]}>
            <boxGeometry args={[0.5, 0.2, 0.5]} />
            {supportBaseMaterial}
          </mesh>
        </group>
      ) : (<></>)
    };

    return TrackSupport;
  });

  return supports;
}
