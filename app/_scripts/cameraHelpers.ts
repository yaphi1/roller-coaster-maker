import * as THREE from 'three';
import { CameraType, Path } from './types';
import { getUpwardVectorFromProgress } from './trackBuilder/trackPieceBuilders/upwardVectorHelpers';

export function updateCamera(
  camera: THREE.Camera & { manual?: boolean | undefined; },
  cameraType: CameraType | undefined,
  path: Path,
  progress:number,
  upwardVectors: THREE.Vector3[],
) {
  if (!cameraType) { return; }

  if (cameraType === 'orbital') {
    camera.up = new THREE.Vector3(0, 1, 0);
    return;
  }

  const coasterPosition = path.getPointAt(progress);

  if (cameraType === 'coasterFocus') {
    const cameraPosition = new THREE.Vector3(
      coasterPosition.x + 7,
      coasterPosition.y + 10,
      coasterPosition.z + 20,
    );
    camera.position.copy(cameraPosition);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(coasterPosition);
  }
  
  if (cameraType === 'firstPerson') {
    const tangent = path.getTangentAt(progress);
    const upwardVector = getUpwardVectorFromProgress(progress, upwardVectors);
    const cameraPosition = new THREE.Vector3(
      coasterPosition.x + upwardVector.x,
      coasterPosition.y + (2 * upwardVector.y),
      coasterPosition.z + upwardVector.z,
    );
    const cameraDirection = new THREE.Vector3(
      tangent.x,
      tangent.y - (0.2 * upwardVector.y),
      tangent.z,
    );
    camera.position.lerp(cameraPosition, 0.1);
    camera.up = upwardVector;
    camera.lookAt(cameraPosition.add(cameraDirection));
  }
}
