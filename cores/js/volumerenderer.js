function createVolumeRenderer(container, interpolatedData, width, height, horizontalInterpolatedSteps, verticalInterpolatedSteps, colorScale, gui) {
    // Filter out the data which is not in the circle
    debugger
    const t = [...interpolatedData.t];
    const r = horizontalInterpolatedSteps / 2;
    for (let idx = 0; idx < interpolatedData.t.length; idx++) {
        const x = interpolatedData.x[idx] + 1 - r;
        const z = interpolatedData.z[idx] + 1 - r;
        if ((x * x + z * z) > (r * r)) {
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
        cmtextures;

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


        camera.up.set(1, 0, 0); // In our data, -y is up

        // Create controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);
        controls.target.set(volume.xLength / 2, volume.yLength / 2, volume.zLength / 2);
        controls.enableZoom = false;
        controls.enablePan = false;

        controls.update();



        // scene.add( new AxesHelper( 128 ) );

        // Lighting is baked into the shader a.t.m.
        // let dirLight = new DirectionalLight( 0xffffff );

        // The gui for interaction
        volconfig = {clim1: 0, clim2: 1, renderstyle: 'iso', isothreshold: 0.1, colormap: 'custom'};
        if (!gui) {
            gui = new GUI();
        }
        gui.add(volconfig, 'clim1', 0, 1, 0.01).onChange(updateUniforms);
        gui.add(volconfig, 'clim2', 0, 1, 0.01).onChange(updateUniforms);
        gui.add(volconfig, 'colormap', {gray: 'gray', custom: 'custom'}).onChange(updateUniforms);
        gui.add(volconfig, 'renderstyle', {mip: 'mip', iso: 'iso'}).onChange(updateUniforms);
        gui.add(volconfig, 'isothreshold', 0, 1, 0.01).onChange(updateUniforms);

        const texture = createTextureFromData(volume);

        // Colormap textures
        const cmCanvas = createColorMapCanvas(colorScale);
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
            // side: THREE.FrontSide
        });

        // THREE.Mesh
        const geometry = new THREE.BoxGeometry(volume.xLength, volume.yLength, volume.zLength);
        geometry.translate(volume.xLength / 2, volume.yLength / 2, volume.zLength / 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

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

    function handleDataChange(interpolatedData) {
        const volume = {
            data: Float32Array.from(interpolatedData.t),
            xLength: horizontalInterpolatedSteps,
            yLength: verticalInterpolatedSteps,
            zLength: horizontalInterpolatedSteps
        };
        const texture = createTextureFromData(volume);
        material.uniforms['u_data'].value = texture;
        render();
    }

    //Exposing handlers
    this.handleDataChange = handleDataChange;
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
