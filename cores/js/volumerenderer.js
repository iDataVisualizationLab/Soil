function createVolumeRenderer(container, interpolatedData, width, height, horizontalInterpolatedSteps, verticalInterpolatedSteps, colorScale, gui) {
    function createVolumeFromInterpolatedData(interpolatedData, valueRange = [0, 1]) {
        const t = [...interpolatedData.t];
        const r = horizontalInterpolatedSteps / 2;
        for (let idx = 0; idx < interpolatedData.t.length; idx++) {
            //Take the circle points only
            const x = interpolatedData.x[idx] + 1 - r;
            const z = interpolatedData.z[idx] + 1 - r;
            if ((x * x + z * z) > (r * r)) {
                t[idx] = 0;
            }
            //Take the values which is in the filtered value range
            if ((t[idx] < valueRange[0]) || t[idx] > valueRange[1]) {
                t[idx] = 0;
            }
        }
        //Data conversion
        const volume = {
            data: Float32Array.from(t),
            xLength: verticalInterpolatedSteps,
            yLength: horizontalInterpolatedSteps,
            zLength: horizontalInterpolatedSteps
        }
        return volume;
    }

    // Filter out the data which is not in the circle
    const volume = createVolumeFromInterpolatedData(interpolatedData);

    //3D
    const GUI = dat.GUI;
    const OrbitControls = THREE.OrbitControls;
    const VolumeRenderShader1 = THREE.VolumeRenderShader1;
    const WEBGL = THREE.WEBGL;


    if (WEBGL.isWebGL2Available() === false) {
        container.appendChild(WEBGL.getWebGL2ErrorMessage());
    }

    let renderer,
        scene,
        camera,
        controls,
        material,
        volconfig,
        cmtextures,
        locationFace;

    init();

    function init() {
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
        camera = new THREE.OrthographicCamera(-h * aspect / 2, h * aspect / 2, h / 2, -h / 2, 1, 1000);
        camera.position.set(50, 42, -69);
        camera.rotation.set(-2.921, 0.272, 1.571);


        camera.up.set(1, 0, 0); // In our data, x is up

        // Create controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);
        controls.target.set(volume.xLength / 2, volume.yLength / 2, volume.zLength / 2);
        //
        controls.enableZoom = false;
        controls.enablePan = false;
        //
        controls.rotateSpeed = 0.3;

        controls.update();

        // The gui for interaction
        volconfig = {clim1: 0, clim2: 1, renderstyle: 'iso', isothreshold: 0.0, colormap: 'custom'};
        if (!gui) {
            gui = new GUI();
        }
        const texture = createTextureFromData(volume);
        const cmCanvas = createContinuousColorMapCanvas(colorScale);

        cmtextures = {
            custom: new THREE.CanvasTexture(cmCanvas),
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
            side: THREE.BackSide // The volume shader uses the backface as its "reference point"
        });

        // THREE.Mesh
        const geometry = new THREE.BoxGeometry(volume.xLength, volume.yLength, volume.zLength);
        geometry.translate(volume.xLength / 2, volume.yLength / 2, volume.zLength / 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

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
        locationFace.rotation.y = Math.PI/2;
        locationFace.position.x = volume.xLength/2;
        locationFace.position.z = volume.zLength;
        locationFace.material.map.rotation = Math.PI/2;
        scene.add(locationFace);

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
        render();
    }

    function changeRenderStyle(value) {
        volconfig.renderstyle = value;
        updateUniforms();
    }

    function changeLocationFace(newTexture) {
        locationFace.material.map = newTexture;
        locationFace.material.map.rotation = Math.PI/2;
        locationFace.material.map.needsUpdate = true;
    }

    //Exposing handlers
    this.handleDataChange = handleDataChange;
    this.changeRenderStyle = changeRenderStyle;
    this.changeLocationFace = changeLocationFace;

    return this;
}

function createColorMapCanvas(colorScale) {
    const width = 256;
    const height = 1;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    const widthScale = new d3.scaleLinear().domain([0, 1]).range([0, width]);
    colorScale.domain().forEach(val => {
        ctx.fillStyle = colorScale(val);
        ctx.fillRect(widthScale(val), 0, width / colorScale.domain().length, 1);
    });
    return canvas;
}

function createContinuousColorMapCanvas(colorScale) {
    const width = 256;
    const height = 1;
    const canvas = document.createElement("canvas");
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
