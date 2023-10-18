'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import Experience from './_components/Experience';
import Controls from './_components/controls/Controls';
import { Dispatch, SetStateAction, createContext, useId, useMemo, useState } from 'react';
import startingTrackPieces from './_premadeTracks/000_starter';
import { buildTrack } from './_utils/trackBuilder';
import { CameraType, CoasterColors } from './_utils/types';
import { defaultCoasterColors } from './_utils/defaults';

const cameraSettings = {
  fov: 45,
  near: 0.1,
  far: 1000,
  position: new THREE.Vector3(-10, 15, 30),
  // zoom: 100,
};

export const CameraContext = createContext<CameraType | null>(null);

export const ColorContext = createContext<{
  coasterColors: CoasterColors[];
  setCoasterColors: Dispatch<SetStateAction<CoasterColors[]>>
} | null>(null);

export const ModalContext = createContext<{
  currentModal: string | null;
  setCurrentModal: Dispatch<SetStateAction<string | null>>
} | null>(null);

export default function Home() {

  // TODO: change later to accommodate multiple tracks
  const [trackPieces, setTrackPieces] = useState(startingTrackPieces);
  const [cameraType, setCameraType] = useState<CameraType>('orbital');
  const [coasterColors, setCoasterColors] = useState([ defaultCoasterColors ]);
  const [currentModal, setCurrentModal] = useState<string | null>(null);

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
    <main className="h-screen" onClick={(event) => {
      const target = event.nativeEvent.target as HTMLElement;
      const shouldCloseModal = !(target.closest('[data-do-not-close-modal]'));
      if (shouldCloseModal) { setCurrentModal(null); }
    }}>
      <ModalContext.Provider value={{ currentModal, setCurrentModal }}>
        <ColorContext.Provider value={{ coasterColors, setCoasterColors }}>
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
        </ColorContext.Provider>
      </ModalContext.Provider>
    </main>
  );
}
