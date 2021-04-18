function setup3dview(container, config) {
    let cylinderSettings = {
        radius: 6,
        height: 6,
        y: 1
    }
    let renderer, scene, camera, cylinder;
    let verticalCutPlane;
    let horizontalCutPlane;
    let orbitControls, dragControls;
    let width = config.width;
    let height = config.height;
    let verticalCutPlaneName = "verticalCutPlane", horizontalCutPlaneName = "horizontalCutPlane";

    function init() {
        // Scene
        scene = new THREE.Scene();
        // Add an ambient light
        scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        // Renderer
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(0xffffff, 1.0);
        renderer.setSize(width, height);
        // Camera
        camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        camera.position.x = 0;
        camera.position.y = 8;
        camera.position.z = 16;
        camera.lookAt(scene.position);

        //Light
        let spotLight = new THREE.SpotLight(0xffffff, 0.1);
        spotLight.position.set(10, 15, 15);
        scene.add(spotLight);
        //Add cylinder
        addProfileCylinder(scene);
        verticalCutPlane = addVerticalCutPlane(scene);
        horizontalCutPlane = addHorizontalCutPlane(scene);

        // Add controls
        addOrbitControls();
        addDragControls([verticalCutPlane]);
        //Add the renderer element to the document
        container.appendChild(renderer.domElement);

        //Render for the first time
        render();
    }

    function render() {
        orbitControls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);

    }


    function addOrbitControls() {
        //Control the camera
        orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControls.enableZoom = false;
        orbitControls.addEventListener("change", function (event) {
            horizontalCutPlane.rotation.y = orbitControls.getAzimuthalAngle();
            verticalCutPlane.rotation.z = orbitControls.getAzimuthalAngle();
        });
    }

    function addDragControls(draggableObjects) {
        let vertPlaneX, vertPlaneZ;
        dragControls = new THREE.DragControls(draggableObjects, camera, renderer.domElement);
        dragControls.addEventListener('hoveron', function (event) {
            event.object.material.emissive.set(0xaa0000);
        });
        dragControls.addEventListener('hoveroff', function (event) {
            event.object.material.emissive.set(0x000000);
        });
        dragControls.addEventListener("dragstart", function (event) {
            orbitControls.enabled = false;
            if (event.object.name === verticalCutPlaneName) {
                vertPlaneX = event.object.position.x;
                vertPlaneZ = event.object.position.z;
            }
        });
        dragControls.addEventListener("drag", function (event) {
            if (event.object.name === verticalCutPlaneName) {
                event.object.position.x = vertPlaneX;
                event.object.position.z = vertPlaneZ;
                if (event.object.position.y >= cylinder.position.y + cylinderSettings.height / 2) {
                    event.object.position.y = cylinder.position.y + cylinderSettings.height / 2 - 1 / 1000;
                }
                if (event.object.position.y < cylinder.position.y - cylinderSettings.height / 2) {
                    event.object.position.y = cylinder.position.y - cylinderSettings.height / 2;
                }
            }
        });
        dragControls.addEventListener("dragend", function (event) {
            orbitControls.enabled = true;
        });
    }

    function addProfileCylinder(scene) {
        let cylinderGeo = new THREE.CylinderGeometry(cylinderSettings.radius, cylinderSettings.radius, cylinderSettings.height, 50, 10);
        let sideTexture = new THREE.TextureLoader().load('./data/images/side.jpg');
        let sideMat = new THREE.MeshLambertMaterial({map: sideTexture});
        let capTopTexture = new THREE.TextureLoader().load('./data/images/L.jpg');
        let capTopMat = new THREE.MeshLambertMaterial({map: capTopTexture});
        let capBottomMat = new THREE.MeshLambertMaterial({color: 0x4F4638});
        const cylinderMaterials = [
            sideMat,
            capTopMat,
            capBottomMat
        ];
        cylinder = new THREE.Mesh(cylinderGeo, cylinderMaterials);
        cylinder.rotation.y = Math.PI / 2;
        cylinder.position.y = cylinderSettings.y;
        scene.add(cylinder);
    }

    function addHorizontalCutPlane(scene) {
        let planeGeometry = new THREE.PlaneGeometry(cylinderSettings.radius * 2, cylinderSettings.radius * 1.1);
        let planeMaterial = new THREE.MeshLambertMaterial(
            {
                color: 0xcccccc,
                side: THREE.DoubleSide
            }
        );
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = cylinder.position.y;
        scene.add(plane);
        plane.name = horizontalCutPlaneName;
        return plane;
    }

    function addVerticalCutPlane(scene) {
        let planeGeometry = new THREE.PlaneGeometry(cylinderSettings.radius * 2, cylinderSettings.radius * 2);
        let planeMaterial = new THREE.MeshLambertMaterial(
            {
                color: 0xcccccc,
                side: THREE.DoubleSide
            }
        );
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = -0.5 * Math.PI;
        scene.add(plane);
        plane.name = verticalCutPlaneName;
        return plane;
    }

    //Start it
    window.onload = init;

}
