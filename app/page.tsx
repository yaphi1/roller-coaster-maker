'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import Experience from './_components/Experience';
import Controls from './_components/controls/Controls';
import { createContext, useMemo, useState } from 'react';
import startingTrackPieces from './_premadeTracks/000_starter';
import { buildTrack } from './_utils/trackBuilder';
import { CameraType } from './_utils/types';

const cameraSettings = {
  fov: 45,
  near: 0.1,
  far: 1000,
  position: new THREE.Vector3(-10, 15, 30),
  // zoom: 100,
};

export const CameraContext = createContext<CameraType | null>(null);

export default function Home() {

  // TODO: change later to accommodate multiple tracks
  const [trackPieces, setTrackPieces] = useState(startingTrackPieces);
  const [cameraType, setCameraType] = useState<CameraType>('orbital');

  const tracks = [
    {
      startPoint: { x: 0, y: 0.3, z: 0 },
      direction: { x: 1, y: 0, z: 0 },
      pieceTypes: trackPieces,
    },
  ];

  const builtTracks = useMemo(() => {
    return tracks.map(track => buildTrack(track));
  }, [trackPieces]);

  return (
    <main className="h-screen">
      <CameraContext.Provider value={cameraType}>
        <Canvas
          camera={cameraSettings}
          // orthographic
        >
          <Experience builtTracks={builtTracks} cameraType={cameraType} />
        </Canvas>
        </CameraContext.Provider>
        <Controls
          trackPieces={trackPieces}
          builtTracks={builtTracks}
          setTrackPieces={setTrackPieces}
          setCameraType={setCameraType}
        />
      
    </main>
  )
}
