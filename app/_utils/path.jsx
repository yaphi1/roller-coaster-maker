import * as THREE from 'three';

function makePath() {
  const curvePath = new THREE.CurvePath();
  const firstLine = new THREE.LineCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, 0, 0)
  );
  const secondLine = new THREE.LineCurve3(
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(5, 2, 5)
  );
  const thirdLine = new THREE.LineCurve3(
    new THREE.Vector3(5, 2, 5),
    new THREE.Vector3(0, 0, 5)
  );
  const fourthLine = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(-10, 0, 2.5),
    new THREE.Vector3(0, 0, 0)
  );
  curvePath.add(firstLine);
  curvePath.add(secondLine);
  curvePath.add(thirdLine);
  curvePath.add(fourthLine);

  return curvePath;
}

export const path = makePath();
