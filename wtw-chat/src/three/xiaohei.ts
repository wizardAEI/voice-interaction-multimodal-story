import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { nodeServerUrl } from "../../../pkg/config/url";

type pose = "mouth" | "tail";

/**
 * Base
 */


let numAnimations = 0,
  mixer: THREE.AnimationMixer,
  clock: THREE.Clock;
const baseActions: {
  [key: string]: {
    weight: number;
    action: THREE.AnimationAction | null;
  };
} = {
  standing: { weight: 1, action: null },
  talking: { weight: 0, action: null },
};

export function initXiaoHei() {
  // Canvas
  const canvas = document.querySelector(".webgl-canvas") as HTMLCanvasElement;
  // Scene
  const scene = new THREE.Scene();
  const tloader = new THREE.TextureLoader();
  const bgTexture = tloader.load(nodeServerUrl + '/glb/bac/xiaohei.png');
  scene.background = bgTexture;
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);

  /**
   * Object
   */
  const loader = new GLTFLoader();
  loader.load(nodeServerUrl + "/glb/xiaohei.glb", (gltf) => {
    console.log(gltf);
    const model = gltf.scene;
    model.position.set(0, -6, 1);
    model.scale.set(2, 2, 2);
    scene.add(gltf.scene);
    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);

    numAnimations = animations.length;
    console.log("animations", animations);
    for (let i = 0; i !== numAnimations; ++i) {
      let clip = animations[i];
      if (clip.name === 'mouth' || 'tail') {
        const action = mixer.clipAction(clip);
        // TODO 查明为什么这里action为undefined
        // baseActions[clip.name].action = action; 
      }
    }
  });

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  window.addEventListener("resize", () => {
    // update camera
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;

    //update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    //update renderer
    renderer.setSize(sizes.width, sizes.height);

    //update Ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
  });

  /**
   * double click to fullScreen
   */
  window.addEventListener("dblclick", () => {
    const fullScreen = document.fullscreenElement;
    if (!fullScreen) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 12;
  camera.position.y = 1;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });  
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3)); // fix pixelRatio

  /**
   * Animate
   */

  const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // action
    baseActions['tail']?.action && baseActions['tail'].action.play()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}