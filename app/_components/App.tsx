'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import Controls from './controls/Controls';
import { Dispatch, SetStateAction, createContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import startingTrackPieces from '../_premadeTracks/000_starter';
import { buildTrack } from '../_utils/trackBuilder';
import { CameraType, CoasterColors, Track } from '../_utils/types';
import { defaultCoasterColors } from '../_utils/defaults';
import { decodeTrack, encodeTrack, stripHexHashes, updateHash } from '../_utils/urlHashUtils';
import { produce } from 'immer';

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

export const CoasterContext = createContext<{
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>
} | null>(null);

export default function App() {
  const isFirstRender = useRef(true);

  // TODO: change later to accommodate multiple tracks
  const [trackPieces, setTrackPieces] = useState(startingTrackPieces);
  const [cameraType, setCameraType] = useState<CameraType>('orbital');
  const [coasterColors, setCoasterColors] = useState([ defaultCoasterColors ]);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [builtTracks, setBuiltTracks] = useState<Track[]>([]);

  // This syncs the url hash with the track & color data.
  // TODO: clean this up later. I rushed at the end.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const currentHash = window.location.hash.slice(1); // slice removes the "#"
      if (currentHash) {
        const params = new URLSearchParams(currentHash);

        setCoasterColors(produce((draft) => {
          draft[0] = {
            train: '#' + params.get('train') ?? 'ffffff',
            rails: '#' + params.get('rails') ?? 'ffffff',
            scaffolding: '#' + params.get('scaffolding') ?? 'ffffff',
          };
        }));

        const encodedPieces = params.get('p') ?? 'sss'; // default three straight pieces just in case
        const decodedPieces = decodeTrack(encodedPieces);
        setTrackPieces(produce((draft) => {
          return decodedPieces
        }));
      }
    }
    else if (!isFirstRender.current) {
      const params = new URLSearchParams({
        ...stripHexHashes(coasterColors[0]),
        p: encodeTrack(trackPieces),
      });
      updateHash(params.toString());
    }
  }, [trackPieces, coasterColors]);
  
  useEffect(() => {
    const tracks = [
      {
        startPoint: { x: 0, y: 0.3, z: 0 },
        direction: { x: 1, y: 0, z: 0 },
        pieceTypes: trackPieces,
      },
    ];

    setBuiltTracks(
      tracks.map(track => buildTrack(track))
    );
  }, [trackPieces]);

  return (
    <div className="h-screen" onClick={(event) => {
      const target = event.nativeEvent.target as HTMLElement;
      const shouldCloseModal = !(target.closest('[data-do-not-close-modal]'));
      if (shouldCloseModal) { setCurrentModal(null); }
    }}>
      <CoasterContext.Provider value={{ isRunning, setIsRunning }}>
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
      </CoasterContext.Provider>
    </div>
  );
}
