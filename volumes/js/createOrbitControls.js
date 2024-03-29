function createOrbitControls(camera, domElement) {
    let orbitControls = new THREE.OrbitControls(camera, domElement);
    orbitControls.enableZoom = false;
    orbitControls.enablePan = false;

    //
    orbitControls.maxPolarAngle = Math.PI / 2;

    //
    // orbitControls.minAzimuthAngle = -Math.PI / 2;
    // orbitControls.maxAzimuthAngle = Math.PI / 2;

    //
    orbitControls.rotateSpeed = 0.3;

    //For auto rotate
    orbitControls.autoRotateSpeed = systemConfigurations.autoRotateSpeed;
    orbitControls.autoRotate = systemConfigurations.autoRotate;
    orbitControls.update();

    return orbitControls;
}
