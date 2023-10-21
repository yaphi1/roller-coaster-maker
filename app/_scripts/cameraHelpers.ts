import * as THREE from 'three';
import { CameraType, Path } from './types';

export function updateCamera(camera: THREE.Camera & { manual?: boolean | undefined; }, cameraType: CameraType | undefined, path: Path, progress:number) {
  if (!cameraType || cameraType === 'orbital') { return; }

  const coasterPosition = path.getPointAt(progress);

  if (cameraType === 'coasterFocus') {
    const cameraPosition = new THREE.Vector3(
      coasterPosition.x + 7,
      coasterPosition.y + 10,
      coasterPosition.z + 20,
    );
    camera.position.copy(cameraPosition);
    camera.lookAt(coasterPosition);
  }
  
  if (cameraType === 'firstPerson') {
    const tangent = path.getTangentAt(progress);
    const cameraPosition = new THREE.Vector3(
      coasterPosition.x,
      coasterPosition.y + 2,
      coasterPosition.z,
    );
    const cameraDirection = new THREE.Vector3(
      tangent.x,
      tangent.y - 0.2,
      tangent.z,
    );
    camera.position.copy(cameraPosition);
    camera.lookAt(cameraPosition.add(cameraDirection));
  }
}
