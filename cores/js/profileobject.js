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
    const the3Cuts = new THREE.Object3D();
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

    //<editor-fold desc="The vertical cut">
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
    const horizCutMat = new THREE.MeshLambertMaterial({
        map: horizCutTexture,
        side: THREE.DoubleSide
    });
    const horizCut = new THREE.Mesh(horizCutGeo, horizCutMat);
    horizCut.position.y = horizCutY;
    horizCut.name = 'horizCut';
    theObject.add(horizCut);

    //Add the border for the mouseover/drag
    const highlightRingGeo = new THREE.RingGeometry(0.5, 0.51, 100);
    const highlightRingMat = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
    const highlightRing = new THREE.Mesh(highlightRingGeo, highlightRingMat);
    highlightRing.position.y = horizCutY;
    highlightRing.rotation.x = Math.PI / 2;
    highlightRing.visible = false;
    theObject.add(highlightRing);

    function setHighlightRingVisibility(isVisible) {
        highlightRing.visible = isVisible;
    }

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

    //<editor-fold desc="The 3 cuts">
    // xCut
    const cutX = 0.0;
    const xCutTexture = textureLoader.load('./data/images/L.jpg');
    xCutTexture.center.x = 0.5;
    xCutTexture.center.y = 0.5;
    const xCutMat = new THREE.MeshLambertMaterial({
        map: xCutTexture,
        side: THREE.DoubleSide
    });
    const xCutGeo = new THREE.PlaneGeometry(1, 1);
    const xCut = new THREE.Mesh(xCutGeo, xCutMat);
    xCut.name = "xCut";
    xCut.position.x = cutX;
    xCut.rotation.y = Math.PI / 2;
    the3Cuts.add(xCut);
    //yCut
    const cutY = 0.0;
    const yCutTexture = textureLoader.load('./data/images/L.jpg');
    yCutTexture.center.x = 0.5;
    yCutTexture.center.y = 0.5;
    const yCutMat = new THREE.MeshLambertMaterial({
        map: yCutTexture,
        side: THREE.DoubleSide
    });
    const yCutGeo = new THREE.PlaneGeometry(1, 1);
    const yCut = new THREE.Mesh(yCutGeo, yCutMat);
    yCut.name = "yCut";
    yCut.position.y = cutY;
    yCut.rotation.x = -Math.PI / 2;
    the3Cuts.add(yCut);
    //zCut
    const cutZ = 0.0;
    const zCutTexture = textureLoader.load('./data/images/L.jpg');
    zCutTexture.center.x = 0.5;
    zCutTexture.center.y = 0.5;
    const zCutMat = new THREE.MeshLambertMaterial({
        map: zCutTexture,
        side: THREE.DoubleSide
    });
    const zCutGeo = new THREE.PlaneGeometry(1, 1);
    const zCut = new THREE.Mesh(zCutGeo, zCutMat);
    zCut.name = "zCut";
    zCut.position.z = cutZ;
    the3Cuts.add(zCut);

    //</editor-fold>

    //<editor-fold desc="Handlers">
    function handleHorizCutPosition(theHorizCutY, texture) {
        horizCutY = theHorizCutY;
        horizCut.position.y = horizCutY;
        highlightRing.position.y = horizCutY;
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
        topCap.material.map.rotation = -theVertiCutAngle;
        topCap.material.needsUpdate = true;

        horizCut.material.map.rotation = -theVertiCutAngle;
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
    }

    function setOuterVisibility(isVisible) {
        topCap.visible = isVisible;
        front.visible = isVisible;
        back.visible = isVisible;
    }

    function setHorizCutVisibility(isVisible) {
        horizCut.visible = isVisible;
    }

    function setVertiCutVisibility(isVisible) {
        vertiCut.visible = isVisible;
    }

    function setXCutVisibility(isVisible) {
        xCut.visible = isVisible;
    }

    function setYCutVisibility(isVisible) {
        yCut.visible = isVisible;
    }

    function setZCutVisibility(isVisible) {
        zCut.visible = isVisible;
    }

    function handleXCutPosition(theCutX, texture) {
        if (texture) {
            xCut.material.map = texture;
            xCut.material.map.needsUpdate = true;
        }
    }

    function handleYCutPosition(theCutY, texture) {
        if (texture) {
            yCut.material.map = texture;
            yCut.material.map.needsUpdate = true;
        }
    }

    function handleZCutPosition(theCutZ, texture) {
        if (texture) {
            zCut.material.map = texture;
            zCut.material.map.needsUpdate = true;
        }
    }

    //</editor-fold>

    // Expose handlers
    theObject.updateTopCapTexture = updateTopCapTexture;
    theObject.handleHorizCutPosition = handleHorizCutPosition;
    theObject.handleVertiCutAngle = handleVertiCutAngle;
    theObject.setOuterVisibility = setOuterVisibility;
    theObject.setHorizCutVisibility = setHorizCutVisibility;
    theObject.setVertiCutVisibility = setVertiCutVisibility;
    if (!systemConfigurations.cylinderView) {
        setOuterVisibility(false);
        setHorizCutVisibility(false);
        setVertiCutVisibility(false);
    }
    // expose this object to setup draggable
    theObject.horizCut = horizCut;
    theObject.setHighlightRingVisibility = setHighlightRingVisibility;

    the3Cuts.handleXCutPosition = handleXCutPosition;
    the3Cuts.handleYCutPosition = handleYCutPosition;
    the3Cuts.handleZCutPosition = handleZCutPosition;
    the3Cuts.xCut = xCut;
    the3Cuts.yCut = yCut;
    the3Cuts.zCut = zCut;
    the3Cuts.setXCutVisibility = setXCutVisibility;
    the3Cuts.setYCutVisibility = setYCutVisibility;
    the3Cuts.setZCutVisibility = setZCutVisibility;
    if (systemConfigurations.cylinderView) {
        setXCutVisibility(false);
        setYCutVisibility(false);
        setZCutVisibility(false);
    }

    return {theObject: theObject, the3Cuts: the3Cuts};
}
