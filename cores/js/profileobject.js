function createHorizontalCutPlane(horizCutY) {
    const geometry = new THREE.RingGeometry(0.5, 0.6, 100);
    const material = new THREE.MeshLambertMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = horizCutY;
    mesh.rotation.x = Math.PI / 2;
    return mesh;
}

function createProfileObject(horizCutY, profileName) {
    const textureLoader = new THREE.TextureLoader();
    const theObject = new THREE.Object3D();
    //Common constants
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    const cylinderRadius = 0.5;
    const topCapNorm = [0, 1, 0];
    const sideMat = new THREE.MeshBasicMaterial({color: 0x776552})
    //<editor-fold desc="The top Cap">
    const topCapPos = [];
    const topCapNorms = [];
    const topCapUvs = [];
    const topCapNumSides = 50;
    const topCapY = 0.5;
    const topCapX = 0;
    const topCapZ = 0;
    for (let i = 0; i < topCapNumSides; i++) {

        //Point 1
        topCapPos.push(...[topCapX, topCapY, topCapZ]);
        topCapNorms.push(...topCapNorm);
        topCapUvs.push(...[0.5, 0.5]);

        //Point 2
        let angle = Math.PI / topCapNumSides * i;
        let x = Math.cos(angle) * cylinderRadius;
        let z = -Math.sin(angle) * cylinderRadius;
        let y = topCapY;
        topCapPos.push(...[x, y, z]);
        topCapNorms.push(...topCapNorm);
        topCapUvs.push(...[0.5 + x, 0.5 - z]);
        //Point 3
        angle = Math.PI / topCapNumSides * (i + 1);
        x = Math.cos(angle) * cylinderRadius;
        z = -Math.sin(angle) * cylinderRadius;
        y = topCapY;
        topCapPos.push(...[x, y, z]);
        topCapNorms.push(...topCapNorm);
        topCapUvs.push(...[0.5 + x, 0.5 - z]);
    }

    const topCapGeo = new THREE.BufferGeometry();
    topCapGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(topCapPos), positionNumComponents));
    topCapGeo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(topCapNorms), normalNumComponents));
    topCapGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(topCapUvs), uvNumComponents));

    const topCapTexture = textureLoader.load(`./data/images/${profileName}.jpg`);
    topCapTexture.center.x = 0.5;
    topCapTexture.center.y = 0.5;

    const topCapMat = new THREE.MeshBasicMaterial({
        map: topCapTexture,
    });
    const topCap = new THREE.Mesh(topCapGeo, topCapMat);

    theObject.add(topCap);
    //</editor-fold>
    //<editor-fold desc="The horiz cut">
    const vertiCutPos = [];
    const vertiCutNorms = [];
    const vertiCutUvs = [];
    const vertiCutWidth = 1;
    const vertiCutHeight = 1;
    const vertiCutNorm = [0, 0, 1];
    //First triangle
    vertiCutPos.push(...[-0.5 * vertiCutWidth, -0.5 * vertiCutHeight, 0]);
    vertiCutNorms.push(...vertiCutNorm);
    vertiCutUvs.push(...[0, 0]);

    vertiCutPos.push(...[0.5 * vertiCutWidth, 0.5 * vertiCutHeight, 0]);
    vertiCutNorms.push(...vertiCutNorm);
    vertiCutUvs.push(...[1, 1]);

    vertiCutPos.push(...[-0.5 * vertiCutWidth, 0.5 * vertiCutHeight, 0]);
    vertiCutNorms.push(...vertiCutNorm);
    vertiCutUvs.push(...[0, 1]);

    //Second triangle
    vertiCutPos.push(...[-0.5 * vertiCutWidth, -0.5 * vertiCutHeight, 0]);
    vertiCutNorms.push(...vertiCutNorm);
    vertiCutUvs.push(...[0, 0]);

    vertiCutPos.push(...[0.5 * vertiCutWidth, -0.5 * vertiCutHeight, 0]);
    vertiCutNorms.push(...vertiCutNorm);
    vertiCutUvs.push(...[1, 0]);

    vertiCutPos.push(...[0.5 * vertiCutWidth, 0.5 * vertiCutHeight, 0]);
    vertiCutNorms.push(...vertiCutNorm);
    vertiCutUvs.push(...[1, 1]);


    const vertiCutGeo = new THREE.BufferGeometry();
    vertiCutGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertiCutPos), positionNumComponents));
    vertiCutGeo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(vertiCutNorms), normalNumComponents));
    vertiCutGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(vertiCutUvs), uvNumComponents));

    const vertiCutMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load('./data/images/L.jpg'),
    });
    const vertiCut = new THREE.Mesh(vertiCutGeo, vertiCutMat);
    theObject.add(vertiCut);
    //</editor-fold>
    //<editor-fold desc="The horizontal cut">
    const horizCutPos = [];
    const horizCutNorms = [];
    const horizCutUvs = [];
    const horizCutNumSides = 2 * topCapNumSides;
    for (let i = 0; i < horizCutNumSides; i++) {
        //Point 1
        horizCutPos.push(...[0, 0, 0]);
        horizCutNorms.push(...topCapNorm);
        horizCutUvs.push(...[0.5, 0.5]);

        //Point 2
        let angle = Math.PI / topCapNumSides * i;
        let x = Math.cos(angle) * cylinderRadius;
        let z = -Math.sin(angle) * cylinderRadius;
        let y = 0;
        horizCutPos.push(...[x, y, z]);
        horizCutNorms.push(...topCapNorm);
        horizCutUvs.push(...[0.5 + x, 0.5 - z]);
        //Point 3
        angle = Math.PI / topCapNumSides * (i + 1);
        x = Math.cos(angle) * cylinderRadius;
        z = -Math.sin(angle) * cylinderRadius;
        y = 0;
        horizCutPos.push(...[x, y, z]);
        horizCutNorms.push(...topCapNorm);
        horizCutUvs.push(...[0.5 + x, 0.5 - z]);
    }

    const horizCutGeo = new THREE.BufferGeometry();
    horizCutGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(horizCutPos), positionNumComponents));
    horizCutGeo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(horizCutNorms), normalNumComponents));
    horizCutGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(horizCutUvs), uvNumComponents));
    let horizCutTexture = textureLoader.load('./data/images/L.jpg');
    horizCutTexture.center.x = 0.5;
    horizCutTexture.center.y = 0.5;
    const horizCutMat = new THREE.MeshBasicMaterial({
        map: horizCutTexture,
    });
    const horizCut = new THREE.Mesh(horizCutGeo, horizCutMat);
    horizCut.position.y = horizCutY;

    theObject.add(horizCut);
    //</editor-fold>
    //<editor-fold desc="The back">
    let backHeight = 1;
    const backGeom = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, backHeight, topCapNumSides, 1, true, Math.PI / 2, Math.PI);
    const backMat = sideMat;
    const back = new THREE.Mesh(backGeom, backMat);
    theObject.add(back);
    //</editor-fold>
    //<editor-fold desc="The front">

    //TODO: delcare these with lengths to improve performance
    const frontPos = [];
    const frontNorms = [];
    const frontUvs = [];
    const frontTopVertices = [];
    let frontVertexCounter = 0;
    for (let i = 0; i < topCapNumSides; i++) {
        let angle = Math.PI / topCapNumSides * i + Math.PI;
        let x = Math.cos(angle) * cylinderRadius;
        let z = -Math.sin(angle) * cylinderRadius;

        const p1 = [x, horizCutY, z];
        const p2 = [x, -0.5, z];
        angle = Math.PI / topCapNumSides * (i + 1) + Math.PI;
        x = Math.cos(angle) * cylinderRadius;
        z = -Math.sin(angle) * cylinderRadius;

        const p3 = [x, horizCutY, z];
        const p4 = [x, -0.5, z];
        //Face 1 of the rectangular face
        //Point 1
        frontPos.push(...p1);
        frontTopVertices.push(frontVertexCounter);
        frontVertexCounter += 1;
        frontNorms.push(...[p1[0], 0, p1[2]]);
        frontUvs.push(...[0.5 + x, 0.5 - z]); //TODO: need to change this
        //Point 2
        frontPos.push(...p2);
        frontVertexCounter += 1;
        frontNorms.push(...[p2[0], 0, p2[2]]);
        frontUvs.push(...[0.5 + x, 0.5 - z]); //TODO: need to change this
        //Point 3
        frontPos.push(...p3);
        frontTopVertices.push(frontVertexCounter);
        frontVertexCounter += 1;
        frontNorms.push(...[p3[0], 0, p3[2]]);
        frontUvs.push(...[0.5 + x, 0.5 - z]); //TODO: need to change this
        //Face 2
        //Point 1
        frontPos.push(...p3);
        frontTopVertices.push(frontVertexCounter);
        frontVertexCounter += 1;
        frontNorms.push(...[p3[0], 0, p3[2]]);
        frontUvs.push(...[0.5 + x, 0.5 - z]); //TODO: need to change this
        //Point 2
        frontPos.push(...p2);
        frontVertexCounter += 1;
        frontNorms.push(...[p2[0], 0, p2[2]]);
        frontUvs.push(...[0.5 + x, 0.5 - z]); //TODO: need to change this
        //Point 3
        frontPos.push(...p4);
        frontVertexCounter += 1;
        frontNorms.push(...[p4[0], 0, p4[2]]);
        frontUvs.push(...[0.5 + x, 0.5 - z]); //TODO: need to change this
    }
    const frontGeo = new THREE.BufferGeometry();
    frontGeo.dynamic = true;
    frontGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(frontPos), positionNumComponents));
    frontGeo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(frontNorms), normalNumComponents));
    frontGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(frontUvs), uvNumComponents));


    const frontMat = sideMat;
    const front = new THREE.Mesh(frontGeo, frontMat);
    theObject.add(front);

    //</editor-fold>
    function handleHorizCutPosition(theHorizCutY, texture) {
        horizCutY = theHorizCutY;
        horizCut.position.y = horizCutY;
        frontTopVertices.forEach(idx => {
            front.geometry.attributes.position.array[idx * 3 + 1] = horizCutY;
            front.geometry.attributes.position.needsUpdate = true;
        });
        if (texture) {
            //Also need to rotate the current texture
            texture.rotation = horizCut.material.map.rotation;
            horizCut.material.map = texture;
            horizCut.material.map.needsUpdate = true;
        }
    }

    function handleVertiCutAngle(theVertiCutAngle, texture) {
        //We only remap the texture (rotate the texture).
        topCap.material.map.rotation = theVertiCutAngle;
        topCap.material.needsUpdate = true;

        horizCut.material.map.rotation = theVertiCutAngle;
        horizCut.material.needsUpdate = true;

        //Update texture
        if (texture) {
            vertiCut.material.map = texture;
            vertiCut.material.map.needsUpdate = true;
        }

    }

    function updateTopCapTexture(profileName) {
        const topCapTexture = textureLoader.load(`./data/images/${profileName}.jpg`);
        topCapTexture.center.x = 0.5;
        topCapTexture.center.y = 0.5;
        topCapTexture.rotation = topCap.material.map.rotation;
        topCap.material.map = topCapTexture;
        // topCap.material.map.needsUpdate = true;
    }

    function profile2TextCoordinate(camera, cameraViewWidth, cameraViewHeight, locationNameMapping) {
        try {
            const projectedLocations = {}
            Object.keys(locationNameMapping).forEach(loc => {
                let pos = new THREE.Vector3();
                pos = pos.setFromMatrixPosition(theObject.matrixWorld);
                pos.x = pos.x + (locationNameMapping[loc][0] - 2) * .2;
                pos.z = pos.z + (locationNameMapping[loc][1] - 2) * .2;
                if (pos.z >= 0) {
                    pos.y = 0.5;
                } else {
                    pos.y = -0.5;
                }

                //Project to camera coordiante
                pos = pos.project(camera);

                let widthHalf = cameraViewWidth / 2;
                let heightHalf = cameraViewHeight / 2;

                pos.x = (pos.x * widthHalf) + widthHalf;
                pos.y = (pos.y * heightHalf) + heightHalf;
                pos.z = 0;
                projectedLocations[loc] = {x: pos.x, y: pos.y};
            });
            return projectedLocations;
        } catch (e) {
            //TODO: this is only a quick fix. The text doesn't exist, just hide them
            return {x: -100, y: -100}
        }
    }

    function setOuterVisibility(isVisible) {
        topCap.visible = isVisible;
        front.visible = isVisible;
    }

    // function handle
    theObject.updateTopCapTexture = updateTopCapTexture;
    theObject.handleHorizCutPosition = handleHorizCutPosition;
    theObject.handleVertiCutAngle = handleVertiCutAngle;
    theObject.profile2TextCoordinate = profile2TextCoordinate;
    theObject.setOuterVisibility = setOuterVisibility;
    return theObject;
}
