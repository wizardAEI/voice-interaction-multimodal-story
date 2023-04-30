import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { nodeServerUrl } from "../../../pkg/config/url";

/**
 * Base
 */


let numAnimations = 0,
  mixer: THREE.AnimationMixer,
  clock: THREE.Clock,
  stats: Stats;
let baseActions: {
  [key: string]: {
    weight: number;
    action: THREE.AnimationAction | null;
  };
} = {}
let currentActionName = 'Idle.001'
export function initXiaoXiao() {
  // Canvas
  const canvas = document.querySelector(".webgl-canvas") as HTMLCanvasElement;

  clock = new THREE.Clock();
  // 忽略类型检查
  // @ts-ignore
  stats = new Stats()
  canvas.appendChild(stats.dom)
  // Scene
  const scene = new THREE.Scene();
  const tloader = new THREE.TextureLoader();
  const bgTexture = tloader.load(nodeServerUrl + '/assets/blender/bac/room.png');
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
  loader.loadAsync(nodeServerUrl + "/assets/blender/scenario.glb").then((scenarioGltf) => { 
    const model = scenarioGltf.scene;
    model.position.set(0, -6, -1);
    model.scale.set(2, 2, 2);
    model.rotateY(-Math.PI / 4);
    scene.add(model);
    loader.load(nodeServerUrl + "/assets/blender/xiaoxiao.glb", (gltf) => {
      console.log(gltf);
      const model = gltf.scene;
      model.position.set(0, -5.7, 3);
      model.scale.set(2, 2, 2);
      scene.add(gltf.scene);
      const animations = gltf.animations;
      mixer = new THREE.AnimationMixer(model);
      // change the time scale of the mixer (speed)
      mixer.timeScale = 0.5;
  
      numAnimations = animations.length;
      console.log("animations", animations);
      for (let i = 0; i !== numAnimations; ++i) {
      let clip = animations[i];
        const action = mixer.clipAction(clip);
        baseActions[clip.name] = {
          weight: clip.name === 'Idle.001' ? 1 : 0,
          action: action
        }
        activateAction(action);
      }
      tick();
    });
  })
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
    antialias: true,
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

    

    const mixerUpdateDelta = clock.getDelta();

    // Update the animation mixer, the stats panel, and render this frame

    mixer.update( mixerUpdateDelta );

    stats.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  function setWeight( action: THREE.AnimationAction, weight: number ) {

    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );

  }
  // 重置动画
  function activateAction( action: THREE.AnimationAction ) {
    const clip = action.getClip();
    const settings = baseActions[ clip.name ];
    setWeight( action, settings.weight );
    action.play();
  }
  // chage animation
  function changeAnimation( actionName: string) {
      setWeight( baseActions[ currentActionName ].action!, 0)
      setWeight( baseActions[ actionName ].action!, 1)
  }

  setTimeout(() => {
    changeAnimation("waving")
  }, 3000)
}