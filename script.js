import * as THREE from "three";
import { MindARThree } from "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "cards.mind"
});

const { renderer, scene, camera } = mindarThree;

scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));

const loader = new GLTFLoader();
const clock = new THREE.Clock();

const mixers = [];
const billboards = [];

// Create an anchor for each image target
for (let i = 0; i < 3; i++) {

    const anchor = mindarThree.addAnchor(i);

    const billboard = new THREE.Group();
    anchor.group.add(billboard);
    billboards.push(billboard);

    // Load the model
    loader.load("model.glb", (gltf) => {

        gltf.scene.scale.set(0.6, 0.6, 0.6);
        gltf.scene.position.set(0, 0.5, 0);

        anchor.group.add(gltf.scene);

        if (gltf.animations.length > 0) {
            // Create an AnimationMixer
            const mixer = new THREE.AnimationMixer(gltf.scene);

            // Play all animations
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });

            mixers.push(mixer);
        }

    });

    // Load the same text
    loader.load("text.glb", (gltf) => {

        gltf.scene.scale.set(0.6, 0.6, 0.6);
        gltf.scene.position.set(0, -0.5, 0);

        billboard.add(gltf.scene);

    });
}

await mindarThree.start();

renderer.setAnimationLoop(() => {

    const delta = clock.getDelta();

    mixers.forEach((mixer) => mixer.update(delta));

    billboards.forEach((billboard) => {
        billboard.lookAt(camera.position);
    });

    renderer.render(scene, camera);

});