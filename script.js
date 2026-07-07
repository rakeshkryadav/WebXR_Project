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

const clock = new THREE.Clock();
let mixer;

const billboard = new THREE.Group();
anchor.group.add(billboard);

loader.load("model.glb",(gltf)=>{

    gltf.scene.scale.set(0.6,0.6,0.6);

    // Create Model
    anchor.group.add(gltf.scene);

    // Create animation mixer
    mixer = new THREE.AnimationMixer(gltf.scene);

    // Play all animations in the GLB
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });

});

loader.load("text.glb", (gltf) => {
    // anchor.group.add(gltf.scene);
    gltf.scene.position.set(0.7, 0, 3);
    gltf.scene.scale.set(0.6,0.6,0.6);
    billboard.add(gltf.scene);
});

await mindarThree.start();

renderer.setAnimationLoop(()=>{
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    billboard.lookAt(camera.position);
    
    renderer.render(scene,camera);

});