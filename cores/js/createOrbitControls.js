function createOrbitControls(camera, domElement) {
    let orbitControls = new THREE.OrbitControls(camera, domElement);
    orbitControls.enableZoom = false;
    orbitControls.enablePan = false;

    //
    // orbitControls.maxPolarAngle = Math.PI / 2;

    //
    // orbitControls.minAzimuthAngle = -Math.PI / 2;
    // orbitControls.maxAzimuthAngle = Math.PI / 2;

    //
    orbitControls.rotateSpeed = 0.3;

    //For auto rotate
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = 1.0;
    orbitControls.update();
    return orbitControls;
}
