let ThreeDScences = function (renderer, profileName) {
    this.setupElementScene1 = setupElementScene1;
    this.setupElementScene2 = setupElementScene2;
    this.renderSceneInfo = renderSceneInfo;
    this.setupElementScenes = setupElementScenes;

    function setupElementScenes(elementInfos) {
        elementInfos[0] = setupElementScene1(elementInfos[0]);
        elementInfos[1] = setupElementScene2(elementInfos[1]);
    }

    function setupElementScene1(elementInfo1) {
        return setupElementScene('detailChart1', elementInfo1);
    }

    function setupElementScene2(elementInfo2) {
        return setupElementScene('detailChart2', elementInfo2);
    }

    function makeScene(elem) {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(0, 1, 1.85);
        scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xffffff, 1));
        return {scene, camera, elem};
    }

    function setupElementScene(elementId, sceneInfo) {
        if (!sceneInfo) {
            sceneInfo = makeScene(document.querySelector(`#${elementId}`));
        }

        if (sceneInfo.theProfile) {
            sceneInfo.scene.remove(sceneInfo.theProfile);
        }
        // if (sceneInfo.horizCutPlane) {
        //     sceneInfo.scene.remove(sceneInfo.horizCutPlane);
        // }
        let horizCutY = -0.5;

        const ret = createProfileObject(horizCutY, profileName);
        const theProfile = ret.theObject;
        const the3Cuts = ret.the3Cuts;


        // const horizCutPlane = createHorizontalCutPlane(horizCutY);
        scene.add(theProfile);
        //Add the three cuts to scene
        scene.add(the3Cuts);
        // scene.add(horizCutPlane);
        sceneInfo.theProfile = theProfile;
        sceneInfo.the3Cuts = the3Cuts;
        // sceneInfo.horizCutPlane = horizCutPlane;

        return sceneInfo;
    }

    function renderSceneInfo(sceneInfo) {
        const {scene, camera, elem} = sceneInfo;
        // Get the viewport relative position of this element
        const {left, right, top, bottom, width, height} = elem.getBoundingClientRect();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const positiveYUpBottom = window.innerHeight - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);
        renderer.render(scene, camera);
    }
}
