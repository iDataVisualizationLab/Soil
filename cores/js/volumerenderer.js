function createVolumeRenderer(container, interpolatedData, width, height, horizontalInterpolatedSteps, verticalInterpolatedSteps, colorScale, controlDom) {
    function createVolumeFromInterpolatedData(interpolatedData, valueRange = [-10, 10]) {
        const t = [...interpolatedData.t];
        const r = horizontalInterpolatedSteps / 2;
        for (let idx = 0; idx < interpolatedData.t.length; idx++) {
            //Take the circle points only
            const x = interpolatedData.x[idx] + 1 - r;
            const z = interpolatedData.z[idx] + 1 - r;
            if ((x * x + z * z) > (r * r)) {
                t[idx] = 0;
            }

            // //TODO: Only filter out the values which is greater,
            // //The lower value we will use isothreshold
            // //Take the values which is in the filtered value range
            // if ((t[idx] > valueRange[1])) {
            //     t[idx] = 0.0;
            // }
            //Take the values which is in the filtered value range

            if (valueRange && ((t[idx] < valueRange[0]) || (t[idx] > valueRange[1]))) {
                t[idx] = 0.0;
            }
        }
        //Data conversion
        const volume = {
            data: Float32Array.from(t),
            xLength: verticalInterpolatedSteps,
            yLength: horizontalInterpolatedSteps,
            zLength: horizontalInterpolatedSteps,
            // isothreshold: valueRange[0] //TODO: isothreshold
        }
        return volume;
    }

    // Filter out the data which is not in the circle
    const volume = createVolumeFromInterpolatedData(interpolatedData);

    //3D
    const VolumeRenderShader1 = THREE.VolumeRenderShader1;
    const WEBGL = THREE.WEBGL;


    if (WEBGL.isWebGL2Available() === false) {
        container.appendChild("This needs WebGL2");
    }

    let renderer,
        scene,
        camera,
        orbitControls,
        material,
        volconfig,
        cmtextures,
        locationFace,
        depthFace,
        locationHelper = new THREE.Object3D(),
        self = this;

    init();

    function init() {

        //<editor-fold desc="The volume renderer">
        scene = new THREE.Scene();
        // Create renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        // Create camera (The volume renderer does not work very well with perspective yet)
        const h = 64; // frustum height
        const aspect = width / height;
        const paddingUnits = 10;
        camera = new THREE.OrthographicCamera(-h * aspect / 2 - paddingUnits, h * aspect / 2 + paddingUnits, h / 2 + paddingUnits, -h / 2 - paddingUnits, 1, 1000);
        camera.position.set(80, 25, -150);

        camera.up.set(1, 0, 0); // In our data, x is up

        // The gui for interaction
        //TODO: isothreshold
        // volconfig = {clim1: 0.0, clim2: 1, renderstyle: 'iso', isothreshold: volume.isothreshold, colormap: 'custom'};
        volconfig = {
            clim1: 0.0,
            clim2: 1,
            renderstyle: 'iso',
            isothreshold: 0.0,
            colormap: systemConfigurations.quantiles ? 'quantiles' : 'continuous',
            locationHelperVisibility: false
        };

        const texture = createTextureFromData(volume);
        // const cmCanvas = createContinuousColorMapCanvas(colorScale);
        let cmContinuousCanvas = createContinuousColorMapCanvas(colorScale);
        let cmQuantileCanvas = createColorMapCanvas(colorScale);


        cmtextures = {
            continuous: new THREE.CanvasTexture(cmContinuousCanvas),
            quantiles: new THREE.CanvasTexture(cmQuantileCanvas),
            gray: new THREE.TextureLoader().load('textures/cm_gray.png', render)
        };

        // Material
        const shader = VolumeRenderShader1;

        const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        uniforms["u_data"].value = texture;
        uniforms["u_size"].value.set(volume.xLength, volume.yLength, volume.zLength);
        uniforms["u_clim"].value.set(volconfig.clim1, volconfig.clim2);
        uniforms["u_renderstyle"].value = volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
        uniforms["u_renderthreshold"].value = volconfig.isothreshold; // For ISO renderstyle
        uniforms["u_cmdata"].value = cmtextures[volconfig.colormap];

        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
        });

        // THREE.Mesh
        const geometry = new THREE.BoxGeometry(volume.xLength, volume.yLength, volume.zLength);

        geometry.translate(volume.xLength / 2, volume.yLength / 2, volume.zLength / 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        //</editor-fold>

        //<editor-fold desc="For the location helper">
        //TODO: If feeling confusing about translation/rotation, then just add all parts
        // into the locationFace before rotating, locating them.
        //Add the top face
        const dummyCanvas = document.createElement('canvas');
        dummyCanvas.width = volume.xLength;
        dummyCanvas.height = volume.zLength;
        const locationFaceMat = new THREE.MeshPhongMaterial({
            map: new THREE.CanvasTexture(dummyCanvas), //Will be updated
            transparent: true,
            opacity: 0.99,
            side: THREE.DoubleSide,
            alphaTest: 0.1
        });
        const locationFaceGeo = new THREE.PlaneGeometry(volume.xLength, volume.zLength);
        locationFaceGeo.translate(volume.xLength / 2, volume.yLength / 2, volume.zLength / 2);
        locationFace = new THREE.Mesh(locationFaceGeo, locationFaceMat);
        locationFace.rotation.y = Math.PI / 2;
        locationFace.position.x = volume.xLength / 2;
        locationFace.position.z = volume.zLength;
        locationFace.material.map.rotation = Math.PI / 2;
        locationHelper.add(locationFace);

        const textureHandler = new TextureHandler();
        const locationFaceBottomGeo = locationFaceGeo.clone();
        const locationFaceBottomMat = new THREE.MeshPhongMaterial({
            map: textureHandler.createLocationBottomTexture(300),
            transparent: true,
            opacity: 0.99,
            side: THREE.DoubleSide,
            alphaTest: 0.1
        });
        let locationFaceBottom = new THREE.Mesh(locationFaceBottomGeo, locationFaceBottomMat);
        locationFaceBottom.position.x = -volume.xLength / 2;
        locationFaceBottom.rotation.y = Math.PI / 2;
        locationFaceBottom.position.z = volume.zLength;


        locationHelper.add(locationFaceBottom);

        const depthFaceTex = textureHandler.createDepthTexture(300);
        const depthFaceMat = new THREE.MeshPhongMaterial({
            map: depthFaceTex,
            transparent: true,
            opacity: 0.99,
            side: THREE.DoubleSide,
            alphaTest: 0.1
        });

        const depthFaceGeo = new THREE.PlaneGeometry(volume.xLength, volume.yLength);
        // depthFaceGeo.translate(volume.xLength / 2, volume.yLength / 2, volume.zLength / 2);
        depthFace = new THREE.Mesh(depthFaceGeo, depthFaceMat);
        depthFace.rotation.x = Math.PI;
        depthFace.rotation.z = -Math.PI / 2;
        depthFace.position.x = volume.xLength / 2;
        depthFace.position.y = volume.yLength / 2;
        depthFace.position.z = volume.zLength / 2;
        locationHelper.add(depthFace);
        locationHelper.visible = volconfig.locationHelperVisibility;
        scene.add(locationHelper);
        //</editor-fold>

        //<editor-fold desc="Orbit controls">
        // Create controls
        if (!controlDom) {
            controlDom = renderer.domElement;
        }
        orbitControls = createOrbitControls(camera, controlDom);
        orbitControls.addEventListener('change', () => {
            //Do not rotate the depth plane
            depthFace.rotation.x = orbitControls.getAzimuthalAngle();
            render();
        });
        orbitControls.target.set(volume.xLength / 2, volume.yLength / 2, volume.zLength / 2);
        //Expose it
        self.orbitControls = orbitControls;

        //
        orbitControls.update();
        //</editor-fold>

        render();
    }

    function createTextureFromData(volume) {
        const texture = new THREE.DataTexture3D(volume.data, volume.xLength, volume.yLength, volume.zLength);
        texture.format = THREE.RedFormat;
        texture.type = THREE.FloatType;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        return texture;
    }

    function updateUniforms() {
        material.uniforms["u_clim"].value.set(volconfig.clim1, volconfig.clim2);
        material.uniforms["u_renderstyle"].value = volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
        material.uniforms["u_renderthreshold"].value = volconfig.isothreshold; // For ISO renderstyle
        material.uniforms["u_cmdata"].value = cmtextures[volconfig.colormap];
        render();
    }

    function render() {
        renderer.render(scene, camera);
    }

    function handleDataChange(interpolatedData, valueRange) {
        const volume = createVolumeFromInterpolatedData(interpolatedData, valueRange);
        const texture = createTextureFromData(volume);
        material.uniforms['u_data'].value = texture;
        // //TODO: These two lines are for the smooth rendering
        // volconfig.isothreshold = volume.isothreshold;
        // material.uniforms["u_renderthreshold"].value = volconfig.isothreshold; // For ISO renderstyle
        render();
    }

    function changeRenderStyle(value) {
        volconfig.renderstyle = value;
        updateUniforms();
    }

    function changeLocationFace(newTexture) {
        locationFace.material.map = newTexture;
        locationFace.material.map.rotation = Math.PI / 2;
        locationFace.material.map.needsUpdate = true;
    }

    function changeDepthFace(newTexture) {
        depthFace.material.map = newTexture;
        depthFace.material.map.needsUpdate = true;
    }

    function setLocationHelperVisiblity(isVisible) {
        volconfig.locationHelperVisibility = isVisible;
        locationHelper.visible = isVisible;
        render();
    }

    function changeColorType(colorMapType) {
        volconfig.colormap = colorMapType;
        updateUniforms();
        render();
    }

    //Exposing handlers
    this.handleDataChange = handleDataChange;
    this.changeRenderStyle = changeRenderStyle;
    this.changeLocationFace = changeLocationFace;
    this.changeDepthFace = changeDepthFace;
    this.setLocationHelperVisiblity = setLocationHelperVisiblity;
    this.changeColorType = changeColorType;
    return this;
}

function createColorMapCanvas(colorScale, height = 1) {
    const width = 256;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    const widthScale = new d3.scaleLinear().domain([0, 1]).range([0, width]);
    const step = colorScale.domain()[0];
    colorScale.domain().forEach(val => {
        ctx.fillStyle = colorScale(val - step);//The -step here is because our rect start at 0 while the color scale has the value at the upper bound (threshold)
        ctx.fillRect(widthScale(val - step), 0, width / colorScale.domain().length, height);
    });
    return canvas;
}

function createContinuousColorMapCanvas(inputColorScale) {
    const width = 256;
    const height = 1;
    const canvas = document.createElement("canvas");
    const colorScale = d3.scaleLinear().domain(inputColorScale.domain()).range(inputColorScale.range())
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    const widthScale = new d3.scaleLinear().domain([0, width]).range([0, 1]);
    for (let i = 0; i < width; i++) {
        ctx.fillStyle = colorScale(widthScale(i));
        ctx.fillRect(i, 0, 1, height);
    }

    return canvas;
}
