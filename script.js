import * as THREE from "three";
import { MindARThree } from "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "cards.mind",
    filterMinCF: 0.0001,         // default: 0.001   (decrease the value to make it less jittery)
    filterBeta: 200,             // default: 1000    (increase the value to reduce the delay)
    warmupTolerance: 0,          // default: 5
    missTolerance: 10,           // default: 5
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

// Share Button
const shareButton = document.getElementById("shareBtn");

shareButton.addEventListener("click", shareWebsite);

async function shareWebsite() {
    console.log("Share button clicked");
    try {

        // Load image from project
        const response = await fetch("upicon.jpg");
        const blob = await response.blob();

        // Convert Blob to File
        const file = new File(
            [blob],
            "upicon.jpg",
            {
                type: "image/jpeg"
            }
        );

        // Check browser support
        if (navigator.canShare && navigator.canShare({ files: [file] })) {

            await navigator.share({
                title: "My Website",
                text: "Check out my website!\nhttps://rakeshkryadav.github.io/rakeshkr-yadav/",
                files: [file]
            });

        } else {

            alert("Your browser doesn't support file sharing.");

        }

    }
    catch(err){
        console.error(err);
    }

}