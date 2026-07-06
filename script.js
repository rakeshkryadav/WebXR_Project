import * as THREE from "three";

import { MindARThree } from "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "card.mind"
});

const {renderer, scene, camera} = mindarThree;

const light = new THREE.HemisphereLight(0xffffff,0xbbbbff,1);
scene.add(light);

const anchor = mindarThree.addAnchor(0);

const loader = new GLTFLoader();

loader.load("cube.glb",(gltf)=>{

    gltf.scene.scale.set(0.3,0.3,0.3);
    gltf.scene.rotation.x = Math.PI / 2;

    anchor.group.add(gltf.scene);

});

await mindarThree.start();

renderer.setAnimationLoop(()=>{

    renderer.render(scene,camera);

});